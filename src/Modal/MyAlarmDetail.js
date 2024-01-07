import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Modal, Button } from 'react-bootstrap';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

function MyAlarmDetail(props) {
  const [searchResults, setSearchResults] = useState([]);
  const alarmid = props.selectedItem;

  const handleSearch = async () => {
    console.log(props)
    if (alarmid != null) {
      try {
        const response = await axios.get('/spring/mypage/myalarm', {
          params: {
            alarmid: alarmid
          }
        });
        setSearchResults(response.data.data.data[0]);
        checkread();
      } catch (error) {
        console.error("Error searching: ", error);
      }
    }
  }

  const checkread = async () => {
    console.log(props)
    if (alarmid != null) {
      try {
        await axios.post('/spring/mypage/myalarm/read', {
          alarmid: alarmid
        });

      } catch (error) {
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
        <Modal.Header style={{ background: '#bbd4ef' }} closeButton>
        <NotificationsNoneIcon sx={{ fontSize: '25px', margin: '0px 5px'}}/><h4>알림</h4>
        </Modal.Header>
          <Container
            className="border border-dashed p-3"
          >
            <Row className="row">
              <Col xs={12}>
              <h4 style={{ textAlign: 'center' }}>{searchResults.title}</h4>
              </Col>
            </Row>
            <Row className="row">
              <Col xs={12}>
              <div className='noti-content' >
                <span style={{fontSize:'20px'}}>{searchResults.content}</span>
              </div>
              </Col>
            </Row>
            <Button style={{
            padding: '10px 30px',
            margin: '0 auto', 
            display: 'block', 
            background: '#bbd4ef',
            border: 'none', 
            color: 'black', 
          }} onClick={props.onHide}>Close</Button>
          </Container>
      </Modal>
    </div>
  );
}

export default MyAlarmDetail;