// src/main/frontend/src/App.js

import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
   const [message, setMessage] = useState([]);

    useEffect(() => {
        axios.get('/main/User')
        .then((response)=>{
          setMessage(response.data);
        })
        // .then((data)=>{
        //     setMessage(response.data);
        // })
    }, []);

    return (
        <div>
            백엔드에서 가져온 데이터입니다 : {message}
        </div>
    );
}

export default App;