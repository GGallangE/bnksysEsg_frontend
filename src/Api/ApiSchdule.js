import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import { Modal, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function MyApiApplyDetail(props) {
  

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
        <Row className="mb-3">
          <Col xs={12}>
            <h5>제목: {searchResults.applynm}</h5>
          </Col>
        </Row>
        <Row className="mb-3" style={{ marginTop: '100px' }}>
          <Col xs={12}>
          <DropdownButton id="dropdown-basic-button" title="Dropdown button">
      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    </DropdownButton>
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