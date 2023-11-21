import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { RecoilRoot, useRecoilValue, useRecoilState } from 'recoil';
import TokenManagement from '../TokenManagement';
import { tokenState } from '../TokenState';
import { isLoggedInAtom } from '../atom'
import { Button } from 'react-bootstrap';

function MyInterestData(){
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const location = useLocation();
    const [isFavorite, setIsFavorite] = useState(false);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;
    
    const handleSearch = async () => {
      try{
          const response = await axios.get('/spring/mypage/myinterestapi');
          setSearchResults(response.data.data.data);
      }catch (error) {
          console.error("Error searching: ", error);
        }
    }

    useEffect(() => {
      handleSearch();
    }, []);
  
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

    return(   
      <div>
        {Array.isArray(searchResults) && searchResults.length === 0 ? (
            <p>검색 결과 없음</p>
        ) : (
            <ul>
            {searchResults.map((result) => (
                <li key={result.apilistid} className="result-item">
                <Link 
                  to={`/api/detailapi/${result.apilistid}`}
                  className="Link">
                  <div className="item">
                      <div className="item-name">{result.apinm}</div>
                      <div className='item-info-container'>
                      <span style={{width : "200px"}}>제공기관: {result.prvorg}</span>                      
                      <span className='item-info'>조회수: {result.apiview}</span>
                      <span className='item-info'>사용수: {result.nbruses}</span>
                      <span style={{ display: "none" }}>{result.apilistid}</span>
                      
                      <Button
                        variant={result.favorite ? 'primary' : 'outline-secondary'}
                        onClick={(e) => {
                          e.preventDefault(); // 링크의 기본 동작 막기
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
            </ul>
        )}
      </div>
    )}
export default MyInterestData;