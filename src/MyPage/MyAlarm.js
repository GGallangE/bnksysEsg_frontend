import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import FormatDate from "../Format/FormatDate";
import { isLoggedInAtom } from "../atom";
import { useRecoilValue } from "recoil";
import MyAlarmDetail from "../Modal/MyAlarmDetail";
import { Pagination, Box } from "@mui/material";

function MyAlarm() {
  const [searchMyAlarm, setSearchMyAlarm] = useState([]);
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
      const response = await axios.get("/spring/mypage/myalarm", {
        params: {
          page: currentPage - 1,
        },
      });
      setSearchMyAlarm(response.data.data.data);
      setTotalpage(response.data.data.data[0].total);
      console.log(response);
    } catch (error) {
      if (error.response.status == 403) {
        alert("로그인을 해주세요.");
      }
    }
  };

  const handleTitleClick = (item) => {
    setSelectedItem(item.alarmid);
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
          <h5 style={{ marginTop: "50px", marginBottom: "50px" }}>MY 알림</h5>
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
                  <div class="th-writer">
                    <span>작성자</span>
                  </div>
                  <div class="th-date">
                    <span>수신일시</span>
                  </div>
                </li>
                {searchMyAlarm.map((item, index) => (
                  <li class="tr" key={index}>
                    <div class="td-num">
                      {currentPage === 1
                        ? index + 1
                        : (currentPage - 1) * 10 + index + 1}
                    </div>
                    <div
                      class="td-tit"
                      onClick={() => handleTitleClick(item)}
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontWeight: item.readCheck ? "normal" : "bold",
                        color: item.readCheck ? "grey" : "black",
                      }}
                    >
                      {item.title}
                    </div>
                    <div class="td-writer">{item.sendusername}</div>
                    <div class="td-date">
                      <FormatDate dateString={item.regdt} />
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
      <MyAlarmDetail
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          handleSearch();
        }}
        selectedItem={selectedItem}
      />
    </div>
  );
}
export default MyAlarm;
