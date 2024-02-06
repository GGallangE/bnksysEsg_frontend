import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function MoveApiRegister(props) {
  const navigate = useNavigate();
  const handleCloseModal = () => {
    props.onHide();
  };

  const handleMoveApiRegister = (apilistid, apinm) => {
    navigate("/OPENAPI/ApiApply", { state: { apilistid, apinm } });
  };

  return (
    <div>
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title>api 신청</Modal.Title>
        </Modal.Header>
        <Modal.Body><p style={{fontWeight:'bold', fontSize:'18px'}}>{props.apinm}</p><p>상세설명: {props.apiexpl}</p>이 api를 신청하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button style={{border:'none'}}variant="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
          <Button style={{background:"#a2d7d4", border:'none'}} variant="secondary" onClick={()=>handleMoveApiRegister(props.apilistid, props.apinm)}>
            api 신청하기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MoveApiRegister;
