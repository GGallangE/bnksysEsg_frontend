import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const FileDownload = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* 버튼 1 */}
      <Button variant="primary" onClick={handleShow}>
        Open Modal 1
      </Button>

      {/* 모달 1 */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal 1</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Contents for Modal 1
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 버튼 2 */}
      <Button variant="primary" onClick={handleShow}>
        Open Modal 2
      </Button>

      {/* 모달 2 */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal 2</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Contents for Modal 2
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 버튼 3, 4에 대해서도 같은 패턴으로 작성 가능 */}
    </>
  );
};

export default FileDownload;