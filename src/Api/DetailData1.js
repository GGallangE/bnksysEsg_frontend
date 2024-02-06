import "./DetailData1.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import React from "react";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import Container from "react-bootstrap/Container";
import FormatDate from "../Format/FormatDate";
import { Link } from "react-router-dom";
import ScheduleModal from "../Modal/ScheduleModal";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
// import EditToolbar from '../Component/EditToolbar';
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import KeyboardArrowDownIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import FileDownload from "../Modal/FileDownload";
import CircleIcon from '@mui/icons-material/Circle';
//import Parser from "react-xml-parser";

//const API_KEY = process.env.REACT_APP_API_KEY;

function DetailData1(props) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [data, setData] = useState([]);
  const [usecaseData, setUsecaseData] = useState([]);
  const [content, setContent] = useState("");
  const [array, setArray] = useState([]);
  const [error, setError] = useState(null);
  const [usecaseError, setUsecaseError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [fileModalShow, setFileModalShow] = useState(false);
  const [usecaseTableData, setUsecaseTableData] = useState([]); //각 셀의 입력 값을 관리할 상태 변수
  const [tableData, setTableData] = useState([]); //각 셀의 입력 값을 관리할 상태 변수
  const [formData, setFormData] = useState([]);
  const [serverData, setServerData] = useState([]);
  const [columnsOutput, setColumnsOutput] = useState([]);
  const [rowsOutput, setRowsOutput] = useState([]);
  const [rowModesModelOutput, setRowModesModelOutput] = useState({});
  const [serverDataOutput, setServerDataOutput] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);


  // const handleEditCellChange = (params) => {
  //   debugger
  //   const { id, field, props, value } = params;
  //   // processRowUpdate 함수가 행 id, 필드 및 새 값이 필요한 경우를 가정합니다.
  //   processRowUpdate({ id, field, value });
  // };

  const handleModalShow = () => {
    // 모달이 열릴 때 실행할 작업들
    handleAddRow();
  };

  const handleProcessRowUpdateError = (error) => {
    console.log(error);
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };

    const newRows = rows.map((row) =>
      row.id === newRow.id ? { ...updatedRow } : row
    );
    setRows(newRows);
    //console.log("updateRow", updatedRow);
    //console.log("rows", rows);
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowModesModelChangeOutput = (newRowModesModel) => {
    setRowModesModelOutput(newRowModesModel);
  };

  //새로운 행 추가 버튼
  const EditToolbar = (props) => {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = randomId();
      const newEmptyRow = { id, isNew: true };

      // Set default values for each column
      columns.forEach((column) => {
        newEmptyRow[column.field] = "";
      });

      setRows((oldRows) => [...oldRows, newEmptyRow]);

      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: {
          mode: GridRowModes.Edit,
          fieldToFocus: columns[0]?.field || "",
        },
      }));
    };

    const handleDeleteClick = (ids) => () => {
      setRows(rows.filter((row) => !ids.includes(row.id)));
      // setRows(rows.filter((row) => row.id !== id));
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
        <Button
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteClick(rowSelectionModel)}
        >
          삭제
        </Button>
      </GridToolbarContainer>
    );
  };

  useEffect(() => {
    requiredItem();
  }, []);

  //입력값 grid에 필수 값 컬럼 설정
  useEffect(() => {
    if (serverData.length > 0) {
      const columnKeys = serverData.map((item) => ({
        field: item.rqrdrqstnm,
        headerName: item.rqrditemnm,
        width: 150,
        editable: true,
      }));
      setColumns(columnKeys);
      handleAddRow();
    }
  }, [serverData]);

  //입력값 grid 새로운 행 추가
  const handleAddRow = () => {
    const newRowId = randomId(); // 함수 내에서 유일한 ID를 생성하는 함수 사용
    const newEmptyRow = { id: newRowId, isNew: true }; // 예시: id와 isNew 속성을 가진 빈 행

    // 기존 행들과 새로운 행을 합쳐서 업데이트
    setRows((prevRows) => [...prevRows, newEmptyRow]);

    // 새로운 행에 대한 수정 모드를 설정
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [newRowId]: {
        mode: "edit", // 수정 모드로 설정
        fieldToFocus: columns[0]?.field || "", // 포커스할 필드 설정 (예시: 첫 번째 컬럼)
      },
    }));
  };

  //입력필수값 요청
  const requiredItem = async () => {
    try {
      const response = await axios.get("/spring/api/getrequired_items", {
        params: {
          apilistid: props.apilistid,
        },
      });
      setServerData(response.data);
      console.log('serverData', response.data);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  //api 출력값 요청
  const handleSendDataToServer = async () => {
    try {
      const dataToSend = rows.map(({ id, isNew, ...rest }) => rest);
      console.log(dataToSend);
      const response = await axios.post("/spring/api/request", {
        apilistid: props.apilistid,
        params: dataToSend,
      });
      console.log(response);
      // 받은 데이터를 가공하여 DataGrid에 맞게 설정
      const id = randomId();

      const responseData = response.data.data;
      const formattedRows = responseData.map((item, index) => ({
        id: index,
        ...item,
      }));

      //출력 DataGrid colum설정
      const formattedColumns = Object.keys(response.data.data[0]).map(
        (key) => ({
          field: key,
          headerName: key,
          width: 150,
          editable: false,
        })
      );

      // DataGrid에 적용
      setRowsOutput(formattedRows);
      setColumnsOutput(formattedColumns);

      // 각 행의 수정 모드를 설정
      const newRowModesModel = {};
      formattedRows.forEach((row) => {
        newRowModesModel[row.id] = {
          mode: "edit",
          fieldToFocus: formattedColumns[0]?.field || "",
        };
      });

      setRowModesModelOutput(newRowModesModel);
    } catch (error) {
      console.error("Error searching: ", error);
    }

    try {
      const response = await axios.post("/spring/userapi/useapi", {
        apilistid: props.apilistid,
      });
      console.log('사용', response);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  //활용사례 설정
  useEffect(() => {
    const initialTableData = usecaseData.map(() => ({}));
    setUsecaseTableData(initialTableData);
  }, [usecaseData]);

  //활용사례 요청
  useEffect(() => {
    axios
      .get("/spring/usecase/apidetail", {
        params: {
          apilistid: props.apilistid,
        },
      })
      .then((response) => {
        setUsecaseData(response.data.data.data);
      })
      .catch((err) => {
        setUsecaseError(err);
      });
  }, [props.apilistid]);

  const excelFileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const excelFileExtension = ".xlsx";
  const excelFileName = "사업자 휴폐업";

  // const BusinessmanDataExcel = async (selectedFile) => {
  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheet = workbook.Sheets[workbook.SheetNames[0]];

  //     // 엑셀에서 데이터 추출
  //     const array = XLSX.utils.sheet_to_json(sheet).map(row => row['사업자 등록번호']); // '사업자 등록번호' 컬럼의 데이터만을 선택
  //     try {
  //       const response = await axios.post("/api/nts-businessman/v1/status?serviceKey=" + API_KEY, {
  //         "b_no": array
  //       });
  //       setData(prevData => [...prevData, ...response.data.data]);
  //     } catch (e) {
  //       setError(e);
  //     }

  //   };
  //   reader.readAsArrayBuffer(selectedFile);
  // }

  // const handleFileUpload = () => {
  //   if (selectedFile) {
  //     BusinessmanDataExcel(selectedFile);
  //   } else {
  //     alert('파일을 선택해주세요.');
  //   }
  // }

  // const handleFileInputChange = (event) => {
  //   //파일이 선택되었을 때
  //   const file = event.target.files[0];
  //   setSelectedFile(file);
  // }

  const apiSchedule = () => {
    setModalShow(true);
  };

  return (
    <div className="App">
      <Container>
        <div class="detail-cont ">
          <div class="box-base-type-b">
            <div class="tb_w">
              <h5 style={{ margin: "10px 10px 25px 10px" }}>활용사례</h5>
              <ul class="st_tb_col">
                <li class="tr">
                  <div
                    class="th-num"
                    style={{
                      borderBottom: "1px solid #7BBF57",
                      background: "#d7e7af7a",
                    }}
                  >
                    <span>NO</span>
                  </div>
                  <div
                    class="th-tit"
                    style={{
                      borderBottom: "1px solid #7BBF57",
                      background: "#d7e7af7a",
                    }}
                  >
                    <span>제목</span>
                  </div>
                  <div
                    class="th-writer"
                    style={{
                      borderBottom: "1px solid #7BBF57",
                      background: "#d7e7af7a",
                    }}
                  >
                    <span>등록자</span>
                  </div>
                  <div
                    class="th-date"
                    style={{
                      borderBottom: "1px solid #7BBF57",
                      background: "#d7e7af7a",
                    }}
                  >
                    <span>등록일</span>
                  </div>
                </li>
                {usecaseData.map((item, index) => (
                  <li class="tr" key={index}>
                    <div class="td-num">{index + 1}</div>
                    <div class="td-tit">
                      <Link to={`/openapi/usecasedetail/${item.usecaseid}`}>
                        {item.title}
                      </Link>
                    </div>
                    <div class="td-writer">{item.username}</div>
                    <div class="td-date">
                      <FormatDate dateString={item.regdt} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
      <div>
        <Container>
          <div class="detail-cont ">
            <div class="box-base-type-b">
              <h5 style={{ textAlign: "left" }}>입력값</h5>
              <Box sx={{ padding:'10px', marginBottom:'10px', width: "100%", border:'solid 1px #7BBF57', borderRadius:'5px'}}>
              {serverData.map((item) => (
                <span style={{textAlign:'left', fontSize:'15px'}}><CircleIcon style={{fontSize:'8px'}}/>  [{item.rqrditemnm}] : {item.itemexpl}</span>
              ))}
              </Box>
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  rows={rows}
                  columns={columns}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                  }}
                  rowSelectionModel={rowSelectionModel}
                  disableRowSelectionOnClick
                  onPageSizeChange={(newPageSize) =>
                    console.log(`New page size: ${newPageSize}`)
                  }
                  editMode="row"
                  rowModesModel={rowModesModel}
                  onRowModesModelChange={handleRowModesModelChange}
                  processRowUpdate={(updatedRow) =>
                    processRowUpdate(updatedRow)
                  }

                  onProcessRowUpdateError={handleProcessRowUpdateError}
                  slots={{
                    toolbar: EditToolbar,
                  }}
                  slotProps={{
                    toolbar: { setRows, setRowModesModel },
                  }}
                />
              </Box>
              <Button
                style={{
                  background: "#7BBF57",
                  color: "#ffffff",
                  margin: "20px",
                }}
                onClick={handleSendDataToServer}
              >
                <KeyboardArrowDownIcon />
                조회하기
              </Button>
              {/* <div className="d-flex justify-content-center">
                  <Row className="mb-3 align-items-center">
                    <Col xs={3} >
                      <Form.Label className="mb-0">Excel파일 업로드</Form.Label>
                    </Col>
                    <Col xs={6}>
                      <Form.Control
                        type="file"
                        name="file"
                        onChange={handleFileInputChange}
                        accept=".xlsx, .xls"
                      />
                    </Col>
                    <Col xs={3}>
                      <Button onClick={handleFileUpload}>Upload Excel</Button>
                    </Col>
                  </Row>
                </div> */}
              <h5 style={{ textAlign: "left" }}>출력값</h5>
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  rows={rowsOutput}
                  columns={columnsOutput}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  onPageSizeChange={(newPageSize) =>
                    console.log(`New page size: ${newPageSize}`)
                  }
                  rowModesModel={rowModesModelOutput}
                  onRowModesModelChange={handleRowModesModelChangeOutput}
                />
              </Box>
              <div>
                <Button
                  style={{
                    background: "#7BBF57",
                    color: "#ffffff",
                    margin: "30px",
                  }}
                  onClick={() => setFileModalShow(true)}
                >
                  <FileDownloadOutlinedIcon />
                  파일 다운로드
                </Button>
                <Button style={{
                  border: "solid 2px #7BBF57",
                  background: "#ffffff",
                  color: "#7BBF57",
                  margin: "30px",
                }}
                  onClick={apiSchedule}>
                  <AccessTimeIcon />
                  예약하기
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 예약 모달 */}
      {modalShow && (
        <ScheduleModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          onShow={handleModalShow}
          apilistid={props.apilistid}
          columns={columns}
          EditToolbar={EditToolbar}
          handleAddRow={handleAddRow}
          dataformat={props.dataformat}
        />
      )}
      {/* 파일 다운로드 모달 */}
      <FileDownload
        apilistid={props.apilistid}
        rows={rows}
        dataformat={props.dataformat}
        show={fileModalShow}
        onHide={() => setFileModalShow(false)}
      />
    </div>
  );
}

export default DetailData1;
