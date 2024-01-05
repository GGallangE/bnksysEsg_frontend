import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Container, Button, Row, Col, Table } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { isLoggedInAtom } from '../atom';
import ComCodeDetail from './ComCodeDetail';

function ComCode() {
  const [comCodeList, setComCodeList] = useState([]);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

  const fetchComCodeList = async () => {
    try {
        const response = await axios.get('/spring/admin/api/comcode', {
            params: {
                page: 0, 
                pageSize: 10 
            },
            headers: {
                'Authorization': `Bearer ${isLoggedIn}`
            }
        });
        console.log(response.data.data.data);
        setComCodeList(response.data.data.data); 
    } catch (error) {
        console.error('Error fetching Com Codes:', error);
        if (error.response && error.response.status === 403) {
            alert("로그인을 해주세요.");
        }
    }
};

  useEffect(() => {
    fetchComCodeList();
  }, []);

  const searchComCode = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.get('/spring/admin/api/admin_comcode_search', {
            params: {
                code: searchTerm, 
                // page: 0,
            },
            headers: {
                'Authorization': `Bearer ${isLoggedIn}`
            }
        });
        console.log(response.data.data.data);
        setComCodeList(response.data.data.data); 
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

  const handleComCodeClick = (comCode) => {
    setSelectedItem(comCode.id);
    setModalShow(true);
  };


  return (
    <div className="App">
      <Container style={{ margin: '100px auto' }}>
        <h5 style={{ marginTop: '50px', marginBottom: '50px' }}>공통 코드 관리</h5>
        <Form onSubmit={(e) => searchComCode(e)}>
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
              <th>CODE</th>
              <th>CODE_LABEL</th>
              <th>CODE_VALUE</th>
            </tr>
          </thead>
          <tbody>
            {comCodeList.map((comCode, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td onClick={() => handleComCodeClick(comCode)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                    {comCode.code}</td>
                <td>{comCode.codelabel}</td>
                <td>{comCode.codevalue}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      <ComCodeDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem={selectedItem}
      />
    </div>
  );
}

export default ComCode;