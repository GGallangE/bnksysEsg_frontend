import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RecoilRoot, useRecoilValue, useRecoilState } from 'recoil';
import TokenManagement from '../TokenManagement';
import { tokenState } from '../TokenState';
import '../css/ApiList.css';
import { isLoggedInAtom } from '../atom'
import { Button, Container } from 'react-bootstrap';
import { Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

function ApiList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const [totalpage, setTotalpage] = useState(1);
  const LAST_PAGE = totalpage % 30 === 0 ? parseInt(totalpage / 30) : parseInt(totalpage / 30);
  const [currentPage, setCurrentPage] = useState(1);

  axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

  const handleSearch = async () => {
    try{
        await updateSearchState();
        const response = await axios.get('/spring/main/search', {
            params : {
              name : searchTerm
            , sortBy : sortBy
            , page: currentPage
            }
        });
        setSearchResults(response.data.data);
        console.log(response.data.data);
        console.log(response.data.data[0].total);
        setTotalpage(response.data.data[0].total);
    }catch (error) {
        console.error("Error searching: ", error);
      }
  }
  useEffect(() => {
    handleSearch();
  }, [currentPage]);
  const handlePageChange = (event, page) => {

    // const currentPageIndex = Number(event.target.outerText);
    console.log(page);
    setCurrentPage(page);
  };

  const updateSearchState = async () => {
    if (location.state) {
      console.log(location.state);
      await setSearchTerm(location.state.name);
      await setSortBy(location.state.sortBy);
      navigate('/OPENAPI/ApiList', { state: null });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    updateSearchState();
  }, [location.state]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, sortBy]);

  const SelectBox = () => {
    return (
      <select style={{ marginLeft: '80%',
      marginBottom:'10px',
      width: '100px',
      padding: '8px', 
      borderRadius: '10px', 
      border: '2px solid #a2d7d4', 
      background: '#fff', 
      color: '#333', 
      cursor: 'pointer' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option key="register" value="register">
          등록순
        </option>
        <option key="view" value="view">
          조회순
        </option>
        <option key="nbruses" value="nbruses">
          사용순
        </option>
      </select>
    )
  }

  const handleFavoriteToggle = async (apilistid, favorite) => {
    try {
      // 서버로 관심 데이터 토글 요청
      await axios.post('/spring/userapi/interestapi',
        {
          apilistid,
          stcd: favorite ? '99' : '01'
        }
      );
      // API 목록을 다시 불러오기
      handleSearch();
    } catch (error) {
      if (error.response.status == 403) {
        alert("로그인을 해주세요.");
      }
    }
  };

  return (
    <div>
      <Container>
        <div className="sch_total_w">
          <div className="sch_total">
            
              <div className="input_wrap">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="sch_ip"
                />
                <a onClick={handleSearch} className="btn_sch" id="submit">
                  <SearchIcon sx={{ fontSize: '28px', color:'#fff', margin:'5px 0px 0px 6px' }} />
                </a>
              </div>
            
          </div>
        </div>
      </Container>
      <div style={{ marginTop: '30px' }}>

        <SelectBox />
        <div style={{ padding: '10px', background: '#a2d7d43b' }}>
          {Array.isArray(searchResults) && searchResults.length === 0 ? (
            <p>검색 결과 없음</p>
          ) : (
            <ul>
              {searchResults.map((result) => (
                <li className="item" key={result.apilistid} style={{ marginTop: "20px" }}>
                  <Link
                    to={`/api/detailapi/${result.apilistid}`}
                    className="Link">
                    <div>
                      <div className="item-name">{result.apinm}</div>
                      <div className='item-info-container'>
                        <span style={{ width: "200px" }}>제공기관: {result.prvorg}</span>
                        <span className='item-info'>조회수: {result.apiview}</span>
                        <span className='item-info'>사용수: {result.countapiuses}</span>
                        <span style={{ display: "none" }}>{result.apilistid}</span>

                        <Button
                        style={{border:'none'}}
                          variant={result.favorite ? 'primary' : 'outline-secondary'}
                          onClick={(e) => {
                            e.preventDefault();
                            handleFavoriteToggle(result.apilistid, result.favorite);
                          }}
                          className="favorite-button"
                        >
                          {result.favorite ? <BookmarkIcon/> : <BookmarkBorderIcon/>}
                        </Button>
                        <Button
                          variant={result.favorite ? 'primary' : 'outline-secondary'}
                          onClick={(e) => {
                            e.preventDefault();
                            handleFavoriteToggle(result.apilistid, result.favorite);
                          }}
                          className="favorite-button"
                        >
                          {result.favorite ? '사용하러가기' : '사용신청하기'}
                        </Button>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
              <Pagination page={currentPage} count={LAST_PAGE} defaultPage={1} onChange={handlePageChange} />

            </ul>
          )}
        </div>
      </div>

    </div>
  )
}
export default ApiList;
