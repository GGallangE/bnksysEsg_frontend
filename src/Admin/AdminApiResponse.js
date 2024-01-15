import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Container, Button, Row, Col, Table } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { isLoggedInAtom } from "../atom";
import AdminApiResponseDetail from "./AdminApiResponseDetail";
import SearchIcon from '@mui/icons-material/Search';

function AdminApiResponse() {
  const [needResponseList, setNeedResponseList] = useState([]);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  axios.defaults.headers.common["Authorization"] = `Bearer ${isLoggedIn}`;

  const fetchNeedResponseList = async () => {
    try {
      const response = await axios.get("/spring/admin/api/need_response", {
        headers: { Authorization: `Bearer ${isLoggedIn}` },
      });
      console.log(response.data.data.data);
      setNeedResponseList(response.data.data.data);
    } catch (error) {
      console.error("Error :", error);
      if (error.response && error.response.status === 403) {
        alert("로그인을 해주세요.");
      }
    }
  };

  useEffect(() => {
    fetchNeedResponseList();
  }, []);

  const searchNeedResponse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/spring/admin/api/need_response", {
        params: { apinm: searchTerm },
        headers: { Authorization: `Bearer ${isLoggedIn}` },
      });
      setNeedResponseList(response.data.data.data);
      console.log(response.data.data.data);
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 403) {
        alert("로그인을 해주세요.");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        searchNeedResponse(e);
    }
  };

  const handleRegisterClick = () => {
    setSelectedItem(null);
    setModalShow(true);
  };

  const handleNeedResponseClick = (needResponse) => {
    setSelectedItem(needResponse.apirsqeitemsid);
    setModalShow(true);
  };

  return (
    <div className="App">
      <Container style={{ margin: "100px auto" }}>
        <h1 style={{ marginTop: "50px", marginBottom: "50px" }}>
          API Response 필수항목 관리
        </h1>

        <div className="use_sch_total_w-yellow">
            <div className="use_sch_total-yellow">
              <div className="use_input_wrap-yellow">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="use_sch_ip-yellow"
                />
                <a onClick={searchNeedResponse} className="use_btn_sch-yellow" id="submit">
                  <SearchIcon sx={{ fontSize: '30px', color: '#fff', margin: '5px 0px 0px 0px' }} />
                </a>
              </div>
            </div>
          </div>
          <Row className="justify-content-end">
            <Col md="auto">
              <Button onClick={handleRegisterClick} style={{ margin: '10px', background: '#fff', borderColor: '#FAEAC0', borderWidth: '2px', fontWeight: 'bold', color: '#000' }} variant="primary" type="submit">
                등록
              </Button>
            </Col>
          </Row>

        <div class="tb_w-yellow">
          <div class="st_tb_w-yellow">
            <ul class="st_tb_col-yellow">
              <li class="tr-yellow">
                <div class="th-num-yellow">
                  <span>NO</span>
                </div>
                <div class="th-tit-yellow">
                  <span>API 이름</span>
                </div>
                <div class="th-writer-yellow">
                  <span>한글명</span>
                </div>
                <div class="th-date-yellow">
                  <span>영문명</span>
                </div>
              </li>
              {needResponseList.map((needResponse, index) => (
                <li class="tr" key={index}>
                  <div class="td-num">{index + 1}</div>
                  <div
                    class="td-tit"
                    onClick={() => handleNeedResponseClick(needResponse)}
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    {needResponse.apinm}
                  </div>
                  <div class="td-writer">{needResponse.krnm}</div>
                  <div class="td-writer">{needResponse.ennm}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
      <AdminApiResponseDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem={selectedItem}
      />
    </div>
  );
}

export default AdminApiResponse;
