import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function MoveApiRegister(props) {
  const navigate = useNavigate();
  const handleCloseModal = () => {
    props.onHide();
  };

  const handleMoveApiRegister = () => {
    navigate("/OPENAPI/ApiApply");
  };

  return (
    <div>
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title>api 신청</Modal.Title>
        </Modal.Header>
        <Modal.Body>이 api를 신청하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
          <Button variant="secondary" onClick={handleMoveApiRegister}>
            api 신청하기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MoveApiRegister;
