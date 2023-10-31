import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Main.css';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Main() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('');

  const handleSearch = async () => {
    console.log(searchTerm)
    try{
        const response = await axios.get('/spring/main/search', {
            params : {
              name : searchTerm
            , sortBy : sortBy}
        });
        setSearchResults(response.data.data);
    }catch (error) {
        console.error("Error searching: ", error);
      }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  console.log(searchResults);
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
                <Link to={`/detailapi/${result.apilistid}`} className="Link">
                  <div className="item">
                      <div className="item-name">{result.apiname}</div>
                      <div className='item-info-container'>
                      <span style={{width : "200px"}}>제공기관: {result.prvorg}</span>
                      <span className='item-info'>조회수: {result.view}</span>
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

export default Main;