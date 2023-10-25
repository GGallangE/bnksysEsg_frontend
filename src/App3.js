import './App3.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_API_KEY;

const URL = "/api/nts-businessman/v1/status?serviceKey=" + API_KEY;

function App3() {
  const [data, setData] = useState(null);
  const [content, setContent] = useState("");
  const [array, setArray] = useState([]);
  const [error, setError] = useState(null);
  const businessmanData = async () => {
    console.log("businessmanData")
    const array = content.split(',').map(item => item.trim());
    setArray(array);
    try {
      const response = await axios.post(URL, {
        "b_no": array
      });
      setData(response.data.data); 
    } catch(e) {
      setError(e);
    }
  };

 function BoardInput(props) {
  console.log("BoardInput");
    const handleContent = (e) => {
      setContent(e.target.value);
    }

    return (
            <div>
                내용: <input type="text" name="content" onChange={handleContent} value={content} />
                <button onClick={handleButtonClick}>input</button>
            </div> 
    );
 }

  useEffect(() => {
    console.log("useEffect");
    businessmanData();
  }, []);

  const handleButtonClick = () => {
    businessmanData(content);
  }

  return (
    <div className="App">
      <BoardInput  />
      {data && (
      <div>
        <p>사업자 등록번호: {data[0].b_no}</p>
        <p>납세자 상태: {data[0].b_stt}</p>
        <p>과세유형메세지: {data[0].tax_type}</p>
        <p>폐업일: {data[0].end_dt}</p>
        <p>단위과세전환폐업여부: {data[0].utcc_yn}</p>
        <p>최근과세유형전환일자: {data[0].tax_type_change_dt}</p>
        <p>세금계산서적용일자: {data[0].invoice_apply_dt}</p>
        <p>직전과세유형메세지: {data[0].rbf_tax_type}</p>
      </div>
    )}
    </div>
  );
}

export default App3;