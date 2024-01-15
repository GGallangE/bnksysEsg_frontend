import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";

function ComCodeDetail(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [comCode, setComCode] = useState({
    code: "",
    codelabel: "",
    codevalue: "",
  });

  useEffect(() => {
    const fetchComCodeDetails = async () => {
      if (props.selectedItem) {
        setIsLoading(true);
        try {
          const response = await axios.get("/spring/admin/api/comcode", {
            params: { id: props.selectedItem },
          });
          setComCode(response.data.data.data[0]);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setComCode({
          code: "",
          codelabel: "",
          codevalue: "",
        });
      }
    };

    fetchComCodeDetails();
  }, [props.selectedItem]);

  const handleInputChange = (e) => {
    setComCode({
      ...comCode,
      [e.target.id]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);

    const payload = {
      id: props.selectedItem || 0,
      code: comCode.code,
      codelabel: comCode.codelabel,
      codevalue: comCode.codevalue,
    };

    try {
      const response = await axios.post("/spring/admin/api/comcode", payload);
      if (response.data.success) {
        alert(response.data.messages.join("\n"));
      } else {
        alert("Error: " + response.data.messages.join("\n"));
      }
    } catch (error) {
      console.error("catch error:", error);
      alert("저장 실패: " + error.message);
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  const handleClose = () => {
    props.onHide();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{ background: "#FAEAC0" }} closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Com Code Detail
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <Spinner animation="border" role="status" />
        ) : (
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="code">
                <Form.Label>CODE</Form.Label>
                <Form.Control
                  className="form-input"
                  type="text"
                  placeholder="Code를 입력하세요"
                  value={comCode.code}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="codelabel">
                <Form.Label>CODE_LABEL</Form.Label>
                <Form.Control
                  className="form-input"
                  type="text"
                  placeholder="Code Label를 입력하세요"
                  value={comCode.codelabel}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="codevalue">
                <Form.Label>CODE_VALUE</Form.Label>
                <Form.Control
                  className="form-input"
                  type="text"
                  placeholder="Code Value를 입력하세요"
                  value={comCode.codevalue}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Row>
          </Form>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            margin: "30px auto 10px",
          }}
        >
          <Button
            style={{
              padding: "10px 30px",
              margin: "0 10px",
              background: "#FAEAC0",
              border: "none",
              color: "black",
            }}
            onClick={handleSave}
          >
            저장
          </Button>
          <Button
            style={{
              padding: "10px 30px",
              margin: "0 10px",
              background: "#FAEAC0",
              border: "none",
              color: "black",
            }}
            onClick={handleClose}
          >
            닫기
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ComCodeDetail;
