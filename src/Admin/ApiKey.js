import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Container, Button, Row, Col, Table } from 'react-bootstrap';
import FormatDate from '../Format/FormatDate';
import { useRecoilValue } from 'recoil';
import { isLoggedInAtom } from '../atom';
import ApiKeyDetail from './ApiKeyDetail';
import SearchIcon from '@mui/icons-material/Search';

function Apikey() {
  const [apiKeyList, setApiKeyList] = useState([]);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

  const fetchApiKeyList = async () => {
    try {
      const response = await axios.get('/spring/admin/api/key');
      console.log(response.data.data.data);
      setApiKeyList(response.data.data.data); 
    } catch (error) {
      console.error('Error fetching API keys:', error);
      if (error.response && error.response.status === 403) {
        alert("로그인을 해주세요.");
      }
    }
  };

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  useEffect(() => {
    fetchApiKeyList();
  }, []);

  const searchApiKeys = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/spring/admin/api/key_search?name=${searchTerm}`);
      console.log(response.data.data.data)
      setApiKeyList(response.data.data.data); 
    } catch (error) {
      console.error('Error searching for API keys:', error);
      if (error.response && error.response.status === 403) {
        alert("로그인을 해주세요.");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchApiKeys(e);
    }
  };

  const handleRegisterClick = () => {
    setSelectedItem(null); 
    setModalShow(true);
  };

  const handleApiSiteClick = (apiKey) => {
    setSelectedItem(apiKey.apikeyid);
    setModalShow(true);
  };


  return (
    <div className="App">
      <Container style={{ margin: '100px auto' }}>
      <h1 style={{ marginTop: '50px', marginBottom: '50px' }}>API 키 관리</h1>

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
                <a onClick={searchApiKeys} className="use_btn_sch-yellow" id="submit">
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
                    <span>API 사이트</span>
                  </div>
                  <div class="th-writer-yellow">
                    <span>APIKEY</span>
                  </div>
                  <div class="th-date-yellow">
                    <span>사용일</span>
                  </div>
                  <div class="th-date-yellow">
                    <span>종료일</span>
                  </div>
                </li>
                {apiKeyList.map((apiKey, index) => (
                  <li class="tr" key={index}>
                    <div class="td-num">{index + 1}</div>
                    <div
                    class="td-tit"
                    onClick={() => handleApiSiteClick(apiKey)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                    {truncateText(apiKey.sitenm, 15)}
                  </div>
                    <div class="td-writer">{truncateText(apiKey.apikey, 40)}</div>
                    <div class="td-date">{apiKey.strdt}</div>
                    <div class="td-date">{apiKey.edt}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
      </Container>
      <ApiKeyDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem={selectedItem}
      />
    </div>
  );
}

export default Apikey;