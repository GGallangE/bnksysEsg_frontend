import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormatDate from "../Format/FormatDate";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import useDidMountEffect from "../hooks/useDidMountEffect";

function AdminInquiryDetail(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchAnswer, setSearchAnswer] = useState([]);
  const [replyTitle, setReplyTitle] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inquiryid = props.selectedItem;

  const handleSearch = async () => {
    if (inquiryid != null) {
      try {
        const response = await axios.get("/spring/admin/inquiry/list", {
          params: {
            inquiryid: inquiryid,
          },
        });
        setSearchResults(response.data.data.data[0]);
        setReplyTitle("");
        setReplyContent("");
        setIsLoading(true);
        if (response.data.data.data[0].replycount == 1) {
          answerSeacrh();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error searching: ", error);
        setIsLoading(false);
      }
    }
  };

  const answerSeacrh = async () => {
    if (inquiryid != null) {
      try {
        const response = await axios.get("/spring/admin/inquiry/list/answer", {
          params: {
            inquiryid: inquiryid,
          },
        });
        setSearchAnswer(response.data.data.data[0]);
        setReplyTitle(response.data.data.data[0].inquirynm);
        setReplyContent(response.data.data.data[0].inquirycntn);
        console.log(response.data.data.data[0]);
      } catch (error) {
        console.error("Error searching: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!replyTitle || !replyContent) {
      alert("답변 제목과 내용은 필수 항목입니다.");
      return;
    }
    try {
      const result = await axios.post("/spring/admin/inquiry/answer", {
        inquirynm: replyTitle,
        inquirycntn: replyContent,
        parentid: inquiryid,
      });
      alert("답변 작성이 완료 되었습니다.");
    } catch (error) {}
    props.onHide();
    setReplyTitle("");
    setReplyContent("");
  };

  const handleClose = () => {
    props.onHide();
    setReplyTitle("");
    setReplyContent("");
  };

  useDidMountEffect(() => {
    setIsLoading(true); // 컴포넌트가 마운트될 때 로딩 상태를 true로 설정
    handleSearch();
  }, [inquiryid]);

  return (
    <div>
      {isLoading ? (
        // 스피너 표시
        <Spinner animation="border" role="status" />
      ) : searchResults ? ( // Modal을 렌더링하기 전에 searchResults가 참인지 확인
        //로딩완료시 컴포넌트 내용렌더링
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
          <Modal.Header style={{ background: "#FAEAC0" }} closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              문의 내용
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ overflowY: "auto", maxHeight: "80vh" }}>
            <Container>
              <Row className="mb-3">
                <Col xs={12}>
                  <p style={{fontSize:'18px', fontWeight:'bold'}}>제목: {searchResults.inquirynm}</p>
                </Col>
              </Row>
              <Row className="mb-3" style={{ marginTop: "30px" }}>
                <Col xs={12}>
                  <p style={{fontSize:'18px', fontWeight:'bold'}}>내용:</p> <p style={{fontSize:'16px'}}>{searchResults.inquirycntn}</p>
                </Col>
              </Row>
              <hr style={{ marginTop: "20px", borderWidth:'2px' }}></hr>
              <Row className="mb-3">
                <Col xs={12}>
                  <Form>
                    <Form.Group controlId="replyTitle">
                      <Form.Label>답변 제목</Form.Label>
                      <Form.Control
                        className="form-input"
                        type="text"
                        placeholder="답변 제목을 입력해 주세요"
                        value={replyTitle}
                        onChange={(e) => setReplyTitle(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group style={{marginTop:'30px'}} controlId="replyContent">
                      <Form.Label>답변 내용</Form.Label>
                      <Form.Control
                        className="form-input"
                        as="textarea"
                        rows={3}
                        placeholder="답변 내용을 입력해 주세요"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                    </Form.Group>
                  </Form>
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
        //검색결과가 없는 경우
        <div>데이터가 없습니다.</div>
      )}
    </div>
  );
}

export default AdminInquiryDetail;
