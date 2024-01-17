import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Container, Button, Row, Col } from "react-bootstrap";
import { isLoggedInAtom } from "../atom";
import { useRecoilValue } from "recoil";
import Editor from "../Editor";
import mongiImage from "../images/character_Mongi.gif";
import AsyncSelect from "react-select/async";
import "../css/UseCaseRgt.css";

function UseCaseRgt() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedApiName, setSelectedApiName] = useState(null);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const navigate = useNavigate();
  axios.defaults.headers.common["Authorization"] = `Bearer ${isLoggedIn}`;

  const handleApiNameChange = (selectedOption) => {
    setSelectedApiName(selectedOption);
  };

  const loadApiNames = async (inputValue) => {
    try {
      const response = await axios.get("/spring/main/search/apiapply", {
        params: {
          name: inputValue,
        },
      });

      // usedvcd === '01'인것만 나타내기
      const filteredData = response.data.data.filter(
        (api) => api.usedvcd === "01"
      );

      // 콤보박스 형식에 맞게 map
      const mappedData = filteredData.map((api) => ({
        label: api.apinm,
        value: api.apilistid,
      }));

      return mappedData;
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  const usecaseRegister = async () => {
    const apilistid = selectedApiName.map((api) => api.value);
    try {
      const response = await axios.post("/spring/usecase/usecase", {
        title: title,
        content: content,
        apilistid: apilistid,
      });
      alert("등록되었습니다.");
      navigate("/openapi/usecase");
    } catch (error) {
      if (error.response.status == 403) {
        alert("로그인을 해주세요.");
      }
      console.log(error);
    }
  };

  const handleQuillChange = (value) => {
    setContent(value);
    console.log(value);
  };

  return (
    <div>
      <Container>
        <h1>
          활용사례 등록하기{" "}
          <img
            src={mongiImage}
            alt="캐릭터 몽이"
            style={{ width: "80px" }}
          ></img>
        </h1>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="form-label">제목</Form.Label>
            <Form.Control
              className="form-input"
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="제목을 입력하세요"
              style={{
                height: "50px",
                fontSize: "15px",
                borderColor: "#bcbcbc",
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>활용 API 선택</Form.Label>
            <AsyncSelect
              isMulti
              cacheOptions
              loadOptions={loadApiNames}
              defaultOptions
              value={selectedApiName}
              onChange={handleApiNameChange}
              placeholder="API 이름 검색"
              className="async-select"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>활용 사례 설명</Form.Label>
            <Editor onQuillChange={handleQuillChange} />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                style={{
                  padding: "10px 30px",
                  margin: "50px 0px",
                  background: "#FAEAC0",
                  border: "none",
                  color: "black",
                }}
                onClick={usecaseRegister}
                type="submit"
              >
                등록
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
}

export default UseCaseRgt;
