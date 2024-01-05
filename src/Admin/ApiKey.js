import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Container, Button, Row, Col, Table } from 'react-bootstrap';
import FormatDate from '../Format/FormatDate';
import { useRecoilValue } from 'recoil';
import { isLoggedInAtom } from '../atom';
import ApiKeyDetail from './ApiKeyDetail';

function Apikey() {
  const [apiKeyList, setApiKeyList] = useState([]);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

  const fetchApiKeyList = async () => {
    try {
      const response = await axios.get('/spring/admin/api/key');
      console.log(response.data.data.data);
      setApiKeyList(response.data.data.data); 
    } catch (error) {
      console.error('Error fetching API keys:', error);
      if (error.response && error.response.status === 403) {
        alert("로그인을 해주세요.");
      }
    }
  };

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  useEffect(() => {
    fetchApiKeyList();
  }, []);

  const searchApiKeys = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/spring/admin/api/key_search?name=${searchTerm}`);
      console.log(response.data.data.data)
      setApiKeyList(response.data.data.data); 
    } catch (error) {
      console.error('Error searching for API keys:', error);
      if (error.response && error.response.status === 403) {
        alert("로그인을 해주세요.");
      }
    }
  };

  const handleRegisterClick = () => {
    setSelectedItem(null); 
    setModalShow(true);
  };

  const handleApiSiteClick = (apiKey) => {
    setSelectedItem(apiKey.apikeyid);
    setModalShow(true);
  };


  return (
    <div className="App">
      <Container style={{ margin: '100px auto' }}>
        <h5 style={{ marginTop: '50px', marginBottom: '50px' }}>API 키 관리</h5>
        <Form onSubmit={searchApiKeys}>
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
              <th>API 사이트</th>
              <th>APIKEY</th>
              <th>사용일</th>
              <th>종료일</th>
            </tr>
          </thead>
          <tbody>
            {apiKeyList.map((apiKey, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="truncate" 
                onClick={() => handleApiSiteClick(apiKey)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                  {truncateText(apiKey.sitenm, 15)}
                </td>
                <td className="truncate">{truncateText(apiKey.apikey, 40)}</td>
                <td>{apiKey.strdt}</td>
                <td>{apiKey.edt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      <ApiKeyDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem={selectedItem}
      />
    </div>
  );
}

export default Apikey;