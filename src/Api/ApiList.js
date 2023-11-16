import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RecoilRoot, useRecoilValue, useRecoilState } from 'recoil';
import TokenManagement from '../TokenManagement';
import { tokenState } from '../TokenState';
import { isLoggedInAtom } from '../atom'
import './ApiList.css';

function ApiList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const location = useLocation();
  const isLoggedIn= useRecoilValue(isLoggedInAtom);

  const handleSearch = async () => {
    await updateSearchState();
    try{
        const response = await axios.get('/spring/main/search', {
            params : {
              name : searchTerm
            , sortBy : sortBy},
            headers: {
              Authorization: `Bearer ${isLoggedIn}`
          }
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
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

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
  
  return (
    <div className='App'>
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
                      </div>
                  </div>
                </Link>
                </li>
            ))}
            </ul>
        )}
        
      </div>
    
    </div>
    
  );
}

export default ApiList;