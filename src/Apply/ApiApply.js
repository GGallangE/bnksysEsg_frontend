import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Container } from "react-bootstrap";
import { isLoggedInAtom } from "../atom";
import { useRecoilValue } from "recoil";
import ModalRgt from "../ModalRgt";
import AsyncSelect from 'react-select/async';

function ApiApply() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  axios.defaults.headers.common["Authorization"] = `Bearer ${isLoggedIn}`;
  const [selectedApiName, setSelectedApiName] = useState({label:location.state?.apinm || null, value:location.state?.apilistid || null})
  const apinm = location.state?.apinm || null;
    

  const loadApiNames = async (inputValue) => {
    try {
      const response = await axios.get("/spring/main/search/apiapply", {
        params: {
          name: inputValue,
        },
      });
      return response.data.data.map(api => ({
        label: api.apinm, 
        value: api.apilistid  
    }));
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  const handleApiNameChange = (selectedOption) => {
    setSelectedApiName(selectedOption);
};

  useEffect(() => {
    console.log(selectedApiName);
  }, [selectedApiName]);

  const usecaseRegister = async () => {
    try {
      const response = await axios.post("/spring/request/apiapply", {
        apilistid: selectedApiName.value,
        applynm: title,
        applycntn: content,
      });

      // 응답 확인
      console.log("응답 데이터:", response.data);
      setModalShow(true);
    } catch (error) {
      if (error.response.status == 403) {
        alert("로그인을 해주세요.");
      }
    }
  };

  const usecaseCancel = () => {
    navigate("/");
  };

  return (
    <div>
      <Container>
        <h1>API 신청하기</h1>
        <Form>
          <Form.Group>
            <Form.Label>API 이름</Form.Label>
            <AsyncSelect
              cacheOptions
              loadOptions={loadApiNames}
              defaultOptions
              value={selectedApiName}
              onChange={handleApiNameChange}
              placeholder="API 이름 검색"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="form-label">제목</Form.Label>
            <Form.Control
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="제목을 입력하세요"
              style={{
                height: "38px",
                fontSize: "15px",
                borderColor: "#bcbcbc",
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="form-label">신청이유</Form.Label>
            <Form.Control
              onChange={(e) => setContent(e.target.value)}
              value={content}
              as="textarea"
              rows={3}
              style={{
                height: "350px",
                fontSize: "15px",
                borderColor: "#bcbcbc",
              }}
            />
          </Form.Group>
        </Form>
        <div className="btm_area">
          <input
            type="submit"
            value="등록"
            className="btn_rgt"
            onClick={usecaseRegister}
          />
          <input
            type="reset"
            value="취소"
            className="btn_cancel"
            onClick={usecaseCancel}
          />
        </div>
      </Container>
      <ModalRgt
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setTitle(""); // 제목 입력 상태 초기화
          setContent(""); // 신청이유 입력 상태 초기화
        }}
        message="Api신청이 완료되었습니다."
      />
    </div>
  );
}

export default ApiApply;
