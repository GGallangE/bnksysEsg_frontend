import './DetailData1.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import React from 'react';
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import Container from 'react-bootstrap/Container';
import FormatDate from '../Format'

const API_KEY = process.env.REACT_APP_API_KEY;

const URL = "/api/nts-businessman/v1/status?serviceKey=" + API_KEY;

function DetailData1(props) {
  const [data, setData] = useState([]);
  const [usecaseData, setUsecaseData] = useState([]);
  const [content, setContent] = useState("");
  const [array, setArray] = useState([]);
  const [error, setError] = useState(null);
  const [usecaseError, setUsecaseError] = useState(null);
  const BusinessmanData = async () => {
    const array = content.split(',').map(item => item.trim());
    setArray(array);
    try {
      const response = await axios.post(URL, {
        "b_no": array
      });
      setData(prevData => [...prevData, ...response.data.data]);
    } catch(e) {
      setError(e);
    }
  };

  useEffect(() => {
    console.log(props)
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
      [`국세청_사업자등록정보상태`],
      [],
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
          <td>{item.title}</td>
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
      <Button onClick={() => excelDownload(data)}>엑셀 다운로드</Button>
    </div>
    </Container>
    </div>
    
  );
}

export default DetailData1;