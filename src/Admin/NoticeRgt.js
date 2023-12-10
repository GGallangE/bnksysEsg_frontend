import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate';
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import { isLoggedInAtom } from '../atom';
import { useRecoilValue } from 'recoil';
import ModalRgt from '../ModalRgt';

function NoticeRgt() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

  const noticeRegister = async () => {
    try {
        if (!title || !content) {
            alert('답변 제목과 내용은 필수 항목입니다.');
            return;
          }
        if (files.length > 0) {
            const uploadResponse = await uploadAtch();
            
            noticeRgt(parseInt(uploadResponse.data.messages[0], 10));
      } else {
        noticeRgt();
      }
    } catch (error) {
    }
  };
  
  const uploadAtch = async () => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });

      const response = await axios.post('/spring/atchfile/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  const noticeRgt = async (atchfileid = null) => {
    try {
      const noticedto = {
        noticenm: title,
        noticecntn: content,
        atchfileid: atchfileid, 
      };
      const response = await axios.post('/spring/admin/notice/create', noticedto)
      console.log(response.data)
      alert("공지사항 등록 완료");
      setTitle('');
      setContent('');
      setFiles([]);

    } catch (error) {
        console.log(error)
        alert("공지사항 등록 실패");
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  return (
    <div>
      <Container>
        <h5 style={{ marginTop: '100px' }}>공지사항 작성</h5>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>제목</Form.Label>
            <Form.Control
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="제목을 입력하세요"
              style={{ height: '50px', fontSize: '18px' }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>내용</Form.Label>
            <Form.Control
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="내용을 입력하세요"
              as="textarea"
              rows={3}
              style={{ height: '200px', fontSize: '15px' }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlFile1">
            <Form.Label>첨부 파일</Form.Label>
            <Form.Control type="file" multiple onChange={handleFileChange} />
          </Form.Group>
          {files.length > 0 && (
            <div>
                <strong>선택한 파일:</strong>
                <ul>
                {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                ))}
                </ul>
            </div>
         )}  
        </Form>
        <Button
          onClick={noticeRegister}
          style={{ margin: '50px 0px' }}
          variant="primary"
          type="submit"
        >
          등록
        </Button>
      </Container>
      <ModalRgt
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setTitle(''); 
          setContent(''); 
          setFiles([]);
        }}
        message="공지사항이 등록되었습니다."
      />
    </div>
  );
}

export default NoticeRgt;
