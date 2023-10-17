import './App.css';
import React, { useEffect } from 'react';

function App() {
  console.log('a')
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8080/main/boardid", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        console.log(response)
        if (response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          console.log("서버 응답 오류");
        }
      } catch (error) {
        console.error("에러 발생: ", error);
      }
    }

    fetchData();
  }, []); // useEffect가 컴포넌트가 렌더링될 때 한 번만 실행되도록 빈 배열을 전달합니다.

  return (
    <div className="App">
      {/* 여기에 내용을 렌더링할 수 있습니다 */}
    </div>
  );
}

export default App;
