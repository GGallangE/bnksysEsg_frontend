import React from 'react';
import { Modal, Button, Col, Row, Container } from 'react-bootstrap';

function ModalRgt(props){
    return(
        <div>
      <Modal
      {...props}
      size="small"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          알림
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Container className="border border-dashed p-3">
        <Row className="mb-3">
          <Col xs={12}>
            <h6>{props.message}</h6>
          </Col>
        </Row>
        <Row className="justify-content-end">
          <Col xs="auto">
            <Button onClick={props.onHide}>Close</Button>
          </Col>
        </Row>      
      </Container>
      </Modal.Body>
      
      </Modal>
        </div>
    )
}

export default ModalRgt;