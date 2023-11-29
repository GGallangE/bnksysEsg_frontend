import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import { isLoggedInAtom } from '../atom';
import { useRecoilValue } from 'recoil';
import Editor from '../Editor';

function UseCaseRgt(){
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    const navigate = useNavigate();
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;
    
    const usecaseRegister = async () => {
        try {
          const response = await axios.post('/spring/usecase/usecase', {
            title: title,
            content: content,
          }
        );
        navigate('/openapi/usecase');
        } catch (error) {
          if(error.response.status == 403){
            alert("로그인을 해주세요.");
          }
          console.log(error)
        }
      };
    
    const handleQuillChange = (value) => {
      setContent(value);
    };

    return(
    <div>
    <Container>
    <h5>활용사례 등록하기</h5>
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>제목</Form.Label>
        <Form.Control onChange={(e) => setTitle(e.target.value)} type="text" placeholder="제목을 입력하세요" />
      </Form.Group>
    <Editor onQuillChange={handleQuillChange}/>
    <Button onClick={usecaseRegister} style = {{margin: '50px 0px'}} variant = "primary" type = "submit">
        등록
    </Button>
    </Form>
    </Container>
    
    </div>
    );
    
};

export default UseCaseRgt;