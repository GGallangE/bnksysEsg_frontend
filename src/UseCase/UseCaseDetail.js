import axios from 'axios';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Table } from 'react-bootstrap';
import FormatDate from '../Format'

function UseCaseDetail(){
  const [searchResults, setSearchResults] = useState([]);
  const { usecaseid } = useParams();

  const handleSearch = async () => {
    if(usecaseid!=null){
      try{
          const response = await axios.get('/spring/usecase/usecasedetail', {
              params : {
                  usecaseid : usecaseid}
          });
          setSearchResults(response.data.data.data[0]);
      }catch (error) {
          console.error("Error searching: ", error);
        }
      }
    }

  useEffect(() => {
    handleSearch();
  }, [usecaseid]);

return(
    <div>
        <Container
        className="border border-dashed p-3"
      >
        <Row className="mb-3">
          <Col xs={12}>
            <h5>제목: {searchResults.title}</h5>
          </Col>
        </Row>
        <Row className="mb-3" style={{ marginTop: '100px' }}>
          <Col xs={12}>
            <h5>내용: {searchResults.content}</h5>
          </Col>
        </Row>
      </Container>
    </div>
)
}
export default UseCaseDetail;