import React, { useEffect ,useState, Suspense} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DetailApi_Status.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
      <div>
        <p>API Name: {searchResults.apiname}</p>
        <p>제공기관: {searchResults.prvorg}</p>
        <p>조회수: {searchResults.view}</p>
        <p>사용 횟수: {searchResults.nbruses}</p>
        <p>API 설명: {searchResults.apiexpl}</p>
      </div>
    </Container>
      
      <Suspense fallback={<div>Loading...</div>}>
            <DynamicComponent />
      </Suspense>
    </div>     
  );
}

export default DetailApi_Status;
