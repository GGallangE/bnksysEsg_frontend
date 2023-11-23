import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import { Form, Container, Button, Row, Col } from 'react-bootstrap';

function UseCase() {
    const [searchUseCase, setSearchUseCase] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/usecase/mainusecase', {
                params:{
                    searchname: searchTerm
                },
            });
            setSearchUseCase(response.data.data.data);
            
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
        handleSearch();
    }, []);

return(
<div className="App">
    <Container style={{margin:'100px auto'}}>
        <div>
        <h5>활용사례</h5>
        <Row className = "justify-content-md-center">
          <Col md = "auto">
            <Form.Group className = "mb-3" controlId = "formGridAddress1">
              <Form.Control 
              onKeyDown={handleKeyDown} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              value={searchTerm} 
              style = {{ margin: '50px 0px', width: '500px' }} 
              placeholder = "검색어를 입력하세요" />
            </Form.Group>
          </Col>
          <Col md = "auto">
            <Button onClick={handleSearch} style = {{margin: '50px 0px'}} variant = "primary" type = "submit">
              검색
            </Button>
          </Col>
        </Row>
        <Row className="justify-content-end">
        <Col md = "auto">
            <Button onClick={()=>{ navigate('/openapi/usecaseregister');}} style = {{margin: '10px'}} variant = "primary" type = "submit">
                활용사례 등록하기
            </Button>
        </Col>
        </Row>
        
        <Table bordered>
            <thead>
                <tr>
                    <th>No</th>
                    <th>제목</th>
                    <th>등록자</th>
                    <th>등록일</th>
                </tr>
            </thead>
            <tbody>
                {searchUseCase.map((item, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/openapi/usecasedetail/${item.usecaseid}`}>{item.title}</Link>
                    </td>
                    <td>{item.username}</td>
                    <td><FormatDate dateString={item.regdt} /></td>
                  </tr>
                ))}
            </tbody>
        </Table>
        </div>
      </Container>
    </div>
)
};
export default UseCase;