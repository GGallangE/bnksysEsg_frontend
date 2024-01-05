import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Container, Button, Row, Col, Table } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { isLoggedInAtom } from '../atom';
import AdminApiRequestDetail from './AdminApiRequestDetail';

function AdminApiRequest() {
    const [needRequestList, setNeedRequestList] = useState([]);
    const isLoggedIn = useRecoilValue(isLoggedInAtom);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const fetchNeedRequestList = async () => {
        try {
            const response = await axios.get('/spring/admin/api/need_request', {
                // params: { page: 0, pageSize: 10 },
                headers: { 'Authorization': `Bearer ${isLoggedIn}` }
            });
            console.log(response.data.data.data);
            setNeedRequestList(response.data.data.data);
        } catch (error) {
            console.error('Error :', error);
            if (error.response && error.response.status === 403) {
                alert("로그인을 해주세요.");
            }
        }
    };

    useEffect(() => {
        fetchNeedRequestList();
    }, []);

    const searchNeedRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('/spring/admin/api/need_request', {
                params: { apinm: searchTerm },
                headers: { 'Authorization': `Bearer ${isLoggedIn}` }
            });
            setNeedRequestList(response.data.data.data);
            console.log(response.data.data.data)
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.status === 403) {
                alert("로그인을 해주세요.");
            }
        }
    };

    const handleRegisterClick = () => {
        setSelectedItem(null);
        setModalShow(true);
    };

    const handleNeedRequestClick = (needRequest) => {
        setSelectedItem(needRequest.apirqrditemsid);
        setModalShow(true);
    };

    return (
        <div className="App">
            <Container style={{ margin: '100px auto' }}>
                <h5 style={{ marginTop: '50px', marginBottom: '50px' }}>Api Request 필수 항목 관리</h5>
                <Form onSubmit={(e) => searchNeedRequest(e)}>
                    <Row className="justify-content-md-center">
                        <Col md = {4}>
                            <Form.Control 
                                type="text" 
                                placeholder="검색" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Col>
                        <Col xs="auto">
                            <Button variant="primary" type="submit">검색</Button>
                        </Col>
                    </Row>
                </Form>
                <Row className="justify-content-end">
                    <Col xs="auto">
                        <Button variant="primary" onClick={handleRegisterClick} style={{ marginBottom: '20px', marginRight: '30px' }}>
                            등록
                        </Button>
                    </Col>
                </Row>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>API 이름</th>
                            <th>필수 항목(한글)</th>
                            <th>필수 항목(영어)</th>
                            <th>정렬</th>
                        </tr>
                    </thead>
                    <tbody>
                        {needRequestList.map((needRequest, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td  onClick={() => handleNeedRequestClick(needRequest)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                                    {needRequest.apinm}</td>
                                <td>{needRequest.rqrditemnm}</td>
                                <td>{needRequest.rqrdrqstnm}</td>
                                <td>{needRequest.sort}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            <AdminApiRequestDetail
                show={modalShow}
                onHide={() => setModalShow(false)}
                selectedItem={selectedItem}
            />
        </div>
    );
}

export default AdminApiRequest;