import React, { useState , useEffect } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';


function InquiryRgt(){
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;
    
    const usecaseRegister = async () => {
        try {
          const response = await axios.post('/spring/request/inquiry', {
            inquirynm: title,
            inquirycntn: content,
          }
        );
      
          // 응답 확인
          console.log('응답 데이터:', response.data);
        } catch (error) {
          if(error.response.status == 403){
            alert("로그인을 해주세요.");
          }
        }
      };

    return(
    <div>
    <Container>
    <h5>문의하기</h5>
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>제목</Form.Label>
        <Form.Control onChange={(e) => setTitle(e.target.value)} type="text" placeholder="제목을 입력하세요" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>내용</Form.Label>
        <Form.Control onChange={(e) => setContent(e.target.value)} as="textarea" rows={3} />
      </Form.Group>
    </Form>
    <Button onClick={usecaseRegister} style = {{margin: '50px 0px'}} variant = "primary" type = "submit">
              등록
    </Button>
    </Container>
    </div>
    );
}
export default InquiryRgt;