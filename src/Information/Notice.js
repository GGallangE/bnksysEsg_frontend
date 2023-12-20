import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container }from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import NoticeDetail from './NoticeDetail'

function Notice(){
    const [searchNotice, setSearchNotice] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/main/notice');
            setSearchNotice(response.data.data.data);
        }catch(error){
            console.error("Error searching : ", error)
        }
    }

    const handleTitleClick = (item) => {
        setSelectedItem(item.noticeid);
        setModalShow(true);
      };

    useEffect(() => {
        handleSearch();
    }, []);

    return (
    <div className="App">
      <Container style={{margin:'120px auto'}}>
      <h1>공지사항</h1>
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
                    <span>등록자</span>
                  </div>
                  <div class="th-date">
                    <span>등록일</span>
                  </div>
                </li>
                {searchNotice.map((item, index) => (
                  <li class="tr" key={index}>
                    <div class="td-num">{index + 1}</div>
                    <div
                    class="td-tit"
                    onClick={() => handleTitleClick(item)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                    {item.noticenm}
                  </div>
                    <div class="td-writer">관리자</div>
                    <div class="td-date"><FormatDate dateString={item.regdt} /></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
      </Container>
      <NoticeDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem = {selectedItem}
      />
    
    </div>
        
    )
};

export default Notice;