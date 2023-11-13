import React, { useEffect ,useState, Suspense} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DetailApiStatus.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormatDate from '../Format';

function DetailApiStatus() {
  const { apilistid } = useParams();
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ApiInfo = async () => {
      try {
        const response = await axios.get(`/spring/connection/result/${apilistid}`)
        setSearchResults(response.data.data[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching API details: ", error);
      }
    };

    const ApiUsecase = async () => {
      try {
        const response = await axios.get(`/spring/usecase/apidetail?apilistid=${apilistid}`)
        setSearchResults(response.data.data[0]);
        //setLoading(false);
      } catch (error) {
        console.error("Error fetching API details: ", error);
      }
    };

    ApiInfo();
    //ApiUsecase();
  }, [apilistid]);

  const DynamicComponent = React.lazy(() =>
    import(`./DetailData${apilistid}`)
  );
  const boxStyle = {
    border: '2px solid #000',
    padding: '20px',
    borderRadius: '10px',
  };
  return (
    <div>
      <Container style={boxStyle}>
      <h3>{searchResults.apiname}</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>API Name: {searchResults.apinm}</p>
            <p>제공기관: {searchResults.prvorg}</p>
            <p>조회수: {searchResults.apiview}</p>
            <p>사용 횟수: {searchResults.countapiuses}</p>
            <p>API 설명: {searchResults.apiexpl}</p>
            <p>등록날짜: <FormatDate dateString={searchResults.apirgdt} /></p>
          </div>
        )}
      </Container>
      
      <Suspense fallback={<div>Loading...</div>}>
            <DynamicComponent />
      </Suspense>
    </div>     
  );
}

export default DetailApiStatus;
