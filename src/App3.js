import './App3.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_API_KEY;

const URL = "/api/nts-businessman/v1/status?serviceKey=" + API_KEY;

function App3() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState("");
  const [newContent, setnewContent] = useState([]);
  const businessmanData = async (newContent) => {
    console.log("businessmanData")
    try {
      // Content();
      setLoading(true);
      const response = await axios.post(URL, {
        "b_no": [newContent]
      });
      console.log(content);
      setData(response.data.data); 
      console.log(response.data.data);
    } catch(e) {
      setError(e);
    }
    
    setLoading(false);
    
  };
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  
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
    businessmanData();
    console.log("useEffect");
  }, []);


  const handleButtonClick = () => {
    // console.log("handleButtonClick")
    const contentArray = content.split(',');
    const newContent = contentArray.join(',');
  businessmanData(newContent);
  }

  if(loading) return <div>Loading...</div>;
  if(error)   return <div>Error...</div>;
  if(!data)   return null;

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