import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container }from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate';
import AdminInquiryDetail from './AdminInquiryDetail'
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';


function AdminInquiry(){
    const [searchInquiryList, setSearchInquiryList] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/admin/inquiry/list');
            setSearchInquiryList(response.data.data.data);
        }catch(error){
            if(error.response.status == 403){
                alert("로그인을 해주세요.");
              }
        }
    }

    const handleTitleClick = (item) => {
        setSelectedItem(item.inquiryid);
        setModalShow(true);
      };

    useEffect(() => {
        handleSearch();
    }, [])

    return(
    <div className="App">
      <Container style={{margin:'100px auto'}}>
        <div>

        <h1 style={{ marginTop: '50px', marginBottom: '50px' }}>문의사항 관리</h1>
      <div class="tb_w-yellow">
            <div class="st_tb_w-yellow">
              <ul class="st_tb_col-yellow">
                <li class="tr-yellow">
                  <div class="th-num-yellow">
                    <span>NO</span>
                  </div>
                  <div class="th-tit-yellow">
                    <span>문의제목</span>
                  </div>
                  <div class="th-writer-yellow">
                    <span>등록자</span>
                  </div>
                  <div class="th-date-yellow">
                    <span>등록일</span>
                  </div>
                  <div class="th-date-yellow">
                    <span>답변여부</span>
                  </div>
                </li>
                {searchInquiryList.map((item, index) => (
                  <li class="tr" key={index}>
                    <div class="td-num">{index + 1}</div>
                    <div
                    class="td-tit"
                    onClick={() => handleTitleClick(item)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                    {item.inquirynm}
                  </div>
                    <div class="td-writer">{item.username}</div>
                    <div class="td-date"><FormatDate dateString={item.regdt} /></div>
                    <div class="td-writer">{item.replycount === 0 ? '' : '답변 완료'}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
       {/* 화면 중앙에 스피너 표시 */}
       <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <AdminInquiryDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem = {selectedItem}
      />
    </div>
    </div>
    );
}
export default AdminInquiry;