import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';
import ModalRgt from '../ModalRgt'

function InquiryRgt(){
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [modalShow, setModalShow] = React.useState(false);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;
    
    const usecaseRegister = async () => {
        try {
          const response = await axios.post('/spring/request/inquiry', {
            inquirynm: title,
            inquirycntn: content,
          }
        );
        console.log(response)
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
    <h5 style={{marginTop : '100px'}}>문의하기</h5>
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>제목</Form.Label>
        <Form.Control onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="제목을 입력하세요" style={{ height: '50px', fontSize: '18px' }}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>내용</Form.Label>
        <Form.Control onChange={(e) => setContent(e.target.value)} value={content} placeholder="내용을 입력하세요" as="textarea" rows={3} style={{ height: '200px', fontSize: '15px' }}/>
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
        message = "문의가 등록되었습니다."
      />
    </div>
    );
}
export default InquiryRgt;