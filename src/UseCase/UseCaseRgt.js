import React, { useState , useEffect } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format'
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';

function UseCaseRgt(){
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const isLoggedIn= useRecoilValue(isLoggedInAtom);

    const usecaseRegister = async () => {
        try {
          const response = await axios.post('/spring/usecase/usecase', {
            title: title,
            content: content,
          },
          {
            headers: {
              Authorization: `Bearer ${isLoggedIn}`,
            },
        }
        );
      
          // 응답 확인
          console.log('응답 데이터:', response.data);
        } catch (error) {
          // 오류 처리
          console.error('오류 발생:', error);
        }
      };

    return(
    <div>
    <Container>
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Email address</Form.Label>
        <Form.Control onChange={(e) => setTitle(e.target.value)} type="text" placeholder="제목을 입력하세요" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Example textarea</Form.Label>
        <Form.Control onChange={(e) => setContent(e.target.value)} as="textarea" rows={3} />
      </Form.Group>
    </Form>
    <Button onClick={usecaseRegister} style = {{margin: '50px 0px'}} variant = "primary" type = "submit">
              등록
    </Button>
    </Container>
    </div>
    );
    
};

export default UseCaseRgt;