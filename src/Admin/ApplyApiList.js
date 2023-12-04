import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container }from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate';
import FormatCode from '../Format/FormatCode';
import AdminInquiryDetail from './AdminInquiryDetail'
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';


function ApplyApiList(){
    const [searchInquiryList, setSearchInquiryList] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/admin/apiapplylist');
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
        <h5 style={{marginTop : '50px', marginBottom : '50px'}}>API 신청 관리</h5>
        <Table bordered>
            <thead>
                <tr>
                    <th>No</th>
                    <th>API 신청 이름</th>
                    <th>신청자</th>
                    <th>신청일</th>
                    <th>답변일</th>
                    <th>상태</th>
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
                    {item.applynm}
                    </div>
                    </td>
                    <td>{item.username}</td>
                    <td><FormatDate dateString={item.applydate} /></td>
                    <td>{item.rplydate ? <FormatDate dateString={item.rplydate} /> : ''}</td>
                    <td>{item.applydvcd === '01' ? '답변중' : '답변 완료'}</td>
                  </tr>
                ))}
            </tbody>
        </Table>
        </div>
      </Container>
      <AdminInquiryDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem = {selectedItem}
      />
    </div>
    );
}
export default ApplyApiList;