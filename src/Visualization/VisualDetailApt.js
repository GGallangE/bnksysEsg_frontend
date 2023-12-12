import Chart from "react-apexcharts";
// import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function VisualDetailApt() {
  debugger
    // const { filename } = useParams();
    const [a,seta] = useState(0);
    // const [ chartData, setChartData ] = useState();
    // const [ content, setContent ] = useState(null);
    // const [ data, setData ] = useState([]);

  //   useEffect(()=> {
  //     const fetchData = async () => {
  //       debugger
  //   //     try {
  //   //     // Axios를 사용하여 공공데이터 API에 post 요청으로 데이터를 보내고 가져오는 부분
  //   //     const response = axios.get("/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev", {
  //   //     // post 요청으로 보낼 데이터 객체
  //   //     // 예시 데이터, 실제로 사용하는 API에 따라 형식을 맞추세요
  //   //     params:{
  //   //       'ServiceKey': API_KEY,
  //   //       'LAWD_CD': 11110,
  //   //       'DEAL_YMD': 201512,
  //   //     }
  //   //   })
  //   //   const data = response.data;
  //   //   console.log(response)
  //   //  // 데이터를 ApexCharts에서 사용할 형식으로 가공
  //   //  const categories = data.map(item => item.category);
  //   //  const values = data.map(item => item.value);
  //   //  // ApexCharts에서 사용하는 형식으로 데이터 설정
  //   //  setChartData({
  //   //    options: {
  //   //      xaxis: {
  //   //        categories: categories,
  //   //      },
  //   //    },
  //   //    series: [
  //   //     {
  //   //       name: 'Values',
  //   //       data: 30,
  //   //     },
  //   //   ],
  //   // });
  //   // }catch(error){
  //   //   console.error("데이터 가져오기 오류:", error);
  //   // }
  // }
  //     }, []);
    
    return (
      <div>
        <h1>0</h1>
      </div>
    );
    // (
    //   <Container>
    //     <h2 className="mt-3">상세 페이지</h2>
    //     <Card style={{ width: '18rem' }} className="mt-3">
    //       <Card.Body>
    //         {/* <Card.Title>{ decodeURIComponent(filename)}</Card.Title> */}
    //         <Card.Text>
    //           상세 내용을 여기에 표시합니다.
    //         </Card.Text>
    //       </Card.Body>
    //     </Card>
    //     {/* <Chart options={chartData.options} series={chartData.series} type="bar" height={350} /> */}
    //   </Container>
    // );
};

export default VisualDetailApt;