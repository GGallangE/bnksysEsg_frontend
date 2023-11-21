import React, { useState , useEffect } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';
import ModalRgt from '../ModalRgt'

function ApiApply(){
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [modalShow, setModalShow] = React.useState(false);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;
    
    const usecaseRegister = async () => {
        try {
          const response = await axios.post('/spring/request/apiapply', {
            applynm: title,
            applycntn: content,
          }
        );
      
          // 응답 확인
          console.log('응답 데이터:', response.data);
          setModalShow(true);
        } catch (error) {
            if(error.response.status == 403){
                alert("로그인을 해주세요.");
              }
        }
      };

    return(
    <div>
    <Container>
    <h5>API 신청하기</h5>
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>제목</Form.Label>
        <Form.Control onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="제목을 입력하세요" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>신청이유</Form.Label>
        <Form.Control onChange={(e) => setContent(e.target.value)} value={content} as="textarea" rows={3} />
      </Form.Group>
    </Form>
    <Button onClick={usecaseRegister} style = {{margin: '50px 0px'}} variant = "primary" type = "submit">
              등록
    </Button>
    </Container>
    <ModalRgt
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setTitle(''); // 제목 입력 상태 초기화
          setContent(''); // 신청이유 입력 상태 초기화
        }}
        message = "Api신청이 완료되었습니다."
      />
    </div>
    );

    
};

export default ApiApply;