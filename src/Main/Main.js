import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Main.css';
import NoticeDetailModal from '../Modal/NoticeDetailModal'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoveApiRegister from "../Modal/MoveApiRegister";

function Main() {
  const [searchNotice, setSearchNotice] = useState([]);
  const [searchPopular, setSearchPopular] = useState([]);
  const [searchRecent, setSearchRecent] = useState([]);
  const [searchApi, setSearchApi] = useState([]);
  const [showNoticeDetail, setShowNoticeDetail] = useState(false);
  const [selectedNoticeItem, setSelectedNoticeItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [modalapilistid, setModalapilistid] = useState("");
  const [modalapinm, setModalapinm] = useState("");
  const [modalapiexpl, setModalapiexpl] = useState("");
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

  const CustomLink = ({ apilistid, apinm, apiexpl, usedvcd }) => {
    const handleMoveApiDetail = () => {
      if (usedvcd === "01") {
        navigate(`/api/detailapi/${apilistid}`);
      } else {
        showApiRegisterModal(apilistid, apinm, apiexpl);
      }
    };
  
    return (
      <span className="tite" onClick={handleMoveApiDetail}>
        {apinm.length > 15 ? `${apinm.substring(0, 15)}...` : apinm}
      </span>
    );
  };

  const showApiRegisterModal = (apilistid, apinm, apiexpl) => {
    setModalShow(true);
    setModalapilistid(apilistid);
    setModalapinm(apinm);
    setModalapiexpl(apiexpl);
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
              <SearchIcon sx={{ fontSize: '35px' }} />
            </button>
          </div>
        </div>
      </div>
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
                  <h4>POPULAR</h4>
                  <a href="/openapi/apilist?sortby=view" className="ico"><AddIcon className="AddIcon" /></a>
                </div>
                <div className="box_cnt">
                  <ul className="cnt_list">
                    {searchPopular.map((item, index) => (
                      <li key={index}>
                        <div className="w">
                          <p className="category" style={{ background: '#BBD4EF' }}><span>{index + 1}</span></p>
                          <CustomLink apilistid={item.apilistid} apinm={item.apinm} apiexpl={item.apiexpl} usedvcd={item.usedvcd} />
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
                  <h4>RECENT</h4>
                  <a href="/openapi/apilist?sortby=register" className="ico"><AddIcon className="AddIcon" /></a>
                </div>
                <div className="box_cnt">
                  <ul className="cnt_list">
                    {searchRecent.map((item, index) => (
                      <li key={index}>
                        <div className="w">
                          <p className="category" style={{ background: '#FAEAC0' }}><span>{index + 1}</span></p>
                          <CustomLink apilistid={item.apilistid} apinm={item.apinm} apiexpl={item.apiexpl} usedvcd={item.usedvcd} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      <NoticeDetailModal
        show={showNoticeDetail}
        onHide={() => setShowNoticeDetail(false)}
        selectedItem={selectedNoticeItem}
      />
      <MoveApiRegister
        apilistid={modalapilistid}
        apinm={modalapinm}
        apiexpl={modalapiexpl}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default Main;