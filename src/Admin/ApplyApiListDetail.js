import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormatDate from "../Format/FormatDate";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

function ApplyApiListDetail(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiapplyid = props.selectedItem;

  const handleSearch = async () => {
    setSearchResults([]);
    setIsLoading(true);
    try {
      const response = await axios.get("/spring/admin/apiapplylist", {
        params: {
          apiapplyid: apiapplyid,
        },
      });
      setSearchResults(response.data.data.data[0]);
    } catch (error) {
      console.error("Error searching: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const result = await axios.post("/spring/admin/apiapply/confirm", {
        apiapplyid: apiapplyid,
        applydvcd: searchResults.applydvcd,
      });
      alert("API 승인 여부가 변경되었습니다.");
    } catch (error) {
      console.log(error);
    }
    props.onHide();
    setSearchResults([]);
  };

  const handleClose = () => {
    props.onHide();
    setSearchResults([]);
  };

  const handleApprovalStatusChange = (selectedValue) => {
    setSearchResults({ ...searchResults, applydvcd: selectedValue });
  };

  useEffect(() => {
    handleSearch();
  }, [apiapplyid]);

  return (
    <div>
      {isLoading ? (
        <Spinner animation="border" role="status" />
      ) : searchResults ? (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header style={{ background: "#FAEAC0" }} closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              API 신청 상세 관리
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row className="mb-3">
                <Col xs={12}>
                  <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                    신청 제목: {searchResults.applynm}
                  </p>
                </Col>
              </Row>
              <Col xs={12} className="text-end">
                <span style={{ fontSize: "16px" }}>
                  신청자: {searchResults.username}
                </span>
              </Col>
              <Col xs={12} className="text-end">
                <span style={{ fontSize: "16px" }}>
                  신청일:{" "}
                  {searchResults.applydate ? (
                    <FormatDate dateString={searchResults.applydate} />
                  ) : (
                    ""
                  )}
                </span>
              </Col>
              <Row className="mb-3" style={{ marginTop: "30px" }}>
                <Col xs={12}>
                  <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                    신청 내용:
                  </p>{" "}
                  <p style={{ fontSize: "16px" }}>{searchResults.applycntn}</p>
                  <hr style={{ marginTop: "20px", borderWidth: "2px" }}></hr>
                </Col>
              </Row>
              <Row className="mb-3" style={{ marginTop: "20px" }}>
                <Col xs={12}>
                  <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                    API 승인 여부
                  </p>
                  <Form.Control
                    className="form-input"
                    as="select"
                    value={searchResults.applydvcd}
                    onChange={(e) => handleApprovalStatusChange(e.target.value)}
                    style={{ appearance: "auto" }}
                  >
                    <option value="01">신청중</option>
                    <option value="02">반려</option>
                    <option value="03">승인</option>
                  </Form.Control>
                </Col>
              </Row>
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
            </Container>
          </Modal.Body>
        </Modal>
      ) : (
        <div>데이터가 없습니다.</div>
      )}
    </div>
  );
}

export default ApplyApiListDetail;
