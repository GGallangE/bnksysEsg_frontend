import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Container, Button, Row, Col, Table } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { isLoggedInAtom } from '../atom';
import AdminApiResponseDetail from './AdminApiResponseDetail';

function AdminApiResponse() {
    const [needResponseList, setNeedResponseList] = useState([]);
    const isLoggedIn = useRecoilValue(isLoggedInAtom);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const fetchNeedResponseList = async () => {
        try {
            const response = await axios.get('/spring/admin/api/need_response', {
                headers: { 'Authorization': `Bearer ${isLoggedIn}` }
            });
            console.log(response.data.data.data);
            setNeedResponseList(response.data.data.data);
        } catch (error) {
            console.error('Error :', error);
            if (error.response && error.response.status === 403) {
                alert("로그인을 해주세요.");
            }
        }
    };

    useEffect(() => {
        fetchNeedResponseList();
    }, []);

    const searchNeedResponse = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('/spring/admin/api/need_response', {
                params: { apinm: searchTerm },
                headers: { 'Authorization': `Bearer ${isLoggedIn}` }
            });
            setNeedResponseList(response.data.data.data);
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

    const handleNeedResponseClick = (needResponse) => {
        setSelectedItem(needResponse.apirsqeitemsid);
        setModalShow(true);
    };

    return (
        <div className="App">
            <Container style={{ margin: '100px auto' }}>
                <h5 style={{ marginTop: '50px', marginBottom: '50px' }}>Api Response 필수 항목 관리</h5>
                <Form onSubmit={searchNeedResponse}>
                    <Row className="justify-content-md-center">
                        <Col md={4}>
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
                            <th>한글명</th>
                            <th>영문명</th>
                        </tr>
                    </thead>
                    <tbody>
                        {needResponseList.map((needResponse, index) => (
                            <tr key={index} onClick={() => handleNeedResponseClick(needResponse)}>
                                <td>{index + 1}</td>
                                <td style={{ cursor: 'pointer', textDecoration: 'underline' }}>{needResponse.apinm}</td>
                                <td>{needResponse.krnm}</td>
                                <td>{needResponse.ennm}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            <AdminApiResponseDetail
                show={modalShow}
                onHide={() => setModalShow(false)}
                selectedItem={selectedItem}
            />
        </div>
    );
}

export default AdminApiResponse;