import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import FormatDate from "../Format/FormatDate";
import NoticeDetailModal from "../Modal/NoticeDetailModal";
import "../css/Notice.css";
import { Pagination, Box } from "@mui/material";

function Notice() {
  const [searchNotice, setSearchNotice] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalpage, setTotalpage] = useState(1);
  const LAST_PAGE =
    totalpage % 10 === 0
      ? parseInt(totalpage / 10)
      : parseInt(totalpage / 10) + 1;
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async () => {
    try {
      const response = await axios.get("/spring/main/notice", {
        params: {
          mainsort: "no",
          page: currentPage - 1,
        },
      });
      setSearchNotice(response.data.data.data);
      setTotalpage(response.data.data.data[0].total);
      console.log(response);
    } catch (error) {
      console.error("Error searching : ", error);
    }
  };

  const handleTitleClick = (item) => {
    setSelectedItem(item.noticeid);
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
        <h1 style={{ marginBottom: "50px" }}>공지사항</h1>
        <div class="tb_w-green">
          <div class="st_tb_w-green">
            <ul class="st_tb_col-green">
              <li class="tr-green">
                <div class="th-num-green">
                  <span>NO</span>
                </div>
                <div class="th-tit-green">
                  <span>제목</span>
                </div>
                <div class="th-writer-green">
                  <span>등록자</span>
                </div>
                <div class="th-date-green">
                  <span>등록일</span>
                </div>
              </li>
              {searchNotice.map((item, index) => (
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
                    {item.noticenm}
                  </div>
                  <div class="td-writer">관리자</div>
                  <div class="td-date">
                    <FormatDate dateString={item.regdt} />
                  </div>
                </li>
              ))}
            </ul>
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
      <NoticeDetailModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem={selectedItem}
      />
    </div>
  );
}

export default Notice;
