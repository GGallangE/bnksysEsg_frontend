import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container }from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate';
import FormatCode from '../Format/FormatCode';
import AdminInquiryDetail from './AdminInquiryDetail'
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';


function AdminInquiry(){
    const [searchInquiryList, setSearchInquiryList] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/admin/inquiry/list');
            setSearchInquiryList(response.data.data.data);
        }catch(error){
            if(error.response.status == 403){
                alert("로그인을 해주세요.");
              }
        }
    }

    const handleTitleClick = (item) => {
        setSelectedItem(item.inquiryid);
        setModalShow(true);
      };

    useEffect(() => {
        handleSearch();
    }, [])

    return(
    <div className="App">
      <Container style={{margin:'100px auto'}}>
        <div>
        <h5 style={{marginTop : '50px', marginBottom : '50px'}}>문의사항 관리</h5>
        <Table bordered>
            <thead>
                <tr>
                    <th>No</th>
                    <th>문의제목</th>
                    <th>등록자</th>
                    <th>등록일</th>
                    <th>답변여부</th>
                </tr>
            </thead>
            <tbody>
                {searchInquiryList.map((item, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                    <div
                    onClick={() => handleTitleClick(item)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                    {item.inquirynm}
                    </div>
                    </td>
                    <td>{item.username}</td>
                    <td><FormatDate dateString={item.regdt} /></td>
                    <td>{item.replycount === 0 ? '' : '답변 완료'}</td>
                  </tr>
                ))}
            </tbody>
        </Table>
        </div>
      </Container>
       {/* 화면 중앙에 스피너 표시 */}
       <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <AdminInquiryDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem = {selectedItem}
      />
    </div>
    </div>
    );
}
export default AdminInquiry;