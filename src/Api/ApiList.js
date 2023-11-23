import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import { RecoilRoot, useRecoilValue, useRecoilState } from 'recoil';
import TokenManagement from '../TokenManagement';
import { tokenState } from '../TokenState';
import './ApiList.css';
import { isLoggedInAtom } from '../atom'
import { Button, Container } from 'react-bootstrap';


function ApiList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const isLoggedIn= useRecoilValue(isLoggedInAtom);
  axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;
  
  const handleSearch = async () => {
    try{
        await updateSearchState();
        const response = await axios.get('/spring/main/search', {
            params : {
              name : searchTerm
            , sortBy : sortBy}
        });
        setSearchResults(response.data.data);
        console.log(response.data.data);
    }catch (error) {
        console.error("Error searching: ", error);
      }
  }

  const updateSearchState = async () =>{
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
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option key = "register" value = "register">
          등록순
        </option>
        <option key = "view" value = "view">
          조회순
        </option>
        <option key = "nbruses" value = "nbruses">
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
      if(error.response.status == 403){
        alert("로그인을 해주세요.");
      }
    }
  };
  
  return (
    <div className='App'  style={{ marginTop: '100px' }}>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="inputField"
      />
      <SelectBox />
      <button onClick={handleSearch}>검색</button>
      <div style={{marginTop:"50px"}}>
        {Array.isArray(searchResults) && searchResults.length === 0 ? (
            <p>검색 결과 없음</p>
        ) : (
            <ul>
              <Container>
                
            {searchResults.map((result) => (
                <li key={result.apilistid} className="result-item" style={{marginTop:"20px"}}>
                <Link 
                  to={`/api/detailapi/${result.apilistid}`}
                  className="Link">
                  <div className="item" style={{ borderRadius: '10px', padding: '10px' }}>
                      <div className="item-name">{result.apinm}</div>
                      <div className='item-info-container'>
                      <span style={{width : "200px"}}>제공기관: {result.prvorg}</span>                      
                      <span className='item-info'>조회수: {result.apiview}</span>
                      <span className='item-info'>사용수: {result.countapiuses}</span>
                      <span style={{ display: "none" }}>{result.apilistid}</span>
                      
                      <Button
                        variant={result.favorite ? 'primary' : 'outline-secondary'}
                        onClick={(e) => {
                          e.preventDefault();
                          handleFavoriteToggle(result.apilistid, result.favorite);
                        }}
                        className="favorite-button"
                      >
                        {result.favorite ? '찜 해제하기' : '찜하기'}
                      </Button>
                      </div>
                  </div>
                </Link>
                </li>
            ))}
              </Container>
            </ul>
        )}
      </div>
    </div>
  )}
export default ApiList;
