import './DetailData1.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

const API_KEY = process.env.REACT_APP_API_KEY;

const URL = "/api/nts-businessman/v1/status?serviceKey=" + API_KEY;

function App3() {
  const [data, setData] = useState(null);
  const [content, setContent] = useState("");
  const [array, setArray] = useState([]);
  const [error, setError] = useState(null);
  const BusinessmanData = async () => {
    //console.log("businessmanData")
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
  //console.log("BoardInput");
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
    //console.log("useEffect");
    BusinessmanData();
  }, []);

  const handleButtonClick = () => {
    BusinessmanData(content);
  }

  return (
    <div className="App">
    <BoardInput />
    {data && (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>사업자 222222</th>
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
          <td>{data[0].b_no}</td>
          <td>{data[0].b_stt}</td>
          <td>{data[0].tax_type}</td>
          <td>{data[0].end_dt}</td>
          <td>{data[0].utcc_yn}</td>
          <td>{data[0].tax_type_change_dt}</td>
          <td>{data[0].invoice_apply_dt}</td>
          <td>{data[0].rbf_tax_type}</td>
        </tr>
      </tbody>
    </Table>  
    )}
    <Button as="input" type="button" value="Input" />{' '}   
    </div>
  );
}

export default App3;