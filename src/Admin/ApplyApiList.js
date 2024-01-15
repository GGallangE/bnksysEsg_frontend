import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container }from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate';
import ApplyApiListDetail from './ApplyApiListDetail'
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';


function ApplyApiList(){
    const [searchApplyApiList, setSearchApplyApiList] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/admin/apiapplylist');
            setSearchApplyApiList(response.data.data.data);
        }catch(error){
            if(error.response.status == 403){
                alert("로그인을 해주세요.");
              }
        }
    }

    const handleTitleClick = (item) => {
        setSelectedItem(item.apiapplyid);
        setModalShow(true);
      };

    useEffect(() => {
        handleSearch();
    }, [])

    return(
    <div className="App">
      <Container style={{margin:'100px auto'}}>
        <div>

        <h1 style={{ marginTop: '50px', marginBottom: '50px' }}>API 신청관리</h1>
      <div class="tb_w-yellow">
            <div class="st_tb_w-yellow">
              <ul class="st_tb_col-yellow">
                <li class="tr-yellow">
                  <div class="th-num-yellow">
                    <span>NO</span>
                  </div>
                  <div class="th-tit-yellow">
                    <span>API 신청 이름</span>
                  </div>
                  <div class="th-writer-yellow">
                    <span>신청자</span>
                  </div>
                  <div class="th-date-yellow">
                    <span>신청일</span>
                  </div>
                  <div class="th-date-yellow">
                    <span>답변일</span>
                  </div>
                  <div class="th-date-yellow">
                    <span>상태</span>
                  </div>
                </li>
                {searchApplyApiList.map((item, index) => (
                  <li class="tr" key={index}>
                    <div class="td-num">{index + 1}</div>
                    <div
                    class="td-tit"
                    onClick={() => handleTitleClick(item)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                    {item.applynm}
                  </div>
                    <div class="td-writer">{item.username}</div>
                    <div class="td-date">{item.applydate ? <FormatDate dateString={item.applydate} /> : ''}</div>
                    <div class="td-date">{item.rplydate ? <FormatDate dateString={item.rplydate} /> : ''}</div>
                    <div class="td-writer">{item.applydvcd === '01' ? '신청중' : (item.applydvcd === '02' ? '반려' : '승인완료')}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        
        </div>
      </Container>
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
      <ApplyApiListDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem = {selectedItem}
      />
    </div>
    );
}
export default ApplyApiList;