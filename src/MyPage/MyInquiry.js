import React, { useState, useEffect } from "react";
import { Table, Container, Spinner } from "react-bootstrap";
import axios from "axios";
import FormatDate from "../Format/FormatDate";
import { isLoggedInAtom } from "../atom";
import { useRecoilValue } from "recoil";
import LoginPopup from "../User/LoginPopup";
import { Pagination, Box } from "@mui/material";
import instance from "../apiAxios/axios";
import requests from "../apiAxios/requests";

function MyInquiry() {
  const [searchMyInquiry, setSearchMyInquiry] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [inquiryAnswer, setInquiryAnswer] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalpage, setTotalpage] = useState(1);
  const [showNoResponseMessage, setShowNoResponseMessage] = useState(false);
  const LAST_PAGE =
    totalpage % 10 === 0
      ? parseInt(totalpage / 10)
      : parseInt(totalpage / 10) + 1;
  const [currentPage, setCurrentPage] = useState(1);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  axios.defaults.headers.common["Authorization"] = `Bearer ${isLoggedIn}`;

  const handleSearch2 = async () => {
    //나의 문의사항 가져오기
    
    const response = await instance.get(requests.fetchMyInquiry);
    console.log('axios', response);
  };

  useEffect(()=>{
    handleSearch2();
  }, [])

  const handleSearch = async () => {
    try {
      const response = await axios.get("/spring/mypage/myinquiry", {
        params: {
          page: currentPage - 1,
        },
      });
      if (!response.data.data.data || response.data.data.data.length === 0) {
        setSearchMyInquiry([]);
        setTotalpage(0);
        setShowNoResponseMessage(true);
      } else {
        setSearchMyInquiry(response.data.data.data);
        setTotalpage(response.data.data.data[0].total);
        setShowNoResponseMessage(false);
        console.log(response.data.data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setShowLoginModal(true);
      } else {
        console.error("에러 발생:", error.message);
      }
    }
  };

  const handleInquiryAnswer = (item) => {
    if (item.replycount === 1) {
      setIsLoading(true);
      axios
        .get("/spring/mypage/myinquiry_answer", {
          params: {
            inquiryid: item.inquiryid,
          },
        })
        .then((response) => {
          setInquiryAnswer(response.data.data.data[0]);
        })
        .catch((error) => {
          setInquiryAnswer("등록된 답변이 없습니다.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setInquiryAnswer("등록된 답변이 없습니다.");
    }
  };

  const handleRowClick = (item) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setSelectedRow(item.inquiryid === selectedRow ? null : item.inquiryid);
    handleInquiryAnswer(item);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
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
            My 문의사항
          </h1>
          <div className="tb_w">
            <div className="st_tb_w ">
              <ul className="st_tb_col">
                <li className="tr">
                  <div className="th-num">
                    <span>NO</span>
                  </div>
                  <div className="th-tit">
                    <span>제목</span>
                  </div>
                  <div className="th-date">
                    <span>등록일</span>
                  </div>
                  <div className="th-writer">
                    <span>답변현황</span>
                  </div>
                </li>

                {!showNoResponseMessage &&
                  searchMyInquiry.map((item, index) => (
                    <React.Fragment key={index}>
                      <li
                        className="tr"
                        key={index}
                        onClick={() => handleRowClick(item)}
                      >
                        <div className="td-num">
                          {currentPage === 1
                            ? index + 1
                            : (currentPage - 1) * 10 + index + 1}
                        </div>
                        <div className="td-tit">{item.inquirynm}</div>
                        <div className="td-date">
                          <FormatDate dateString={item.regdt} />
                        </div>
                        <div className="td-writer">
                          {item.replycount === 0 ? "답변중" : "답변완료"}
                        </div>
                      </li>

                      {selectedRow === item.inquiryid && (
                        <tr>
                          {isLoading ? (
                            // 스피너 표시
                            <td colSpan="4" style={{ textAlign: "center" }}>
                              <Spinner animation="border" role="status" />
                            </td>
                          ) : (
                            <td colSpan="4" style={{ textAlign: "left" }}>
                              <div>
                                <strong>질문 내용:</strong>
                                <div style={{ marginTop: "20px" }}>
                                  {item.inquirycntn}
                                </div>
                              </div>
                              <hr
                                style={{
                                  borderTop: "1px solid #ccc",
                                  marginBottom: "10px",
                                }}
                              />
                              {inquiryAnswer && item.replycount === 1 && (
                                <>
                                  <div>
                                    <strong>답변 제목:</strong>{" "}
                                    {inquiryAnswer.inquirynm}
                                  </div>
                                  <div style={{ float: "right" }}>
                                    <strong>작성일:</strong>{" "}
                                    {inquiryAnswer.regdt && (
                                      <FormatDate
                                        dateString={inquiryAnswer.regdt}
                                      />
                                    )}
                                  </div>
                                  <br />
                                  <div>
                                    <strong>답변 내용:</strong>
                                    <div style={{ marginTop: "20px" }}>
                                      {inquiryAnswer.inquirycntn}
                                    </div>
                                  </div>
                                </>
                              )}
                              {inquiryAnswer && item.replycount === 0 && (
                                <div>아직 답변 중입니다.</div>
                              )}
                              {!inquiryAnswer && <p>Loading...</p>}
                            </td>
                          )}
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        {showNoResponseMessage && (
          <div
            style={{
              marginTop: "50px",
              color: "gray",
            }}
          >
            검색 결과가 없습니다.
          </div>
        )}
        {!showNoResponseMessage && (
          <Box margin="50px" display="flex" justifyContent="center" mt={3}>
            <Pagination
              page={currentPage}
              count={LAST_PAGE}
              defaultPage={1}
              onChange={handlePageChange}
            />
          </Box>
        )}
      </Container>
      {/* 로그인 모달 */}
      <LoginPopup
        show={showLoginModal}
        handleClose={handleLoginModalClose}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default MyInquiry;
