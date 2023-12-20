import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Container } from 'react-bootstrap';
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';
import ModalRgt from '../ModalRgt';
import '../css/InquiryRgt.css';
import xioImage from '../images/character_Xio.gif';

function InquiryRgt(){
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [modalShow, setModalShow] = React.useState(false);
    const navigate = useNavigate();
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;
    
    const inquiryRegister = async () => {
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

      const inquiryCancel = () => {
        navigate('/');
      };

    return(
    <div>
    <Container>
    
    <h1>Q&A   <img src={xioImage} alt="캐릭터 지오" style={{ width: '80px'}}></img></h1>
    <Form>
    
      <Form.Group>
      
        <Form.Label className='form-label'>제목</Form.Label>
        
        <Form.Control onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="제목을 입력하세요" style={{ height: '50px', fontSize: '15px', borderColor:'#bcbcbc' }}/>
      </Form.Group>
      <Form.Group>
        <Form.Label className='form-label'>내용</Form.Label>
        <Form.Control onChange={(e) => setContent(e.target.value)} value={content} placeholder="내용을 입력하세요" as="textarea" rows={3} style={{ height: '350px', fontSize: '15px', borderColor:'#bcbcbc' }}/>
      </Form.Group>
    </Form>
    <div className="btm_area">
				<input type="submit" value="등록" className="btn_rgt" onClick={inquiryRegister}/>
				<input type="reset" value="취소" className="btn_cancel" onClick={inquiryCancel}/>
    </div>
    
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