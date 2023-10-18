import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [sigunguCd, setSigunguCd] = useState('');
  const [bjdongCd, setBjdongCd] = useState('');
  const [bun, setBun] = useState('');
  const [ji, setJi] = useState('');
  const [useYm, setUseYm] = useState('');
  const [numOfRows, setNumOfRows] = useState('');
  const [pageNo, setPageNo] = useState('');
  const [result, setResult] = useState([]);

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
        setResult(response.data);
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
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
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}

export default App;