import './DetailData1.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import React from 'react';
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import Container from 'react-bootstrap/Container';
import FormatDate from '../Format/FormatDate'
import { Link } from "react-router-dom";
import Schedule_business from "../Schedule/Schedule_business"
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import EditToolbar from '../Component/EditToolbar';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  GridRowModes,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import {
  randomId,
} from '@mui/x-data-grid-generator';

const API_KEY = process.env.REACT_APP_API_KEY;

function DetailData1(props) {
  const [rows, setRows] = useState([{ id: '0' },]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [data, setData] = useState([]);
  const [usecaseData, setUsecaseData] = useState([]);
  const [content, setContent] = useState("");
  const [array, setArray] = useState([]);
  const [error, setError] = useState(null);
  const [usecaseError, setUsecaseError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalShow, setModalShow] = React.useState(false);
  const [usecaseTableData, setUsecaseTableData] = useState([]); //각 셀의 입력 값을 관리할 상태 변수
  const [tableData, setTableData] = useState([]); //각 셀의 입력 값을 관리할 상태 변수
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState([]);
  const [serverData, setServerData] = useState([]);
  const [columnsOutput, setColumnsOutput] = useState([]);
  const [rowsOutput, setRowsOutput] = useState([]);
  const [rowModesModelOutput, setRowModesModelOutput] = useState({});
  const [serverDataOutput, setServerDataOutput] = useState([]);

  const handleAddData = (data) => {
    const newRows = data.map((item, index) => {
      const id = index + 1; // Assuming you have an identifier in your data
      const newEmptyRow = { id, isNew: true };

      columns.forEach((column) => {
        newEmptyRow[column.field] = item[column.field] || ''; // Adjust property name based on your actual data
      });

      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: columnsOutput[0]?.field || '' },
      }));

      return newEmptyRow;
    });

    setRows((oldRows) => [...oldRows, ...newRows]);
  };

  const handleAddCol = (serverDataOutput) => {
    if (serverDataOutput.length > 0) {
      const dynamicColumns = serverDataOutput.map((item) => ({
        field: item.rqrditemnm,
        headerName: item.rqrditemnm,
        width: 150,
        editable: true,
      }));
      setColumnsOutput(dynamicColumns);
      handleAddData(serverData);
    }
  };

  const handleProcessRowUpdateError = (error) => {
    console.log(error);
  };

  const processRowUpdate = (newRow) => {
    debugger
    console.log(newRow)
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    console.log(updatedRow)

  };

  useEffect(() => {
    console.log(rows)
  }, [rows])

  const handleRowModesModelChange = (newRowModesModel) => {
    debugger
    setRowModesModel(newRowModesModel);
  };

  const EditToolbar = (props) => {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = randomId(); // Assuming you have a function to generate a random ID
      const newEmptyRow = { id, isNew: true };

      // Set default values for each column
      columns.forEach((column) => {
        newEmptyRow[column.field] = '';
      });

      setRows((oldRows) => [...oldRows, newEmptyRow]);

      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: columns[0]?.field || '' },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    requiredItem();
  }, []);

  useEffect(() => {
    if (serverData.length > 0) {
      const columnKeys = serverData.map((item) => ({ field: item.rqrdrqstnm, headerName: item.rqrditemnm, width: 150, editable: true }));
      setColumns(columnKeys);
      handleAddRow();
    }
  }, [serverData]);

  const handleAddRow = () => {
    const newRow = {};
    setTableData([...tableData, newRow]);
  };

  const requiredItem = async () => {
    try {
      const response = await axios.get('/spring/api/getrequired_items', {
        params: {
          apilistid: props.apilistid
        }
      });
      setServerData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  }

  const handleSendDataToServer = async () => {
    try {
      const response = await axios.get('/spring/api/getrequired_items', {
        params: {
          apilistid: props.apilistid
        }
      });
      console.log(response.data);
      handleAddCol(response.data);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  }

  useEffect(() => {
    // 초기 상태 설정 예시
    const initialTableData = usecaseData.map(() => ({}));
    setUsecaseTableData(initialTableData);
  }, [usecaseData]);

  // const BusinessmanData = async () => {
  //   const array = content.split(',').map(item => item.trim());
  //   setArray(array);
  //   try {
  //     const response = await axios.post("/api/nts-businessman/v1/status?serviceKey=" + API_KEY, {
  //       "b_no": array
  //     });
  //     setData(prevData => [...prevData, ...response.data.data]);
  //   } catch (e) {
  //     setError(e);
  //   }

  // };

  useEffect(() => {
    axios.get('/spring/usecase/apidetail', {
      params: {
        apilistid: props.apilistid
      },
    })
      .then(response => {
        setUsecaseData(response.data.data.data);
      })
      .catch(err => {
        setUsecaseError(err);
      });
  }, [props.apilistid]);

  // const handleButtonClick = () => {
  //   BusinessmanData(content);
  // }

  // const handleContent = (e) => {
  //   setContent(e.target.value);
  // }

  const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const excelFileExtension = '.xlsx';
  const excelFileName = '사업자 휴폐업';

  const excelDownload = (excelData) => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['사업자 등록번호', '납세자 상태', '과세유형메세지', '폐업일', '단위과세전환폐업여부',
        '최근과세유형전환일자', '세금계산서적용일자', '직전과세유형메세지']
    ]);
    excelData.map((data) => {
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            data.b_no,
            data.b_stt,
            data.tax_type,
            data.end_dt,
            data.utcc_yn,
            data.tax_type_change_dt,
            data.invoice_apply_dt,
            data.rbf_tax_type,
          ]
        ],
        { origin: -1 }
      );
      ws['!cols'] = [
        { wpx: 200 },
        { wpx: 200 }
      ]
      return false;
    });
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelButter = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const excelFile = new Blob([excelButter], { type: excelFileType });
    FileSaver.saveAs(excelFile, excelFileName + excelFileExtension);
  }

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
              <h5 style={{ margin: '10px 10px 25px 10px' }}>활용사례</h5>
              <ul class="st_tb_col" >
                <li class="tr">
                  <div class="th-num" style={{ borderBottom: '1px solid #7BBF57', background: '#d7e7af7a' }}>
                    <span>NO</span>
                  </div>
                  <div class="th-tit" style={{ borderBottom: '1px solid #7BBF57', background: '#d7e7af7a' }}>
                    <span>제목</span>
                  </div>
                  <div class="th-writer" style={{ borderBottom: '1px solid #7BBF57', background: '#d7e7af7a' }}>
                    <span>등록자</span>
                  </div>
                  <div class="th-date" style={{ borderBottom: '1px solid #7BBF57', background: '#d7e7af7a' }}>
                    <span>등록일</span>
                  </div>
                </li>
                {usecaseData.map((item, index) => (
                  <li class="tr" key={index}>
                    <div class="td-num">{index + 1}</div>
                    <div class="td-tit">
                      <Link to={`/openapi/usecasedetail/${item.usecaseid}`}>{item.title}</Link>
                    </div>
                    <div class="td-writer">{item.username}</div>
                    <div class="td-date"><FormatDate dateString={item.regdt} /></div>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </div>
      </Container>
      <div >
        <Container >
          <div class="detail-cont ">
            <div class="box-base-type-b">
              <Box sx={{ height: 400, width: '100%' }}>
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
                  disableRowSelectionOnClick
                  onPageSizeChange={(newPageSize) => console.log(`New page size: ${newPageSize}`)}
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
              <Button style={{ background: '#7BBF57', color: '#ffffff' }} onClick={handleSendDataToServer}>조회</Button>


              {/* <div>
사업자번호: <input type="text" name="content" onChange={handleContent} value={content} />
<Button onClick={handleButtonClick} style = {{margin:'30px 20px'}}>입력</Button>
</div>  */}
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

              <Box sx={{ height: 400, width: '100%' }}>
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
                  disableRowSelectionOnClick
                  onPageSizeChange={(newPageSize) => console.log(`New page size: ${newPageSize}`)}
                  editMode="row"
                  rowModesModel={rowModesModel}
                  onRowModesModelChange={handleRowModesModelChange}
                  processRowUpdate={(updatedRow) =>
                    processRowUpdate(updatedRow)
                  }
                  onProcessRowUpdateError={handleProcessRowUpdateError}

                />
              </Box>

              {/* {data && (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>사업자 등록번호</th>
                      <th>납세자 상태</th>
                      <th>과세유형메세지</th>
                      <th>폐업일</th>
                      <th>단위과세전환폐업여부</th>
                      <th>최근과세유형전환일자</th>
                      <th>세금계산서적용일자</th>
                      <th>직전과세유형메세지</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td>{item.b_no}</td>
                        <td>{item.b_stt}</td>
                        <td>{item.tax_type}</td>
                        <td>{item.end_dt}</td>
                        <td>{item.utcc_yn}</td>
                        <td>{item.tax_type_change_dt}</td>
                        <td>{item.invoice_apply_dt}</td>
                        <td>{item.rbf_tax_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )} */}
              <div>
                <Button style={{ background: '#7BBF57', color: '#ffffff', margin: '30px' }} onClick={() => excelDownload(data)}><FileDownloadOutlinedIcon />파일 다운로드</Button>
                <Button style={{ margin: '30px' }} onClick={apiSchedule}><AccessTimeIcon />예약하기</Button>
              </div>
            </div>

          </div>
        </Container>
      </div>

      <Schedule_business
        show={modalShow}
        onHide={() => setModalShow(false)}
        apilistid={props.apilistid}
      />
    </div>

  );
}

export default DetailData1;