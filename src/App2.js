// src/main/frontend/src/App.js

import React, {useEffect, useState} from 'react';
import axios from 'axios';
const URL = "/B551182/";
function App2() {
   //const [hello, setHello] = useState([]);
   const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

    // useEffect(() => {
    //     axios.get('/main/boardid')
    //     .then(response => {
    //       console.log(response);
    //       setHello(response.data.data)
    //       console.log(hello)  
    //     })
    //     .catch(error => console.log(error))
    // }, []);

   

    const fetchData = async () => {
        try {
          setError(null);
          setData(null);
          setLoading(true);
    
          const response = await axios.get(URL, {
            params: {
              serviceKey: process.env.REACT_APP_API_KEY,
              numOfRows: 1,
              pageNo: 10
            }
          });
    
          setData(response.data);
        } catch(e) {
          setError(e);
        }
        setLoading(false);
      };
    
      useEffect(() => {
        fetchData();
      }, []);
      
      if(loading) return <div>Loading...</div>;
      if(error)   return <div>Errasdsadsadadadasdsadasdaor...</div>;
      if(!data)   return null;
    //const dataArray = Object.values(hello)
    return (
        <div className="App">
          <p>자격상태명: { data.response.body.items.item.qlfyStateNm }</p>
        </div>
      );
}

export default App2;