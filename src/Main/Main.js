import React, { useState , useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { Col, Form, Row, Container, ListGroup, Card } from 'react-bootstrap';
import './Main.css';

function Main(){
  const [searchNotice, setSearchNotice] = useState([]);
  const [searchPopular, setSearchPopular] = useState([]);
  const [searchRecent, setSearchRecent] = useState([]);
  const [searchApi, setSearchApi] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const notice = async () => {
    try{
      const response = await axios.get('/spring/main/notice', {
        params : {
          mainsort : "yes"
        }
      });
      setSearchNotice(response.data.data.data);
    } catch(error){
      console.error("Error searching: ", error);
    }
  };

  const popular = async () => {
    try{
      const response = await axios.get('/spring/main/view_recent/top5', {
        params : {
          sort : "view"
        }
      });
      setSearchPopular(response.data.data.data);
    } catch(error){
      console.error("Error searching: ", error);
    }
  };

  const recent = async () => {
    try{
      const response = await axios.get('/spring/main/view_recent/top5', {
        params : {
          sort : "recent"
        }
      });
      setSearchRecent(response.data.data.data);
    } catch(error){
      console.error("Error searching: ", error);
    }
  };

  const handleSearch = async () => {
    try{
        const response = await axios.get('/spring/main/search', {
            params:{
                sortBy: "조회순",
                name: searchTerm
            },
        });
        setSearchApi(response.data.data.data);
        navigate(
        '/openapi/apilist', 
        {state: 
        {name: searchTerm,
        sortBy: "조회순"}
        });
    }catch(error){
        console.error("Error searching : ", error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    notice();
    popular();
    recent();
  }, []);
    // console.log(searchNotice);
    return(
        <Container>
        <Row className = "justify-content-md-center">
          <Col md = "auto">
            <Form.Group className = "mb-3" controlId = "formGridAddress1">
              <Form.Control 
              onKeyDown={handleKeyDown} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              value={searchTerm} 
              style = {{ margin: '150px 0px', width: '500px' }}
              placeholder = "검색어를 입력하세요" />
            </Form.Group>
          </Col>
          <Col md = "auto">
            <Button onClick={handleSearch} style = {{margin: '150px 0px'}} variant = "primary" type = "submit">
              검색
            </Button>
          </Col>
        </Row>
        <Row className = "justify-content-md-center">
          <Col md = "auto">
            <Card className = "list-card">
            <Card.Body>
            <Card.Title>공지사항</Card.Title>
            {/* 15자 이상이면 ... 으로 나타내기*/}
            <ListGroup className="list-style">
              {searchNotice.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Link to={`/Information/Noticedetail/${item.noticeid}`} className="link-style">
                    <span className="number-background">{index + 1}</span>{" "}
                    {item.noticenm.length > 15 ? `${item.noticenm.substring(0, 15)}...` : item.noticenm}
                  </Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
            </Card.Body>
            </Card>
          </Col>
          <Col md = "auto">
          <Card className = "list-card">
          <Card.Body>
          <Card.Title>인기데이터</Card.Title>
            <ListGroup className="list-style">
              {searchPopular.map((item, index) => (
                <ListGroup.Item key={index}>
                  <a href="#" className="link-style">
                    <span className="number-background">{index + 1}</span> {" "}
                    {item.apinm.length > 15
                     ? `${item.apinm.substring(0, 15)}...`
                    : item.apinm}
                  </a>
                </ListGroup.Item>
              ))}
            </ListGroup>  
            </Card.Body>
            </Card>
          </Col>
          <Col md = "auto">
          <Card className = "list-card">
          <Card.Body>
          <Card.Title>최신데이터</Card.Title>
          <ListGroup className="list-style">
              {searchRecent.map((item, index) => (
                <ListGroup.Item key={index}>
                  <a href="#" className="link-style">
                    <span className="number-background">{index + 1}</span> {" "}
                    {item.apinm.length > 15
                     ? `${item.apinm.substring(0, 15)}...`
                    : item.apinm}
                  </a>
                </ListGroup.Item>
              ))}
            </ListGroup>
            </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
};

export default Main;