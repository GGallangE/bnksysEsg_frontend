import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function FileDownload(props) {
  const handleCloseModal = () => {
    props.onHide();
  };

  const handleExcelDown = () => {

  }

  const handleJsonDown = () => {

  }

  const handleXmlDown = () => {

  }

  return (
    <div>
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title>파일 다운로드</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="secondary" onClick={handleExcelDown}>
            EXCEL
          </Button>
          <Button variant="secondary" onClick={handleJsonDown}>
            JSON
          </Button>
          <Button variant="secondary" onClick={handleXmlDown}>
            XML
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FileDownload;
