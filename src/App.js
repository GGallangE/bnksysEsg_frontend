import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [sigunguCd, setSigunguCd] = useState('');
  const [bjdongCd, setBjdongCd] = useState('');
  const [bun, setBun] = useState('');
  const [ji, setJi] = useState('');
  const [useYm, setUseYm] = useState('');
  const [numOfRows, setNumOfRows] = useState('');
  const [pageNo, setPageNo] = useState('');
  const [result, setResult] = useState([]);
  const [businessNumber, setBusinessNumber] = useState('');
  const [response, setResponse] = useState('');

  const handleApiRequest = () => {
    // API 요청을 보내는 로직
    axios
      .get('/main/fetchData', {
        params: {
          sigunguCd,
          bjdongCd,
          bun,
          ji,
          useYm,
          numOfRows,
          pageNo,
        }
      })
      .then(response => {
        // API 응답을 처리
      const responseData = response.data.response.body.items.item;
      // const responseData = response;

      setResult(responseData);
      })
      .catch(error => console.error(error));
  };

  const handleSearch = () => {
    axios
      .post('/main/fetchData', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        setResponse(res.data);
      })
      .catch((error) => {
        console.error('에러:', error);
      });
  };

  const handleSave = () => {
    const requestData = {
      sigunguCd,
      bjdongCd,
      bun,
      ji,
      useYm,
      // newPlatPlc,
      // platPlc,
      // useQty,
    };
  
    axios
      .post('/main/saveData', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        console.log('저장 요청에 대한 응답:', res.data);
      })
      .catch((error) => {
        console.error('저장 요청에 대한 에러:', error);
      });
  };


  return (
    <div className="split-container">
      <div className="split-left">
      <h1>API 요청 및 응답</h1>
      <div>
        <label>
          sigunguCd (필수):
          <input type="text" value={sigunguCd} onChange={e => setSigunguCd(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          bjdongCd (필수):
          <input type="text" value={bjdongCd} onChange={e => setBjdongCd(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          bun (필수):
          <input type="text" value={bun} onChange={e => setBun(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          ji (필수):
          <input type="text" value={ji} onChange={e => setJi(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          useYm (필수):
          <input type="text" value={useYm} onChange={e => setUseYm(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          numOfRows (선택):
          <input type="text" value={numOfRows} onChange={e => setNumOfRows(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          pageNo (선택):
          <input type="text" value={pageNo} onChange={e => setPageNo(e.target.value)} />
        </label>
      </div>
      <button onClick={handleApiRequest}>API 요청</button>
      <h2>API 응답:</h2>
      {/* <pre>{JSON.stringify(result, null, 2)}</pre> */}
      <div>
          <p>도로명: {result.newPlatPlc}</p>
          <p>지번주소: {result.platPlc}</p>
          <p>전력량: {result.useQty}</p>
          <p>사용날짜: {result.useYm}</p>
      </div>
      <button onClick={handleSave}>저장</button>
      </div>

      <div className="split-right">
      <h1>사업자 조회</h1>
      <div>
        <label>
          사업자 번호:
          <input
              type="text"
              value={businessNumber}
              onChange={(e) => setBusinessNumber(e.target.value)}
            />
        </label>
      </div>
      <button onClick={handleSearch}>조회</button>
      <h2>조회 결과:</h2>
      <pre>{JSON.stringify(response, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;