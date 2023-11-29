import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Modal, Button } from 'react-bootstrap';

function MyAlarmDetail(props) {
  const [searchResults, setSearchResults] = useState([]);
  const alarmid = props.selectedItem;

  const handleSearch = async () => {
    console.log(props)
    if(alarmid!=null){
      try{
          const response = await axios.get('/spring/mypage/myalarm', {
              params : {
                alarmid : alarmid}
          });
          setSearchResults(response.data.data.data[0]);
          checkread();
      }catch (error) {
          console.error("Error searching: ", error);
        }
      }
    }

    const checkread = async () => {
        console.log(props)
        if(alarmid!=null){
          try{
            await axios.post('/spring/mypage/myalarm/read', {
                alarmid: alarmid
            });

          }catch (error) {
              console.error("Error searching: ", error);
            }
          }
        }

  useEffect(() => {
    handleSearch();
  }, [alarmid]);

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
          알림 내용title
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Container
        className="border border-dashed p-3"
      >
        <Row className="mb-3">
          <Col xs={12}>
            <h5>제목: {searchResults.title}</h5>
          </Col>
        </Row>
        <Row className="mb-3" style={{ marginTop: '100px' }}>
          <Col xs={12}>
            <h5>내용: {searchResults.content}</h5>
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

export default MyAlarmDetail;