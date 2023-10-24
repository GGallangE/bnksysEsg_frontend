import './App3.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_API_KEY;

const URL = "/api/nts-businessman/v1/status?serviceKey=" + API_KEY;

function App3() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('')
  const businessmanData = async () => {
    try {
      // setError(null);
      // setData(null);
      // setLoading(true);
      console.log(content);
      const response = await axios.post(URL, {
        "b_no": [
          content
        ]
      });
      setData(response.data);
      console.log(data);
    } catch(e) {
      setError(e);
    }
    
    setLoading(false);
    
  };

function BoardInput(props) {
 
    const handleContent = (e) => {
        setContent(e.target.value)
    }
 
    //console.log(data)
    // console.log(data.data)
    // console.log(data.data[0].b_no)
    return (
            <div>
                내용: <input type="text" name="content" onChange={handleContent} value={content} />
                <button onClick={handleButtonClick}>input</button>
            </div>      
    );
}

  useEffect(() => {
    businessmanData();
  }, []);

  const handleButtonClick = () => {
    businessmanData();
    console.log(data);
    return(
      <div>
      <p>결과: { data.data[0].b_no}</p>
      </div>
    )
}
  //if(loading) return <div>Loading...</div>;
  //if(error)   return <div>Error...</div>;
  //if(!data)   return null;

  return (
    <div className="App">
      <BoardInput  />
      
    </div>
    
  );
}

export default App3;