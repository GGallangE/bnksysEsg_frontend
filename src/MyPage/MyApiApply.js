import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import FormatDate from "../Format/FormatDate";
import FormatCode from "../Format/FormatCode";
import MyApiApplyDetail from "./MyApiApplyDetail";
import { isLoggedInAtom } from "../atom";
import { useRecoilValue } from "recoil";
import "../css/MyApiApply.css";
import { Pagination, Box } from "@mui/material";

function MyApiApply() {
  const [searchMyApiApply, setSearchMyApiApply] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalpage, setTotalpage] = useState(1);
  const LAST_PAGE =
    totalpage % 10 === 0
      ? parseInt(totalpage / 10)
      : parseInt(totalpage / 10) + 1;
  const [currentPage, setCurrentPage] = useState(1);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  axios.defaults.headers.common["Authorization"] = `Bearer ${isLoggedIn}`;

  const handleSearch = async () => {
    try {
      const response = await axios.get("/spring/mypage/myapiapply", {
        params: {
          page: currentPage - 1,
        },
      });
      setSearchMyApiApply(response.data.data.data);
      setTotalpage(response.data.data.data[0].total);
      console.log(response);
    } catch (error) {
      if (error.response.status == 403) {
        alert("로그인을 해주세요.");
      }
    }
  };

  const handleTitleClick = (item) => {
    setSelectedItem(item.apiapplyid);
    setModalShow(true);
  };

  const handlePageChange = (event, page) => {
    console.log(page);
    setCurrentPage(page);
  };

  useEffect(() => {
    handleSearch();
  }, [currentPage]);

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="App">
      <Container style={{ margin: "100px auto" }}>
        <div>
          <h1 style={{ marginTop: "50px", marginBottom: "50px" }}>
            API신청현황
          </h1>
          <div class="tb_w">
            <div class="st_tb_w ">
              <ul class="st_tb_col">
                <li class="tr">
                  <div class="th-num">
                    <span>NO</span>
                  </div>
                  <div class="th-tit">
                    <span>제목</span>
                  </div>
                  <div class="th-date">
                    <span>등록일</span>
                  </div>
                  <div class="th-date">
                    <span>답변일</span>
                  </div>
                  <div class="th-tit">
                    <span>처리현황</span>
                  </div>
                </li>
                {searchMyApiApply.map((item, index) => (
                  <li class="tr" key={index}>
                    <div class="td-num">
                      {currentPage === 1
                        ? index + 1
                        : (currentPage - 1) * 10 + index + 1}
                    </div>
                    <div
                      class="td-tit"
                      onClick={() => handleTitleClick(item)}
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      {item.applynm}
                    </div>
                    <div class="td-date">
                      <FormatDate dateString={item.applydate} />
                    </div>
                    <div class="td-date">
                      {item.rplydate && (
                        <FormatDate dateString={item.rplydate} />
                      )}
                    </div>
                    <div class="td-date">
                      <FormatCode code="apply" value={item.applydvcd} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <Box margin="50px" display="flex" justifyContent="center" mt={3}>
          <Pagination
            page={currentPage}
            count={LAST_PAGE}
            defaultPage={1}
            onChange={handlePageChange}
          />
        </Box>
      </Container>
      {/* 화면 중앙에 스피너 표시 */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <MyApiApplyDetail
          show={modalShow}
          onHide={() => setModalShow(false)}
          selectedItem={selectedItem}
        />
      </div>
    </div>
  );
}
export default MyApiApply;
