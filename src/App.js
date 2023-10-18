// src/main/frontend/src/App.js

import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
   const [hello, setHello] = useState('')

    useEffect(() => {
        axios.get('/main/boardid')
        .then(response => {
          console.log(response);
          setHello(response.data.data)
          console.log(hello)  
        }
        )
        .catch(error => console.log(error))
    }, []);

    const dataArray = Object.values(hello)
    return (
      <div>
        백엔드에서 가져온 데이터입니다:
        <ul>
            {dataArray.map((item, index) => (
                <li key={index}>
                    User ID: {item.userId}, User Name: {item.userName}, Board ID: {item.boardId}, Board Name: {item.boardName}
                </li>
            ))}
        </ul>
    </div>
    );
}

export default App;