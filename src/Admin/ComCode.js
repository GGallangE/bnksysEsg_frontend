import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Container, Button, Row, Col, Table } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { isLoggedInAtom } from '../atom';
import ComCodeDetail from './ComCodeDetail';
import SearchIcon from '@mui/icons-material/Search';

function ComCode() {
  const [comCodeList, setComCodeList] = useState([]);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

  const fetchComCodeList = async () => {
    try {
        const response = await axios.get('/spring/admin/api/comcode', {
            params: {
                page: 0, 
                pageSize: 10 
            },
            headers: {
                'Authorization': `Bearer ${isLoggedIn}`
            }
        });
        console.log(response.data.data.data);
        setComCodeList(response.data.data.data); 
    } catch (error) {
        console.error('Error fetching Com Codes:', error);
        if (error.response && error.response.status === 403) {
            alert("로그인을 해주세요.");
        }
    }
};

  useEffect(() => {
    fetchComCodeList();
  }, []);

  const searchComCode = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.get('/spring/admin/api/admin_comcode_search', {
            params: {
                code: searchTerm, 
                // page: 0,
            },
            headers: {
                'Authorization': `Bearer ${isLoggedIn}`
            }
        });
        console.log(response.data.data.data);
        setComCodeList(response.data.data.data); 
    } catch (error) {
        console.error('Error:', error);
        if (error.response && error.response.status === 403) {
            alert("로그인을 해주세요.");
        }
    }
};

const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    searchComCode(e);
  }
};

  const handleRegisterClick = () => {
    setSelectedItem(null); 
    setModalShow(true);
  };

  const handleComCodeClick = (comCode) => {
    setSelectedItem(comCode.id);
    setModalShow(true);
  };


  return (
    <div className="App">
      <Container style={{ margin: '100px auto' }}>
      <h1 style={{ marginTop: '50px', marginBottom: '50px' }}>공통 코드 관리</h1>

      <div className="use_sch_total_w-yellow">
            <div className="use_sch_total-yellow">
              <div className="use_input_wrap-yellow">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="use_sch_ip-yellow"
                />
                <a onClick={(e) => searchComCode(e)} className="use_btn_sch-yellow" id="submit">
                  <SearchIcon sx={{ fontSize: '30px', color: '#fff', margin: '5px 0px 0px 0px' }} />
                </a>
              </div>
            </div>
          </div>
          <Row className="justify-content-end">
            <Col md="auto">
              <Button onClick={handleRegisterClick} style={{ margin: '10px', background: '#fff', borderColor: '#FAEAC0', borderWidth: '2px', fontWeight: 'bold', color: '#000' }} variant="primary" type="submit">
                등록
              </Button>
            </Col>
          </Row>

      <div class="tb_w-yellow">
            <div class="st_tb_w-yellow">
              <ul class="st_tb_col-yellow">
                <li class="tr-yellow">
                  <div class="th-num-yellow">
                    <span>NO</span>
                  </div>
                  <div class="th-tit-yellow">
                    <span>CODE</span>
                  </div>
                  <div class="th-writer-yellow">
                    <span>CODE_LABEL</span>
                  </div>
                  <div class="th-date-yellow">
                    <span>CODE_VALUE</span>
                  </div>
                </li>
                {comCodeList.map((comCode, index) => (
                  <li class="tr" key={index}>
                    <div class="td-num">{index + 1}</div>
                    <div
                    class="td-writer"
                    onClick={() => handleComCodeClick(comCode)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                    {comCode.code}
                  </div>
                    <div class="td-writer">{comCode.codelabel}</div>
                    <div class="td-writer">{comCode.codevalue}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
      </Container>
      <ComCodeDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem={selectedItem}
      />
    </div>
  );
}

export default ComCode;