import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormatDate from '../Format/FormatDate'
import { Modal, Button, Form } from 'react-bootstrap';

function AdminInquiryDetail(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchAnswer, setSearchAnswer] = useState([]);
  const [replyTitle, setReplyTitle] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const inquiryid = props.selectedItem;

  const handleSearch = async () => {
    console.log(props)
    if(inquiryid!=null){
      try{
          const response = await axios.get('/spring/admin/inquiry/list', {
              params : {
                  inquiryid : inquiryid}
          });
          setSearchResults(response.data.data.data[0]);
          setReplyTitle('');
          setReplyContent('');
          if(response.data.data.data[0].replycount == 1){
            answerSeacrh();
            console.log(1)
          }
      }catch (error) {
          console.error("Error searching: ", error);
        }
      }
    }

    const answerSeacrh = async () => {
      if(inquiryid!=null){
        try{
            const response = await axios.get('/spring/admin/inquiry/list/answer', {
                params : {
                  inquiryid : inquiryid}
            });
            setSearchAnswer(response.data.data.data[0]);
            setReplyTitle(response.data.data.data[0].inquirynm);
            setReplyContent(response.data.data.data[0].inquirycntn);
            console.log(response.data.data.data[0]);
        }catch (error) {
            console.error("Error searching: ", error);
          }
        }
      }

    const handleSave = async () => {
      if (!replyTitle || !replyContent) {
        alert('답변 제목과 내용은 필수 항목입니다.');
        return;
      }
        try {
            const result = await axios.post('/spring/admin/inquiry/answer', {
                inquirynm: replyTitle,
                inquirycntn: replyContent,
                parentid : inquiryid
              });
              alert('답변 작성이 완료 되었습니다.');
        }catch(error){
            
        }
        props.onHide();
        setReplyTitle('');
        setReplyContent('');
    };  

    const handleClose = () => {
        props.onHide();
        setReplyTitle('');
        setReplyContent('');
      };
      
  useEffect(() => {
    handleSearch();
  }, [inquiryid]);

  return (
    <div>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">문의 내용</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="border border-dashed p-3">
            <Row className="mb-3">
              <Col xs={12}>
                <h5>제목: {searchResults.inquirynm}</h5>
              </Col>
            </Row>
            <Row className="mb-3" style={{ marginTop: '30px' }}>
              <Col xs={12}>
                <h5>내용: {searchResults.inquirycntn}</h5>
              </Col>
            </Row>
            <hr style={{marginTop : '40px'}}></hr>
            <Row className="mb-3">
              <Col xs={12}>
                <Form>
                  <Form.Group controlId="replyTitle">
                    <Form.Label>답변 제목</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="답변 제목을 입력해 주세요"
                      value={replyTitle}
                      onChange={(e) => setReplyTitle(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="replyContent">
                    <Form.Label>답변 내용</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="답변 내용을 입력해 주세요"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
    );
  }

export default AdminInquiryDetail;