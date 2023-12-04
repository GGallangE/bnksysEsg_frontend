import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate';
import AdminApiListDetail from './AdminApiListDetail'
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';


function AdminApiList(){
    const [searchApplyApiList, setSearchApplyApiList] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/admin/apilist');
            setSearchApplyApiList(response.data.data.data);
            console.log(response)
        }catch(error){
            if(error.response.status == 403){
                alert("로그인을 해주세요.");
              }
        }
    }

    const handleRegister = () => {
        setSelectedItem();
        setModalShow(true);
        console.log('등록 버튼 클릭!');
      };

    const handleTitleClick = (item) => {
        setSelectedItem(item.apilistid);
        setModalShow(true);
      };

    useEffect(() => {
        handleSearch();
    }, [])

    return(
    <div className="App">
      <Container style={{margin:'100px auto'}}>
        <div>
        <h5 style={{marginTop : '50px', marginBottom : '50px'}}>API 목록 관리</h5>
        <Row className="justify-content-end">
            <Col xs="auto">
                <Button variant="primary" onClick={handleRegister} style={{ marginBottom: '20px', marginRight : '30px' }}>
                     등록
                </Button>
            </Col>
        </Row>
        <Table bordered>
            <thead>
                <tr>
                    <th>No</th>
                    <th>API 이름</th>
                    <th>제공기관</th>
                    <th>등록일</th>
                    <th>API 신청 이름</th>
                </tr>
            </thead>
            <tbody>
                {searchApplyApiList.map((item, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                    <div
                    onClick={() => handleTitleClick(item)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                    {item.apinm}
                    </div>
                    </td>
                    <td>{item.prvorg}</td>
                    <td><FormatDate dateString={item.apirgdt} /></td>
                    <td>{item.apiapplynm}</td>
                  </tr>
                ))}
            </tbody>
        </Table>
        </div>
      </Container>
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
      <AdminApiListDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem = {selectedItem}
      />
    </div>
    );
}
export default AdminApiList;