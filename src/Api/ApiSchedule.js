import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import { Form, Modal, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function ApiSchedule(props) {
  const [selsectedTime, setSelectedTime] = useState('');
  const hours = Array.from({ length: 24 }, (_, index) => index);
  // 0부터 23까지의 숫자 배열 생성

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

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
          예약하기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Container
        className="border border-dashed p-3"
      >
        <Row className="mb-3" style={{ marginTop: '100px' }}>
          <Col xs={3}>
            <Form.Select>
              <option value="">선택하세요</option>
              <option value="daily">매달</option>
              <option value="weekly">매주</option>
              <option value="monthly">매주</option>
            </Form.Select>
          </Col>
          <Col xs={3}>
            <Form.Select>
              <option value="">선택하세요</option>
              <option value="MON">월</option>
              <option value="TUE">화</option>
              <option value="WED">수</option>
              <option value="THU">목</option>
              <option value="FRI">금</option>
              <option value="SAT">토</option>
              <option value="SUN">일</option>
            </Form.Select>
          </Col>
          <Col xs={3}>
            <Form.Select>
              <option value="">선택하세요</option>
              {hours.map((hour) => (
                <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                {`${hour.toString().padStart(2, '0')}:00`}
                </option>
              ))}
            </Form.Select>
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

export default ApiSchedule;