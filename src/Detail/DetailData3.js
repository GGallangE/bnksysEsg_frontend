import './DetailData1.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import React from 'react';
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

const API_KEY = process.env.REACT_APP_COMPANY;

const URL = "/fapi?key=" + API_KEY;

function DetailData1() {
  const [data, setData] = useState([]);
  const [content, setContent] = useState("");
  const [array, setArray] = useState([]);
  const [error, setError] = useState(null);
  const [gb, setGb] = useState("");
  const [q, setQ] = useState("");

  const NEWURL = URL + "&gb=3&type=JSON&q=" + q;
  const BusinessmanData = async () => {
    //console.log("businessmanData")
    const array = content.split(',').map(item => item.trim());
    setArray(array);
    try {
      const response = await axios.post(NEWURL, {
        // gb : "3",
        // q : "우리금융지주"
      });
      console.log(response.data.items);
      setData(prevData => [...prevData, ...response.data.items]);
    } catch(e) {
      setError(e);
    }
  };

  const handleButtonClick = () => {
    BusinessmanData(content);
  }

  const handleContent = (e) => {
    setQ(e.target.value);
  }

    const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const excelFileExtension = '.xlsx';
    const excelFileName = '사업자 휴폐업';
  
    const excelDownload = (excelData: any) => {
      const ws = XLSX.utils.aoa_to_sheet([
        [`국세청_사업자등록정보상태`],
        [],
        ['사업자 등록번호', '법인등록번호', '회사명', '사업자상태', '과세유형', '폐업일']
      ]);
      excelData.map((data: any) => {
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
      const wb: any = {Sheets: { data: ws }, SheetNames: ['data']};
      const excelButter = XLSX.write(wb, { bookType: 'xlsx', type: 'array'});
      const excelFile = new Blob([excelButter], { type: excelFileType});
      FileSaver.saveAs(excelFile, excelFileName + excelFileExtension);
    }
    
  

  return (
    <div className="App">
    <div>
        사업자명: <input type="text" name="content" onChange={handleContent} value={q} />
        <Button onClick={handleButtonClick}>입력</Button>
    </div>
    {data && (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>사업자 등록번호</th>
          <th>법인등록번호</th>
          <th>회사명</th>
          <th>사업자상태</th>
          <th>과세유형</th>
          <th>폐업일</th>
        </tr>
      </thead>
      <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          <td>{item.bno}</td>
          <td>{item.cno}</td>
          <td>{item.company}</td>
          <td>{item.bstt}</td>
          <td>{item.taxtype}</td>
          <td>{item.EndDt}</td>
        </tr>
        ))}
      </tbody>
    </Table>  
    )}
    <div>
      <Button onClick={() => excelDownload(data)}>엑셀 다운로드</Button>
    </div>
    </div>
  );
}

export default DetailData1;