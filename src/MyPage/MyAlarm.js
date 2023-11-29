import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container }from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate';
import FormatCode from '../Format/FormatCode';
import MyApiApplyDetail from './MyApiApplyDetail'
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';


function MyAlarm(){
    const [searchMyApiApply, setSearchMyApiApply] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/mypage/myalarm');
            setSearchMyApiApply(response.data.data.data);
        }catch(error){
            if(error.response.status == 403){
                alert("로그인을 해주세요.");
              }
        }
    }

    const handleTitleClick = (item) => {
        setSelectedItem(item.apiapplyid);
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
                {searchMyApiApply.map((item, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                    <div
                    onClick={() => handleTitleClick(item)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
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
      <MyApiApplyDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem = {selectedItem}
      />
    </div>
    );
}
export default MyAlarm;