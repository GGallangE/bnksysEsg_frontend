import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Container, Button, Row, Col } from "react-bootstrap";
import { isLoggedInAtom } from "../atom";
import { useRecoilValue } from "recoil";
import Editor from "../Editor";
import mongiImage from "../images/character_Mongi.gif";

function UseCaseRgt() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const navigate = useNavigate();
  axios.defaults.headers.common["Authorization"] = `Bearer ${isLoggedIn}`;

  const usecaseRegister = async () => {
    try {
      const response = await axios.post("/spring/usecase/usecase", {
        title: title,
        content: content,
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
          <Form.Label className='form-label'>제목</Form.Label>
            <Form.Control
              className="form-input"
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="제목을 입력하세요"
              style={{ height: '50px', fontSize: '15px', borderColor: '#bcbcbc' }} 
            />
          </Form.Group>
          <Editor onQuillChange={handleQuillChange} />
          <Button
            style={{
              padding: "10px 30px",
              margin: "0 10px",
              background: "#FAEAC0",
              border: "none",
              color: "black",
            }}
            onClick={usecaseRegister}
            type="submit"
          >
            등록
          </Button>
          <Button
            onClick={usecaseRegister}
            style={{ margin: "50px 0px" }}
            variant="primary"
            type="submit"
          >
            등록
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default UseCaseRgt;
