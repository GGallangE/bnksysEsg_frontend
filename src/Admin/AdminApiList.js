import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate';
import AdminApiListDetail from './AdminApiListDetail'
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';


function AdminApiList(){
  const [searchApplyApiList, setSearchApplyApiList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;
  
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };  

  const handleSearchApiList = async () => {
    if (!searchTerm) {
        alert("검색어를 입력해주세요.");
        return;
    }
    try {
        const response = await axios.get(`/spring/admin/apilist_search?string=${searchTerm}`);
        setSearchApplyApiList(response.data.data.data);
    } catch (error) {
        console.error('Error during API search:', error);
        if(error.response && error.response.status === 403){
            alert("로그인을 해주세요.");
        }
    }
};

const handleSearchSubmit = (event) => {
  event.preventDefault(); 
  handleSearchApiList();
};


    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/admin/apilist');
            setSearchApplyApiList(response.data.data.data);
            console.log(response)
        }catch(error){
            if(error.response.status == 403){
                alert("로그인을 해주세요.");
              }
        }
    }

    const handleRegister = () => {
        setSelectedItem();
        setModalShow(true);
        console.log('등록 버튼 클릭!');
      };

    const handleTitleClick = (item) => {
        setSelectedItem(item.apilistid);
        setModalShow(true);
      };

    useEffect(() => {
        handleSearch();
    }, [])

    return(
    <div className="App">
      <Container style={{margin:'100px auto'}}>
        <div>
        <h5 style={{marginTop : '50px', marginBottom : '50px'}}>API 목록 관리</h5>
        <Form onSubmit={handleSearchSubmit}>
                        <Row className="justify-content-md-center">
                            <Col md={4}>
                                <Form.Control
                                    type="text"
                                    placeholder="검색"
                                    value={searchTerm}
                                    onChange={handleSearchInputChange}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button variant="primary" type="submit" style={{ marginBottom: '20px' }}>
                                    검색
                                </Button>
                            </Col>
                        </Row>
                    </Form>
        <Row className="justify-content-end">
            <Col xs="auto">
                <Button variant="primary" onClick={handleRegister} style={{ marginBottom: '20px', marginRight : '30px' }}>
                     등록
                </Button>
            </Col>
        </Row>
        <div class="tb_w">
            <div class="st_tb_w ">
              <ul class="st_tb_col">
                <li class="tr">
                  <div class="th-num">
                    <span>NO</span>
                  </div>
                  <div class="th-tit">
                    <span>API 이름</span>
                  </div>
                  <div class="th-writer">
                    <span>제공기관</span>
                  </div>
                  <div class="th-date">
                    <span>제공사이트</span>
                  </div>
                  <div class="th-date">
                    <span>등록일</span>
                  </div>
                  <div class="th-date">
                    <span>API 신청 이름</span>
                  </div>
                  <div class="th-date">
                    <span>개발상태</span>
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
                    {item.apinm}
                  </div>
                    <div class="td-date">{item.prvorg}</div>
                    <div class="td-date">{item.sitenm}</div>
                    <div class="td-date"><FormatDate dateString={item.apirgdt} /></div>
                    <div class="td-date">{item.apiapplynm}</div>
                    <div class="td-date">{item.usedvcd === '01' ? '사용가능' : item.usedvcd === '02' ? '읽기가능' : '개발중'}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
      <AdminApiListDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem = {selectedItem}
      />
    </div>
    );
}
export default AdminApiList;