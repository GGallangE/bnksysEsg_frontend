import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RecoilRoot, useRecoilValue, useRecoilState } from "recoil";
import TokenManagement from "../TokenManagement";
import { tokenState } from "../TokenState";
import "../css/ApiList.css";
import { isLoggedInAtom } from "../atom";
import { Button, Container } from "react-bootstrap";
import { Pagination, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MoveApiRegister from "../Modal/MoveApiRegister";
import ApiDetailInfo from "../Modal/ApiDetailInfo";

function MyRecentUseData() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState("view");
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [totalpage, setTotalpage] = useState(1);
  const LAST_PAGE =
    totalpage % 30 === 0 ? parseInt(totalpage / 30) : parseInt(totalpage / 30);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalShow, setModalShow] = useState(false);
  const [detailInfoModalShow, setDetailInfoModalShow] = useState(false);
  const [modalapilistid, setModalapilistid] = useState("");
  const [modalapinm, setModalapinm] = useState("");
  const [modalapiexpl, setModalapiexpl] = useState("");
  axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

  const handleSearch = async () => {
    try {
      const response = await axios.get('/spring/mypage/myrecentuseapi');
      setSearchResults(response.data.data.data);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  }

  useEffect(() => {
    handleSearch();
  }, []);

  const handlePageChange = (event, page) => {
    console.log(page);
    setCurrentPage(page);
  };

  const handleFavoriteToggle = async (apilistid, favorite) => {
    try {
      // 서버로 관심 데이터 토글 요청
      const response = await axios.post('/spring/userapi/interestapi',
        {
          apilistid,
          stcd: favorite ? '99' : '01'
        }
      );
      console.log(response)
      // API 목록을 다시 불러오기
      handleSearch();
    } catch (error) {
      if (error.response.status == 403) {
        alert("로그인을 해주세요.");
      }
    }
  };
  console.log(searchResults);

  const showApiRegisterModal = (apilistid, apinm, apiexpl) => {
    setModalShow(true);
    setModalapilistid(apilistid);
    setModalapinm(apinm);
    setModalapiexpl(apiexpl);
  };

  const handleMoveApiDetail = (apilistid, apinm, apiexpl, usedvcd) => {
    if (usedvcd === "01") {
      navigate(`/api/detailapi/${apilistid}`);
    } else {
      showApiRegisterModal(apilistid, apinm, apiexpl);
    }
  };

  return (
    <Container style={{ marginTop: '100px' }}>
      <div>
        <h5 style={{ marginTop: '50px', marginBottom: '50px', textAlign:'center' }}>최근 사용 API</h5>
        {Array.isArray(searchResults) && searchResults.length === 0 ? (
            <p>검색 결과 없음</p>
          ) : (
            <ul>
              {searchResults.map((result) => (
                <li
                  className="item"
                  key={result.apilistid}
                  style={{ marginTop: "20px" }}
                >
                  {result.usedvcd === "01" ? (
                    <Link
                      to={`/api/detailapi/${result.apilistid}`}
                      className="Link"
                    >
                      <div className="item-container">
                        <div className="item-header">
                          <div className="item-name">{result.apinm}</div>
                          <Button
                            style={{
                              border: "none",
                              background: "transparent",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              handleFavoriteToggle(
                                result.apilistid,
                                result.favorite
                              );
                            }}
                            className="favorite-button"
                          >
                            {result.favorite ? (
                              <BookmarkIcon
                                style={{ color: "#a2d7d4", fontSize: "35px" }}
                              />
                            ) : (
                              <BookmarkBorderIcon
                                style={{ color: "#a2d7d4", fontSize: "35px" }}
                              />
                            )}
                          </Button>
                        </div>

                        <div className="api-explanation">
                          {result.apiexpl.length > 100
                            ? result.apiexpl.substring(0, 100) + "..."
                            : result.apiexpl}
                        </div>
                        <div className="item-info-container">
                          <span style={{ width: "230px", fontSize: "15px" }}>
                            제공기관: {result.prvorg}
                          </span>
                          <span style={{ width: "230px", fontSize: "15px" }}>
                            조회수: {result.apiview}
                          </span>
                          <span style={{ width: "230px", fontSize: "15px" }}>
                            사용수: {result.countapiuses}
                          </span>
                          <span style={{ display: "none" }}>
                            {result.apilistid}
                          </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              margin: "10px 10px 0px -5px"
                            }}
                          >
                            {/* 키워드 나열 */}
                            {result.apikeyword !== null && (
                              <ul className="cate_list">
                                {result.apikeyword
                                  .split(",")
                                  .map((keyword, index) => (
                                    <li key={index}>
                                      <span
                                        style={{
                                          border: "solid 3px #A2D7D4",
                                          borderRadius: "30px",
                                          padding: "8px",
                                          margin: "5px",
                                          fontSize: "15px",
                                        }}
                                      >
                                        {keyword.trim()}
                                      </span>
                                    </li>
                                  ))}
                              </ul>
                            )}
                            <Button
                              className={`use-button ${
                                result.usedvcd === "02" ? "apply-button" : ""
                              }`}
                              style={{
                                background:
                                  result.usedvcd === "02" ? "white" : "#a2d7d4",
                                border: "solid 3px #a2d7d4",
                                marginLeft: "auto",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                handleMoveApiDetail(
                                  result.apilistid,
                                  result.apinm,
                                  result.apiexpl,
                                  result.usedvcd
                                );
                              }}
                            >
                              {result.usedvcd === "01"
                                ? "사용하러가기"
                                : "사용신청하기"}
                            </Button>
                          
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="item-container">
                      <div className="item-header">
                        <div className="item-name">{result.apinm}</div>
                        <Button
                          style={{ border: "none", background: "transparent" }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleFavoriteToggle(
                              result.apilistid,
                              result.favorite
                            );
                          }}
                          className="favorite-button"
                        >
                          {result.favorite ? (
                            <BookmarkIcon
                              style={{ color: "#a2d7d4", fontSize: "35px" }}
                            />
                          ) : (
                            <BookmarkBorderIcon
                              style={{ color: "#a2d7d4", fontSize: "35px" }}
                            />
                          )}
                        </Button>
                      </div>

                      <div className="api-explanation">
                        {result.apiexpl.length > 100
                          ? result.apiexpl.substring(0, 100) + "..."
                          : result.apiexpl}
                      </div>
                      <div className="item-info-container">
                        <span style={{ width: "230px", fontSize: "15px" }}>
                          제공기관: {result.prvorg}
                        </span>
                        <span style={{ width: "230px", fontSize: "15px" }}>
                          조회수: {result.apiview}
                        </span>
                        <span style={{ width: "230px", fontSize: "15px" }}>
                          사용수: {result.countapiuses}
                        </span>
                        <span style={{ display: "none" }}>
                          {result.apilistid}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          margin: "10px 10px 0px -5px"
                        }}
                      >
                        {/* 키워드 나열 */}
                        {result.apikeyword !== null && (
                          <ul className="cate_list">
                            {result.apikeyword
                              .split(",")
                              .map((keyword, index) => (
                                <li key={index}>
                                  <span
                                    style={{
                                      border: "solid 3px #A2D7D4",
                                      borderRadius: "30px",
                                      padding: "8px",
                                      margin: "5px",
                                      fontSize: "15px",
                                    }}
                                  >
                                    {keyword.trim()}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        )}
                        <Button
                          className={`use-button ${
                            result.usedvcd === "02" ? "apply-button" : ""
                          }`}
                          style={{
                            background:
                              result.usedvcd === "02" ? "white" : "#a2d7d4",
                            border: "solid 3px #a2d7d4",
                            marginLeft: "auto",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleMoveApiDetail(
                              result.apilistid,
                              result.apinm,
                              result.apiexpl,
                              result.usedvcd
                            );
                          }}
                        >
                          {result.usedvcd === "01"
                            ? "사용하러가기"
                            : "사용신청하기"}
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  page={currentPage}
                  count={LAST_PAGE}
                  defaultPage={1}
                  onChange={handlePageChange}
                />
              </Box>
            </ul>
          )}
      </div>
    </Container>
  );
}
export default MyRecentUseData;