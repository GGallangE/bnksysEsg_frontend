import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormatDate from '../Format/FormatDate'
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

function ApplyApiListDetail(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiapplyid = props.selectedItem;

  const handleSearch = async () => {
    setSearchResults([]);
    setIsLoading(true);
    try {
      const response = await axios.get('/spring/admin/apiapplylist', {
        params: {
          apiapplyid: apiapplyid
        }
      });
      setSearchResults(response.data.data.data[0]);
      console.log(response.data.data)
    } catch (error) {
      console.error("Error searching: ", error);
    } finally {
      setIsLoading(false);
    }
  };

    const handleSave = async () => {
        try {
            const result = await axios.post('/spring/admin/apiapply/confirm', {
                apiapplyid: apiapplyid,
                applydvcd : searchResults.applydvcd
              });
              alert('API 승인 여부가 변경되었습니다.');
        }catch(error){
              console.log(error)   
        }
        props.onHide();
        setSearchResults([]);
    };  

    const handleClose = () => {
        props.onHide();
        setSearchResults([]);
      };

      const handleApprovalStatusChange = (selectedValue) => {
        setSearchResults({ ...searchResults, applydvcd: selectedValue });
      };
      
  useEffect(() => {
    handleSearch();
  }, [apiapplyid]);

  return (
    <div>
      {isLoading ? (
        <Spinner animation="border" role="status" />
      ) : searchResults ? (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">API 신청 상세 관리</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container className="border border-dashed p-3">
               <Row className="mb-3">
                <Col xs={12}>
                    <h5>신청 API: {searchResults.apinm}</h5>
                </Col>
                </Row>
                <Row className="mb-3">
                <Col xs={12}>
                    <h5>신청 제목: {searchResults.applynm}</h5>
                </Col>
                </Row>
                <Col xs={12} className="text-end" style={{marginTop : '30px'}}>
                    <h5>신청자: {searchResults.username}</h5>
                </Col>
                <Col xs={12} className="text-end" style={{marginTop : '20px'}}>
                    <h5>신청일: {searchResults.applydate ? <FormatDate dateString={searchResults.applydate} /> : ''}</h5>
                </Col>
                <Row className="mb-3" style={{ marginTop: '30px' }}>
                <Col xs={12}>
                    <h5>신청 내용: {searchResults.applycntn}</h5>
                    <hr style={{marginTop : '20px'}}></hr>
                </Col>
                </Row>
                <Row className="mb-3" style={{ marginTop: '20px' }}>
                    <Col xs={12}>
                        <h5>API 승인 여부:</h5>
                        <Form.Control
                        as="select"
                        value={searchResults.applydvcd}
                        onChange={(e) => handleApprovalStatusChange(e.target.value)}
                        >
                        <option value="01">신청중</option>
                        <option value="02">반려</option>
                        <option value="03">승인</option>
                        </Form.Control>
                    </Col>
                </Row>
            </Container>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleClose}>Close</Button>
            </Modal.Footer>
      </Modal>
        ) : (
          <div>데이터가 없습니다.</div>
        )
}
    </div>
    );
  }

export default ApplyApiListDetail;