import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import { Modal, Button } from 'react-bootstrap';

function MyApiApplyDetail(props) {
  const [searchResults, setSearchResults] = useState([]);
  const apiapplyid = props.selectedItem;

  const handleSearch = async () => {
    console.log(props)
    if(apiapplyid!=null){
      try{
          const response = await axios.get('/spring/mypage/myapiapply', {
              params : {
                  apiapplyid : apiapplyid}
          });
          setSearchResults(response.data.data.data[0]);
      }catch (error) {
          console.error("Error searching: ", error);
        }
      }
    }

  useEffect(() => {
    handleSearch();
  }, [apiapplyid]);

    return (
      <div>
      <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          API신청내용
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Container
        className="border border-dashed p-3"
      >
        <Row className="mb-3">
          <Col xs={12}>
            <h5>제목: {searchResults.applynm}</h5>
          </Col>
        </Row>
        <Row className="mb-3" style={{ marginTop: '100px' }}>
          <Col xs={12}>
            <h5>내용: {searchResults.applycntn}</h5>
          </Col>
        </Row>
      </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
        </div>
    );
  }

export default MyApiApplyDetail;