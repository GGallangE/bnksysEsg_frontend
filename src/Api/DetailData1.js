import './DetailData1.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import React from 'react';
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import Container from 'react-bootstrap/Container';
import FormatDate from '../Format/FormatDate'
import { Link, useLocation } from "react-router-dom";
import Schedule_business from "../Schedule/Schedule_business"

const API_KEY = process.env.REACT_APP_API_KEY;

function DetailData1(props) {
  const [data, setData] = useState([]);
  const [usecaseData, setUsecaseData] = useState([]);
  const [content, setContent] = useState("");
  const [array, setArray] = useState([]);
  const [error, setError] = useState(null);
  const [usecaseError, setUsecaseError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalShow, setModalShow] = React.useState(false);
  
const BusinessmanData = async () => {
  const array = content.split(',').map(item => item.trim());
  setArray(array);
  try {
    const response = await axios.post("/api/nts-businessman/v1/status?serviceKey=" + API_KEY, {
      "b_no": array
    });
    setData(prevData => [...prevData, ...response.data.data]);
  } catch(e) {
    setError(e);
  }

};

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

  const handleButtonClick = () => {
    BusinessmanData(content);
  }

  const handleContent = (e) => {
    setContent(e.target.value);
  }

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
        {origin: -1}
      );
      ws['!cols'] = [
        { wpx: 200 },
        { wpx: 200 }
      ]
      return false;
    });
    const wb = {Sheets: { data: ws }, SheetNames: ['data']};
    const excelButter = XLSX.write(wb, { bookType: 'xlsx', type: 'array'});
    const excelFile = new Blob([excelButter], { type: excelFileType});
    FileSaver.saveAs(excelFile, excelFileName + excelFileExtension);
  }

  const BusinessmanDataExcel = async (selectedFile) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
      // 엑셀에서 데이터 추출
      const array = XLSX.utils.sheet_to_json(sheet).map(row => row['사업자 등록번호']); // '사업자 등록번호' 컬럼의 데이터만을 선택
    try {
      const response = await axios.post("/api/nts-businessman/v1/status?serviceKey=" + API_KEY, {
        "b_no": array
      });
      setData(prevData => [...prevData, ...response.data.data]);
    } catch(e) {
      setError(e);
    }
  
  };
  reader.readAsArrayBuffer(selectedFile);
  }

  const handleFileUpload = () => {
    if (selectedFile) {
      BusinessmanDataExcel(selectedFile);
    }else{
      alert('파일을 선택해주세요.');
    }
  }

  const handleFileInputChange = (event) => {
    //파일이 선택되었을 때
    const file = event.target.files[0];
    setSelectedFile(file);
  }

  const apiSchedule = () => {
    setModalShow(true);
  };

  return (
    <div className="App">
      <Container style={{margin:'50px auto'}}>
      <div>
      <h5>활용사례</h5>
    <Table bordered>
    <thead>
        <tr>
          <th>No</th>
          <th>제목</th>
          <th>등록자</th>
          <th>등록일</th>
        </tr>
      </thead>
      <tbody>
      {usecaseData.map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            <Link to={`/openapi/usecasedetail/${item.usecaseid}`}>{item.title}</Link>
          </td>
          <td>{item.username}</td>
          <td><FormatDate dateString={item.regdt} /></td>
        </tr>
        ))}
      </tbody>
    </Table >
    </div>
    </Container>

    <Container className = "boxstyle">
    <div>
      <h5>출력예제</h5>
    <Table bordered>
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
        <tr>
          <td>6028154897</td>
          <td>계속사업자</td>
          <td>부가가치세 일반과세자</td>
          <td></td>
          <td>N</td>
          <td></td>
          <td></td>
          <td>해당없음</td>
        </tr>
      </tbody>
    </Table >
    </div>
    </Container>
    <Container>
    <div>
        사업자번호: <input type="text" name="content" onChange={handleContent} value={content} />
        <Button onClick={handleButtonClick} style = {{margin:'30px 20px'}}>입력</Button>
    </div> 
    <div className="d-flex justify-content-center">
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
    </div>
    {data && (
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
    )}
    <div>
      <Button style = {{margin:'20px'}} onClick={() => excelDownload(data)}>엑셀 다운로드</Button>
      <Button style = {{margin:'20px'}} onClick={apiSchedule}>예약하기</Button>
    </div>
    </Container>
    <Schedule_business
        show={modalShow}
        onHide={() => setModalShow(false)}
        apilistid= {props.apilistid}
      />
    </div>
    
  );
}

export default DetailData1;