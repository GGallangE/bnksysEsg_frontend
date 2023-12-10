import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container }from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate';
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';
import MyAlarmDetail from './MyAlarmDetail';


function MyAlarm(){
    const [searchMyAlarm, setSearchMyAlarm] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/mypage/myalarm');
            setSearchMyAlarm(response.data.data.data);
        }catch(error){
            if(error.response.status == 403){
                alert("로그인을 해주세요.");
              }
        }
    }

    const handleTitleClick = (item) => {
        setSelectedItem(item.alarmid);
        setModalShow(true);
      };

    useEffect(() => {
        handleSearch();
    }, [])

    return(
    <div className="App">
      <Container style={{margin:'100px auto'}}>
        <div>
        <h5 style={{marginTop : '50px', marginBottom : '50px'}}>MY 알림</h5>
        <Table bordered>
            <thead>
                <tr>
                    <th>No</th>
                    <th>제목</th>
                    <th>수신일시</th>
                    <th>작성자</th>
                </tr>
            </thead>
            <tbody>
                {searchMyAlarm.map((item, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                        <div
                            onClick={() => handleTitleClick(item)}
                            style={{
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontWeight: item.readCheck ? 'normal' : 'bold',
                                color: item.readCheck ? 'grey' : 'black',
                            }}
                        >
                    {item.title}
                        </div>
                    </td>
                    <td><FormatDate dateString={item.regdt} /></td>
                    <td>{item.sendusername} </td>
                  </tr>
                ))}
            </tbody>
        </Table>
        </div>
      </Container>
      <MyAlarmDetail
        show={modalShow}
        onHide={() => {
            setModalShow(false);
        }}
        selectedItem = {selectedItem}
      />
    </div>
    );
}
export default MyAlarm;