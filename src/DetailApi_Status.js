import React, { useEffect ,useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function DetailApi_Status() {
  const {apilistid} = useParams();
  const [searchResults, setSearchResults] = useState({});

  useEffect(() => {
    const fetchApiDetails = async () => {
      try {
        const response = await axios.get(`/spring/connection/result/${apilistid}`)
        setSearchResults(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching API details: ", error);
      }
    };

    fetchApiDetails();
  }, [apilistid]);

  return (
    <div>
      <h3>{searchResults.apiname} 맞습니다!</h3>
      <div>
        <p>API Name: {searchResults.apiname}</p>
        <p>제공기관: {searchResults.prvorg}</p>
        <p>조회수: {searchResults.view}</p>
        <p>사용 횟수: {searchResults.nbruses}</p>
        <p>API 설명: {searchResults.apiexpl}</p>
      </div>
    </div>
  );
}

export default DetailApi_Status;
