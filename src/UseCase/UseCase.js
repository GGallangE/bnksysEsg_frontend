import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import FormatDate from '../Format/FormatDate'
import { Container, Button, Row, Col } from 'react-bootstrap';
import '../css/UseCase.css';
import SearchIcon from '@mui/icons-material/Search';

function UseCase() {
  const [searchUseCase, setSearchUseCase] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get('/spring/usecase/mainusecase', {
        params: {
          searchname: searchTerm
        },
      });
      setSearchUseCase(response.data.data.data);

    } catch (error) {
      console.error("Error searching : ", error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="App">
      <Container>

        <div>
          <h1>활용사례</h1>
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
                <a onClick={handleSearch} className="use_btn_sch-yellow" id="submit">
                  <SearchIcon sx={{ fontSize: '30px', color: '#fff', margin: '5px 0px 0px 0px' }} />
                </a>
              </div>
            </div>
          </div>
          <Row className="justify-content-end">
            <Col md="auto">
              <Button onClick={() => { navigate('/openapi/usecaseregister'); }} style={{ margin: '10px', background: '#fff', borderColor: '#FAEAC0', borderWidth: '2px', fontWeight: 'bold', color: '#000' }} variant="primary" type="submit">
                활용사례 등록하기
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
                    <span>제목</span>
                  </div>
                  <div class="th-writer-yellow">
                    <span>등록자</span>
                  </div>
                  <div class="th-date-yellow">
                    <span>등록일</span>
                  </div>
                </li>
                {searchUseCase.map((item, index) => (
                  <li class="tr" key={index}>
                    <div class="td-num">{index + 1}</div>
                    <div class="td-tit">
                      <Link to={`/openapi/usecasedetail/${item.usecaseid}`}>{item.title}</Link>
                    </div>
                    <div class="td-writer">{item.username}</div>
                    <div class="td-date"><FormatDate dateString={item.regdt} /></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
};
export default UseCase;