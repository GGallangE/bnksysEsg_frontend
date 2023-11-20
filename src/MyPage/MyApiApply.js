import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container }from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate';
import MyApiApplyDetail from './MyApiApplyDetail'
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';


function MyApiApply(){
    const [searchMyApiApply, setSearchMyApiApply] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/mypage/myapiapply');
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
      <Container style={{margin:'50px auto'}}>
        <div>
        <h5 style={{marginTop : '50px',marginBottom : '50px'}}>API신청현황</h5>
        <Table bordered>
            <thead>
                <tr>
                    <th>No</th>
                    <th>제목</th>
                    <th>등록일</th>
                    <th>답변일</th>
                    <th>처리현황</th>
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
                    {item.applynm}
                    </div>
                    </td>
                    <td><FormatDate dateString={item.applydate} /></td>
                    {/* <td><FormatDate dateString={item.rplydate} /></td>
                    <td><FormatDate dateString={item.rplydate} /></td> */}
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
export default MyApiApply;