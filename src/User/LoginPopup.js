import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LoginPopup({ show, handleClose, handleLoginSuccess, redirectUrl }) {
  const handleConfirm = () => {
    handleClose();
    handleLoginSuccess();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>로그인이 필요합니다</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          취소
        </Button>
        <Link to="/login">
          <Button variant="primary" onClick={handleConfirm}>
            확인
          </Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginPopup;
