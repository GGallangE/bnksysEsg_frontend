import './DetailData2.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';

const API_KEY = process.env.REACT_APP_ELC_API_KEY;

const URL = "/1611000/BldEngyService/getBeElctyUsgInfo?serviceKey=" + API_KEY;

function DetailData2() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [sigunguCd, setSigunguCd] = useState('');
  const [bjdongCd, setBjdongCd] = useState('');
  const [bun, setBun] = useState('');
  const [ji, setJi] = useState('');
  const [useYm, setUseYm] = useState('');
  const [numOfRows, setNumOfRows] = useState('');
  const [pageNo, setPageNo] = useState('');
 
  const BuildingElectronicData = async () => {
    try {
      const response = await axios.get(URL, {
        params: {
          sigunguCd,
          bjdongCd,
          bun,
          ji,
          useYm,
          numOfRows,
          pageNo,
        }
      });
      console.log(response);
      setData(response.data.response.body.items.item); 
    } catch(e) {
      setError(e);
    }
  };

  useEffect(() => {
    BuildingElectronicData();
  }, []);

  const handleButtonClick = () => {
    BuildingElectronicData();
  }

  return (
    <div className="App">
        <h1>API 요청 및 응답</h1>
    <div>
        sigunguCd (필수): <input type="text" value={sigunguCd} onChange={e => setSigunguCd(e.target.value)} />
        bjdongCd (필수): <input type="text" value={bjdongCd} onChange={e => setBjdongCd(e.target.value)} />
        bun (필수): <input type="text" value={bun} onChange={e => setBun(e.target.value)} />
        ji (필수): <input type="text" value={ji} onChange={e => setJi(e.target.value)} />
        useYm (필수): <input type="text" value={useYm} onChange={e => setUseYm(e.target.value)} />
        numOfRows (선택): <input type="text" value={numOfRows} onChange={e => setNumOfRows(e.target.value)} />
        pageNo (선택): <input type="text" value={pageNo} onChange={e => setPageNo(e.target.value)} />
        <button onClick={handleButtonClick}>API 요청</button>
      </div>
    {data && (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>도로명</th>
          <th>지번주소</th>
          <th>전력량</th>
          <th>사용날짜</th>
          <th>단위과세전환폐업여부</th>
          <th>최근과세유형전환일자</th>
          <th>세금계산서적용일자</th>
          <th>직전과세유형메세지</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{data.newPlatPlc}</td>
          <td>{data.platPlc}</td>
          <td>{data.useQty}</td>
          <td>{data.useYm}</td>
          <td>{data.useYm}</td>
          <td>{data.useYm}</td>
          <td>{data.useYm}</td>
          <td>{data.useYm}</td>
        </tr>
      </tbody>
    </Table>  
    )}
    </div>
  );
}

export default DetailData2;