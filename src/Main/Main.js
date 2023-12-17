import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { Col, Form, Row, Container, ListGroup, Card, Modal } from 'react-bootstrap';
import './Main.css';
import NoticeDetail from '../Information/NoticeDetail'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

function Main() {
  const [searchNotice, setSearchNotice] = useState([]);
  const [searchPopular, setSearchPopular] = useState([]);
  const [searchRecent, setSearchRecent] = useState([]);
  const [searchApi, setSearchApi] = useState([]);
  const [showNoticeDetail, setShowNoticeDetail] = useState(false);
  const [selectedNoticeItem, setSelectedNoticeItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const notice = async () => {
    try {
      const response = await axios.get('/spring/main/notice', {
        params: {
          mainsort: "yes"
        }
      });
      setSearchNotice(response.data.data.data);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  const popular = async () => {
    try {
      const response = await axios.get('/spring/main/view_recent/top5', {
        params: {
          sort: "view"
        }
      });
      setSearchPopular(response.data.data.data);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  const recent = async () => {
    try {
      const response = await axios.get('/spring/main/view_recent/top5', {
        params: {
          sort: "recent"
        }
      });
      setSearchRecent(response.data.data.data);
    } catch (error) {
      console.error("Error searching: ", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('/spring/main/search', {
        params: {
          sortBy: "조회순",
          name: searchTerm
        },
      });
      setSearchApi(response.data.data.data);
      navigate(
        '/openapi/apilist',
        {
          state:
          {
            name: searchTerm,
            sortBy: "조회순"
          }
        });
    } catch (error) {
      console.error("Error searching : ", error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTitleClick = (item) => {
    setSelectedNoticeItem(item);
    setShowNoticeDetail(true);
  };

  const handlePlus = () => {
    navigate('/information/notice');
  };

  useEffect(() => {
    notice();
    popular();
    recent();
  }, []);
  
  return (
    <div>
      <div className="main-sec1-search">
        <div className="search-wrap-all">
          <div className="search-wrap">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="search-input"
              title="검색"
              onKeyDown={handleKeyDown}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm} />
            <button
              className="search-button"
              onClick={handleSearch}
              type="submit">
              <SearchIcon sx={{ fontSize: '23px' }} />Search
            </button>
          </div>
        </div>
      </div>
      {/* <div className="article"> */}
        <div className="intelligence_list_w">
          <div className="h_w">
            <h2 style={{textAlign: 'center'}}><em className="b">TOP 5</em></h2>
          </div>
          <ul className="intelligence_list">
            <li className="li_faq">
              <div className="box" style={{ background: '#d7e7af67', boxShadow: '15px 15px 30px #e6e6e6' }}>
                <div className="h4_w">
                  <h4>NOTICE</h4>
                  <a href="/information/notice" className="ico"><AddIcon className="AddIcon" /></a>
                </div>
                <div className="box_cnt">
                  <ul className="cnt_list">
                    {searchNotice.map((item, index) => (
                      <li key={index}>
                        <div className="w">
                          <p className="category" style={{ background: '#D7E7AF' }}><span>{index + 1}</span></p>
                          <a
                            className="tite"
                            onClick={() => handleTitleClick(item.noticeid)}
                          >
                            {item.noticenm.length > 15
                              ? `${item.noticenm.substring(0, 15)}...`
                              : item.noticenm}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            <li className="li_faq">
              <div className="box" style={{ background: '#bbd4ef6b', boxShadow: '15px 15px 30px #e6e6e6' }}>
                <div className="h4_w">
                  <h4>인기데이터</h4>
                  <a href="/openapi/apilist" className="ico"><AddIcon className="AddIcon" /></a>
                </div>
                <div className="box_cnt">
                  <ul className="cnt_list">
                    {searchPopular.map((item, index) => (
                      <li key={index}>
                        <div className="w">
                          <p className="category" style={{ background: '#BBD4EF' }}><span>{index + 1}</span></p>
                          <Link to={`/api/detailapi/${item.apilistid}`} className="tite">
                            {item.apinm.length > 15
                              ? `${item.apinm.substring(0, 15)}...`
                              : item.apinm}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            <li className="li_counseling">
              <div className="box" style={{ background: '#fae9c06b', boxShadow: '15px 15px 30px #e6e6e6' }}>
                <div className="h4_w">
                  <h4>최신데이터</h4>
                  <a href="/openapi/apilist" className="ico"><AddIcon className="AddIcon" /></a>
                </div>
                <div className="box_cnt">
                  <ul className="cnt_list">
                    {searchRecent.map((item, index) => (
                      <li key={index}>
                        <div className="w">
                          <p className="category" style={{ background: '#FAEAC0' }}><span>{index + 1}</span></p>
                          <Link to={`/api/detailapi/${item.apilistid}`} className="tite">
                            {item.apinm.length > 15
                              ? `${item.apinm.substring(0, 15)}...`
                              : item.apinm}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      {/* </div> */}
      <NoticeDetail
        show={showNoticeDetail}
        onHide={() => setShowNoticeDetail(false)}
        selectedItem={selectedNoticeItem}
      />
    </div>
  );
};

export default Main;