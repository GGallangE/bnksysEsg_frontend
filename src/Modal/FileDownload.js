import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import '../css/FileDownload.css'

function FileDownload(props) {
  const handleCloseModal = () => {
    props.onHide();
  };

  const handleExcelDown = async () => {
    try {
      const dataToSend = props.rows.map(({ id, isNew, ...rest }) => rest);
      const response = await axios.post("/spring/api/request", {
        apilistid: props.apilistid,
        params: dataToSend,
        type: "excel",
      });

      console.log(response);
    } catch (error) {
      console.error("Error searching: ", error);
    }
    try {
      const response = await axios.post("/spring/userapi/useapi", {
        apilistid: props.apilistid,
      });
      console.log('사용',response);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  const handleTxtDown = async () => {
    try {
      const dataToSend = props.rows.map(({ id, isNew, ...rest }) => rest);
      const response = await axios.post("/spring/api/request", {
        apilistid: props.apilistid,
        params: dataToSend,
        type: "txt",
      });

      console.log(response);
    } catch (error) {
      console.error("Error searching: ", error);
    }
    try {
      const response = await axios.post("/spring/userapi/useapi", {
        apilistid: props.apilistid,
      });
      console.log('사용',response);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  const handleJsonDown = async () => {
    try {
      const dataToSend = props.rows.map(({ id, isNew, ...rest }) => rest);
      const response = await axios.post("/spring/api/request", {
        apilistid: props.apilistid,
        params: dataToSend,
        type: "json",
      });

      console.log(response);
    } catch (error) {
      console.error("Error searching: ", error);
    }
    try {
      const response = await axios.post("/spring/userapi/useapi", {
        apilistid: props.apilistid,
      });
      console.log('사용',response);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  const handleXmlDown = async () => {
    try {
      const dataToSend = props.rows.map(({ id, isNew, ...rest }) => rest);
      const response = await axios.post("/spring/api/request", {
        apilistid: props.apilistid,
        params: dataToSend,
        type: "xml",
      });

      console.log(response);
    } catch (error) {
      console.error("Error searching: ", error);
    }
    try {
      const response = await axios.post("/spring/userapi/useapi", {
        apilistid: props.apilistid,
      });
      console.log('사용',response);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  return (
    <div>
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title>파일 다운로드</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign:'center'}}>
          <p style={{fontSize:'15px'}}>다운로드 형식을 선택해주세요!</p>
          <Button className="green-button" onClick={handleExcelDown}>
            EXCEL
          </Button>
          <Button className="green-button" onClick={handleTxtDown}>
            TXT
          </Button>
          {props.dataformat && props.dataformat.includes("JSON") && (
            <Button className="green-button" onClick={handleJsonDown}>
              JSON
            </Button>
          )}
          {props.dataformat && props.dataformat.includes("XML") && (
            <Button className="green-button" onClick={handleXmlDown}>
              XML
            </Button>
          )}
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
