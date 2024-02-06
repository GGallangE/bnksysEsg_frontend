import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { RecoilRoot, useRecoilValue, useRecoilState } from "recoil";
import TokenManagement from "../TokenManagement";
import { tokenState } from "../TokenState";
import { isLoggedInAtom } from "../atom";
import Container from "react-bootstrap/Container";
import { Button, Table, Modal, Col, Row } from "react-bootstrap";
import MyScheduleModal from "../Modal/MyScheduleModal";
import FormatCode from "../Format/FormatCode";
import { Pagination, Box } from "@mui/material";

function MyApiSchedule() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [batchlistId, setBatchlistId] = useState(null);
  const [apilistid, setApilistid] = useState(null);
  const [apiFormat, setApiFormat] = useState(null);
  const [dataFormat, setDataFormat] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [time, setTime] = useState(null);
  const [dayofmonth, setDayofmonth] = useState(null);
  const [dayofweek, setDayofweek] = useState(null);
  const [email, setEmail] = useState(null);
  const [showDeleteCheck, setShowDeleteCheck] = useState(false);
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
      const response = await axios.get("/spring/mypage/myapischedule", {
        params: {
          page: currentPage - 1,
        },
      });
      setSearchResults(response.data.data.data);
      setTotalpage(response.data.data.data[0].total);
      console.log("myschedule", response.data.data.data);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  const handleTitleClick = (item) => {
    setBatchlistId(item.batchlistid);
    setApilistid(item.apilistid);
    setApiFormat(item.apiformat);
    setDataFormat(item.dataformat);
    setFrequency(item.frequency);
    setTime(item.time);
    setDayofmonth(item.dayofmonth);
    setDayofweek(item.dayofweek);
    setEmail(item.email);
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

  const handleCheckboxChange = async (event, item) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedItems((prevItems) => [...prevItems, item]);
    } else {
      setSelectedItems((prevItems) =>
        prevItems.filter((selectedItem) => selectedItem !== item)
      );
    }
  };

  const handleDeleteCheck = () => {
    setShowDeleteCheck(true);
  };

  const handleDelete = async () => {
    try {
      // selectedItems 배열에 있는 모든 batchlistid에 대해 삭제 요청을 보냄
      await Promise.all(
        selectedItems.map(async (selectedItem) => {
          const response = await axios.post(
            "/spring/mypage/myapischedule/delete",
            {
              batchlistid: selectedItem.batchlistid,
            }
          );
        })
      );
      // 삭제 후 초기화
      setSelectedItems([]);
      window.location.reload();
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  return (
    <div className="App">
      <Container style={{ margin: "100px auto" }}>
        <h1>API예약현황</h1>
        <div style={{ margin: "30px 0px" }}>
          <Row className="justify-content-end">
            <Col md="auto">
              <Button
                style={{
                  margin: "20px 0px",
                  background: "#bbd4ef",
                  border: "none",
                }}
                onClick={() => handleDeleteCheck()}
              >
                삭제
              </Button>
            </Col>
          </Row>
          <div class="tb_w">
            <div class="st_tb_w ">
              <ul class="st_tb_col">
                <li class="tr">
                  <div class="th-num">
                    <span>선택</span>
                  </div>
                  <div class="th-num">
                    <span>No</span>
                  </div>
                  <div class="th-tit">
                    <span>API이름</span>
                  </div>
                  <div class="th-date">
                    <span>주기</span>
                  </div>
                </li>
                {searchResults.map((item, index) => (
                  <li class="tr" key={index}>
                    <div class="td-num">
                      <input
                        type="checkbox"
                        onChange={(event) => handleCheckboxChange(event, item)}
                        checked={selectedItems.includes(item)}
                      />
                    </div>
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
                      {item.apinm}
                    </div>
                    <div class="td-date">
                      <FormatCode code="frequency" value={item.frequency} />{" "}
                      <FormatCode code="day" value={item.dayofweek} />{" "}
                      {item.dayofmonth && <>{item.dayofmonth}일</>} {item.time}
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
      <MyScheduleModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          window.location.reload();
          setSelectedItems([]);
        }}
        batchlistId={batchlistId}
        apilistid={apilistid}
        apiFormat={apiFormat}
        dataFormat={dataFormat}
        frequency={frequency}
        time={time}
        dayofmonth={dayofmonth}
        dayofweek={dayofweek}
        email={email}
      />
      {/* 삭제 확인 팝업 */}
      <Modal show={showDeleteCheck} onHide={() => setShowDeleteCheck(false)}>
        <Modal.Header closeButton>
          <Modal.Title>삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteCheck(false)}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowDeleteCheck(false);
              handleDelete();
            }}
          >
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default MyApiSchedule;
