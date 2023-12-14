import React, { useState , useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { Col, Form, Row, Container, ListGroup, Card, Modal } from 'react-bootstrap';
import './Main.css';
import NoticeDetail from '../Information/NoticeDetail'
import SvgIcon from '@mui/material/SvgIcon';
// import { SvgIconComponent } from'@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

function Main(){
  const [searchNotice, setSearchNotice] = useState([]);
  const [searchPopular, setSearchPopular] = useState([]);
  const [searchRecent, setSearchRecent] = useState([]);
  const [searchApi, setSearchApi] = useState([]);
  const [showNoticeDetail, setShowNoticeDetail] = useState(false);
  const [selectedNoticeItem, setSelectedNoticeItem] = useState(null);
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

  const handleTitleClick = (item) => {
    setSelectedNoticeItem(item); 
    setShowNoticeDetail(true); 
  };

  const handlePlus = () =>{

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
              style = {{ margin: '150px 0px', width: '80vh' , height : '5vh', color:'#666666', borderRadius:'16px'}}
              placeholder = "검색어를 입력하세요" />
            </Form.Group>
            <SvgIcon component={SearchIcon} inheritViewBox />
          </Col>
          <Col md = "auto">
            <Button onClick={handleSearch} style = {{margin: '150px 0px', height : '5vh', backgroundColor:'#cb2b11'}} variant = "danger" type = "submit">
              Search
            </Button>
          </Col>
        </Row>
        <Row className = "justify-content-md-center">
          <Col md = "auto">
            <Card className = "list-card">
            <Card.Body>
            <Card.Title style={{color:'#cb2b11'}}>NOTICE</Card.Title>
            <Button onClick={handlePlus} style={{ backgroundColor: 'transparent', border: 'none', color:'#666666'}}>
              더보기 &gt;
            </Button>
            {/* 15자 이상이면 ... 으로 나타내기*/}
            <hr style = {{color: '#cb2b11'}}/>
            <ListGroup className="list-style">
              {searchNotice.map((item, index) => (
                <ListGroup.Item key={index}>
                  <a
                    href="#"
                    className="link-style" 
                    onClick={() => handleTitleClick(item.noticeid)}
                  >
                    <span className="number-background">{index + 1}</span>{" "}
                    {item.noticenm.length > 15
                      ? `${item.noticenm.substring(0, 15)}...`
                      : item.noticenm}
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
          <Card.Title style={{color:'#cb2b11'}}>인기데이터</Card.Title>
          <hr style = {{color: '#cb2b11'}}/>
          <ListGroup className="list-style">
              {searchPopular.map((item, index) => (
                <Link to={`/api/detailapi/${item.apilistid}`} className="link-without-underline">
                  <ListGroup.Item key={index}>
                    <a href="#" className="link-style">
                      <span className="number-background">{index + 1}</span> {" "}
                      {item.apinm.length > 15
                      ? `${item.apinm.substring(0, 15)}...`
                      : item.apinm}
                    </a>
                  </ListGroup.Item>
                </Link>
              ))}
            </ListGroup>  
            </Card.Body>
            </Card>
          </Col>
          <Col md = "auto">
          <Card className = "list-card">
          <Card.Body>
          <Card.Title style={{color:'#cb2b11'}}>최신데이터</Card.Title>
          <hr style = {{color: '#cb2b11'}}/>
          <ListGroup className="list-style">
              {searchRecent.map((item, index) => (
                <Link to={`/api/detailapi/${item.apilistid}`} className="link-without-underline">
                  <ListGroup.Item key={index}>
                    <a href="#" className="link-style">
                      <span className="number-background">{index + 1}</span> {" "}
                      {item.apinm.length > 15
                      ? `${item.apinm.substring(0, 15)}...`
                      : item.apinm}
                    </a>
                  </ListGroup.Item>
                </Link>
              ))}
            </ListGroup>
            </Card.Body>
            </Card>
          </Col>
        </Row>

        <NoticeDetail
          show={showNoticeDetail}
          onHide={() => setShowNoticeDetail(false)}
          selectedItem={selectedNoticeItem}
        />
      </Container>
    );
};

export default Main;