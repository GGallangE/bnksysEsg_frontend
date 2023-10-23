import './App2.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

const URL = "/api/15002552/v1/uddi:9ac6a282-0e1e-42aa-84ca-d1b6e7d571b3?page=1&perPage=10&returnType=JSON&serviceKey=lpa6NPdQyuq%2BpwSkAhWpdv%2FfB6s2fa4xbwOFpIP%2BvZD3TAv27rUlvYLkmMMUYekiWWK9AicPCh1xoIMkjgy3cA%3D%3D";

function App2() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setData(null);
      setLoading(true);

      const response = await axios.get('/spring/main/boardid', {
      });
      setData(response.data);
      // console.log(response);
    } catch(e) {
      setError(e);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if(loading) return <div>Loading...</div>;
  if(error)   return <div>Error...</div>;
  if(!data)   return null;
  console.log(1);
  console.log(data);
  // console.log(data.data[0].boardName);
  return (
    <div className="App">      
      <p>병원명 : { data.data[0].boardName}</p>
    </div> 
  );
}

export default App2;