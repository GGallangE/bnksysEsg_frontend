import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import FormatDate from "../Format/FormatDate";
import { Form, Modal, Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import * as XLSX from "xlsx";
import { isLoggedInAtom } from "../atom";
import { useRecoilValue } from "recoil";
import FormatCode from "../Format/FormatCode";
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

function MyScheduleBusiness(props) {
  const [batchlistId, setBatchlistId] = useState("");
  const [rsvData, setRsvData] = useState([]);
  const [serverData, setServerData] = useState([]);
  const [dataToSend, setDataToSend] = useState([]);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [secondOptions, setSecondOptions] = useState([]);
  const [content, setContent] = useState("");
  const [fileOption, setFileOption] = useState("");
  const [excelArray, setExcelArray] = useState([]);
  const hours = Array.from({ length: 24 }, (_, index) => index); // 0부터 23까지의 숫자 배열 생성
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const isMounted = useRef(false);
  axios.defaults.headers.common["Authorization"] = `Bearer ${isLoggedIn}`;
  const [inputEmail, setInputEmail] = useState("");

  const handleRsvData = async () => {
    try {
      const response = await axios.get("/spring/mypage/myapischedule", {
        params: {
          batchlistid: props.batchlistId,
        },
      });
      setRsvData(response.data.data.data[0].batchDetailargsDto);
      console.log("rsv", response.data.data.data[0].batchDetailargsDto);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  useEffect(() => {
    //setBatchlistId(props.batchlistId);
    handleRsvData();
    setSelectedFrequency(props.frequency);
    setSelectedDay(
      props.frequency === "monthly"
        ? props.dayofmonth
        : props.frequency === "weekly"
          ? props.dayofweek
          : ""
    );
    setFileOption(props.apiFormat);
    if (props.time) {
      setSelectedHour(props.time.substring(0, 2));
      setSelectedMinute(props.time.substring(props.time.length - 2));
    }
    requiredItem();
    handleOptionChange(props.frequency);
  }, [props.show]);

  // useEffect(()=>{
  //   debugger
  // },[selectedDay])

  //입력값 grid에 필수 값 컬럼 설정
  useEffect(() => {
    if (serverData && serverData.length > 0 && rsvData && rsvData.length > 0) {
      const columnKeys = serverData.map((item, index) => ({
        field: `arg${index + 1}`,
        headerName: item.rqrditemnm,
        width: 150,
        editable: true,
      }));

      // rsv 데이터에서 row만 추출하여 가공
      const gridRows = rsvData.map((rowData, index) => {
        const gridRow = { id: index }; // 각 row의 고유한 id 설정
        Object.keys(rowData).forEach((key) => {
          gridRow[key] = rowData[key]; // 기존의 key와 value 그대로 복사
        });
        return gridRow;
      });

      // 기존 컬럼 정보와 rsv 데이터로 가공한 row 정보를 합쳐서 최종적인 rows 설정
      const finalRows = [...gridRows];
      setRows(finalRows);
      //setFinalDeleteRowsDelete(finalRows);
      setColumns(columnKeys);
      //handleAddRow();
    }
  }, [serverData, rsvData]);

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
      console.log("serverdata", response.data);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };

    const newRows = rows.map((row) =>
      row.id === newRow.id ? { ...updatedRow } : row
    );
    setRows(newRows);
  };

  //새로운 행 추가 버튼
  const EditToolbar = (props) => {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = randomId();
      const newEmptyRow = {
        id,
        isNew: true,
        batchDetailListId: null,
        batchListId: rows[0].batchListId,
        stcd: "01",
      };

      for (let i = 1; i <= 10; i++) {
        newEmptyRow[`arg${i}`] = null;
      }

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

      // 새로운 rows 배열 생성
      const newRows = rows.map((row) => {
        // 만약 ids 배열에 현재 row의 id가 포함되어 있다면
        if (ids.includes(row.id)) {
          // 현재 row의 stcd를 99로 변경하여 반환
          return { ...row, stcd: 99 };
        } else {
          // ids 배열에 포함되지 않은 경우 그대로 반환
          return row;
        }
      });

      // 변경된 rows 배열을 설정
      setRows(newRows);
    };

    return (
      <GridToolbarContainer>
        <Button
          style={{ background: "#ffffff", border: 'none', color: '#92bcea' }}
          onClick={handleClick}
        >
          <AddIcon/>Add record
        </Button>
        <HorizontalRuleIcon style={{ width:'20px', transform: 'rotate(90deg)', color: '#92bcea' }} />
        <Button
          style={{ background: "#ffffff", border: 'none', color: '#92bcea', display:'flex' }}
          onClick={handleDeleteClick(rowSelectionModel)}
        >
          <DeleteIcon style={{ width:'20px'}}/><div>삭제</div>
        </Button>
      </GridToolbarContainer>
    );
  };

  const handleProcessRowUpdateError = (error) => {
    console.log(error);
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  //주기 선택
  const handleOptionChange = (value) => {
    setSelectedFrequency(value);
    if (value === "monthly") {
      setSecondOptions(
        Array.from({ length: 31 }, (_, index) => `${index + 1}`)
      );
    } else if (value === "weekly") {
      setSecondOptions(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]);
    } else {
      setSecondOptions([]);
    }
  };

  //파일 종류 선택
  const handlefileOptionChange = (e) => {
    setFileOption(e.target.value);
  };

  const clickModify = () => {
    //시간 형식에 맞을 때만 실행
    if (parseInt(selectedHour, 10) < 23 && parseInt(selectedMinute, 10) < 59) {
      setSelectedTime(selectedHour + ":" + selectedMinute);
      setDataToSend(rows.map(({ id, isNew, ...rest }) => rest));
    } else {
      alert("올바른 시간을 입력하세요");
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      //console.log(dataToSend);
      const handleSchedule = async () => {
        try {
          if (selectedFrequency === "monthly") {
            const response = await axios.post(
              "/spring/mypage/myapischedule/update",
              {
                apilistid: props.apilistid,
                batchlistid: props.batchlistId,
                frequency: selectedFrequency,
                time: selectedTime,
                dayofmonth: selectedDay,
                apiformat: fileOption,
                batchDetailargsDto: dataToSend,
              }
            );
            const freKorean = getFreKorean(selectedFrequency);
            alert(
              `${freKorean} ${selectedDay}일 ${selectedTime}으로 수정이 완료되었습니다.`
            );
          } else if (selectedFrequency === "weekly") {
            const response = await axios.post(
              "/spring/mypage/myapischedule/update",
              {
                apilistid: props.apilistid,
                batchlistid: props.batchlistId,
                frequency: selectedFrequency,
                time: selectedTime,
                dayofweek: selectedDay,
                apiformat: fileOption,
                batchDetailargsDto: dataToSend,
              }
            );
            const freKorean = getFreKorean(selectedFrequency);
            //const dayKorean = FormatCode({ code: "day", value: selectedDay });
            //const dayKorean = getDayKorean(selectedDay);

            alert(
              `${freKorean} 요일 ${selectedTime}으로 수정이 완료되었습니다.`
            );
          } else {
            const response = await axios.post(
              "/spring/mypage/myapischedule/update",
              {
                apilistid: props.apilistid,
                batchlistid: props.batchlistId,
                frequency: selectedFrequency,
                time: selectedTime,
                apiformat: fileOption,
                batchDetailargsDto: dataToSend,
              }
            );
            const freKorean = getFreKorean(selectedFrequency);
            alert(`${freKorean} ${selectedTime}으로 수정이 완료되었습니다.`);
          }
          setExcelArray([]);
          setContent("");
          setSelectedHour("");
          setSelectedMinute("");

          props.onHide();
        } catch (error) {
          console.log(error);
          //alert(error.response.data.messages)
        }
      };
      handleSchedule();
    } else {
      isMounted.current = true;
    }
  }, [dataToSend]);

  const handleContent = (e) => {
    setContent(e.target.value);
  };

  const handleFileInputChange = (event) => {
    //파일이 선택되었을 때
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      // 엑셀에서 데이터 추출
      const array = XLSX.utils
        .sheet_to_json(sheet)
        .map((row) => row["사업자 등록번호"]); // '사업자 등록번호' 컬럼의 데이터만을 선택
      setExcelArray(array);
      console.log(array);
    };
    reader.readAsArrayBuffer(file);
    //setSelectedFile(file);
  };

  const handleHourChange = (e) => {
    setSelectedHour(e.target.value);
  };

  const handleMinuteChange = (e) => {
    setSelectedMinute(e.target.value);
  };

  const handleHourBlur = (e) => {
    const inputValue = e.target.value;
    // 한 자리일 때만 0을 붙여 두 자리로 만들기
    setSelectedHour((prevValue) =>
      inputValue.length === 1 ? `0${inputValue}` : inputValue
    );
  };

  const handleMinuteBlur = (e) => {
    const inputValue = e.target.value;
    // 한 자리일 때만 0을 붙여 두 자리로 만들기
    setSelectedMinute((prevValue) =>
      inputValue.length === 1 ? `0${inputValue}` : inputValue
    );
  };

  const handleClose = () => {
    setExcelArray([]);
    setContent("");
    setSelectedHour("");
    setSelectedMinute("");
    props.onHide();
  };

  const getFreKorean = (frequency) => {
    switch (frequency) {
      case "monthly":
        return "매달";
      case "weekly":
        return "매주";
      case "daily":
        return "매일";
      default:
        return "";
    }
  };

  const getDayKorean = (day) => {
    switch (day) {
      case "MON":
        return "월";
      case "TUE":
        return "화";
      case "WED":
        return "수";
      case "THU":
        return "목";
      case "FRI":
        return "금";
      case "SAT":
        return "토";
      case "SUN":
        return "일";
      default:
        return "";
    }
  };

  return (
    <div>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header style={{ background: '#bbd4ef' }} closeButton>
          <Modal.Title id="contained-modal-title-vcenter">예약수정하기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="mb-3">
              <Col
                xs={2}
                className="d-flex align-items-center"
                style={{ width: "104px" }}
              >
                예약일시:
              </Col>
              <Col xs={3}>
                <Form.Select
                  value={selectedFrequency}
                  onChange={(e) => handleOptionChange(e.target.value)}
                >
                  <option value="">선택하세요</option>
                  <option value="monthly">매달</option>
                  <option value="weekly">매주</option>
                  <option value="daily">매일</option>
                </Form.Select>
              </Col>
              <Col xs={3}>
                <Form.Select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  disabled={selectedFrequency === "daily"}
                >
                  <option value="">선택하세요</option>
                  {secondOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {selectedFrequency === "monthly" ? (
                        option + "일"
                      ) : selectedFrequency === "weekly" ? (
                        <FormatCode code="day" value={option} />
                      ) : (
                        option
                      )}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={3} className="d-flex align-items-center">
                <Form.Control
                  style={{ margin: "0px 10px", border:'solid 1px #cccccc', height:'45px'}}
                  type="text"
                  placeholder="00"
                  value={selectedHour}
                  onChange={handleHourChange}
                  onBlur={handleHourBlur} // onBlur 이벤트 추가
                  onKeyDown={(e) => {
                    // 숫자, Backspace 이외의 키 입력 방지 및 두 자리까지만 입력 허용
                    if (
                      !(
                        (e.keyCode >= 48 && e.keyCode <= 57) ||
                        (e.keyCode >= 96 && e.keyCode <= 105) ||
                        e.keyCode === 8
                      ) ||
                      (e.target.value.length >= 2 && e.keyCode !== 8)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
                :
                <Form.Control
                  style={{ margin: "0px 10px", border:'solid 1px #cccccc', height:'45px'}}
                  type="text"
                  placeholder="00"
                  value={selectedMinute}
                  onChange={handleMinuteChange}
                  onBlur={handleMinuteBlur} // onBlur 이벤트 추가
                  onKeyDown={(e) => {
                    // 숫자, Backspace 이외의 키 입력 방지 및 두 자리까지만 입력 허용
                    if (
                      !(
                        (e.keyCode >= 48 && e.keyCode <= 57) ||
                        (e.keyCode >= 96 && e.keyCode <= 105) ||
                        e.keyCode === 8
                      ) ||
                      (e.target.value.length >= 2 && e.keyCode !== 8)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col
                xs={2}
                className="d-flex align-items-center"
                style={{ width: "104px" }}
              >
                파일형식:
              </Col>
              <Col xs={3}>
                <Form.Select
                  value={fileOption}
                  onChange={handlefileOptionChange}
                >
                  <option value="">선택하세요</option>
                  <option value="excel">EXCEL</option>
                  <option value="txt">TXT</option>
                  <option value="json">JSON</option>
                  <option value="xml">XML</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={2} className="d-flex align-items-center" style={{ width: "104px" }}>
                이메일:
              </Col>
              <Col xs={3}>
                <Form.Control
                  type="email"
                  placeholder="이메일 입력"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                />
              </Col>
            </Row>
            <h5 style={{ textAlign: "left" }}>입력값</h5>
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                rows={rows.filter(row => row.stcd !== 99)}
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
                processRowUpdate={(updatedRow) => processRowUpdate(updatedRow)}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                slots={{
                  toolbar: EditToolbar,
                }}
                slotProps={{
                  toolbar: { setRows, setRowModesModel },
                }}
              />
            </Box>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ background: "#92bcea", border: 'none' }} onClick={clickModify}>수정</Button>
          <Button style={{ background: "#ffffff", borderColor: '#92bcea', color: '#92bcea' }} onClick={handleClose}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyScheduleBusiness;
