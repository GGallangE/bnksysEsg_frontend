import axios from 'axios';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Table } from 'react-bootstrap';
import FormatDate from '../Format/FormatDate';
import { useNavigate } from 'react-router-dom';

function UseCaseDetail() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchApiResults, setSearchApiResults] = useState([]);
  const { usecaseid } = useParams();
  const [searchDate, setSearchDate] = useState('');

  const handleSearch = async () => {
    if (usecaseid != null) {
      try {
        const response = await axios.get('/spring/usecase/usecasedetail', {
          params: {
            usecaseid: usecaseid
          }
        });
        setSearchResults(response.data.data.data[0]);
        setSearchDate(<FormatDate dateString={response.data.data.data[0].regdt} />);
      } catch (error) {
        console.error("Error searching: ", error);
      }
    }
  };

  const apiliistSearch = async () => {
    if (usecaseid != null) {
      try {
        const response = await axios.get('/spring/usecase/usecasedetail_apilist', {
          params: {
            usecaseid: usecaseid
          }
        });
        setSearchApiResults(response.data.data.data)
        renderApiTable();
      } catch (error) {
        console.error("Error apilist searching ", error);
      }
    }
  }

  const renderApiTable = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>API 이름</th>
            <th>제공 기관</th>
          </tr>
        </thead>
        <tbody>
          {searchApiResults.length === 0 ? (
            <tr>
              <td colSpan="2">사용 API가 없습니다</td>
            </tr>
          ) : (
            searchApiResults.map(api => (
              <tr key={api.apilistid} onClick={() => handleApiClick(api.apilistid)} style={{ cursor: 'pointer' }}>
                <td>{api.apinm}</td>
                <td>{api.prvorg}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    );
  };

  const navigate = useNavigate();

  const handleApiClick = (apilistid) => {
    navigate(`/api/detailapi/${apilistid}`);
  };

  useEffect(() => {
    handleSearch();
    apiliistSearch();
  }, [usecaseid]);

  const getContentStyle = () => {
    const maxContentHeight = '500px';
    const minContentHeight = '500px';

    return {
      minHeight: minContentHeight,
      maxHeight: maxContentHeight,
      overflowY: 'auto',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'break-word',
    };
  };

  const boldText = {
    fontWeight: 'bold',
  };

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginTop: '100px' }}>활용사례 상세</h3>
      <Container style={{ marginTop: '50px' }}>
        <Row className="mb-3">
          <Col xs={12}>
            <h5><span style={boldText}>제목:</span> {searchResults.title}</h5>
          </Col>
        </Row>
        <Row className="mb-3" style={{ marginTop: '30px' }}>
          <Col xs={12}>
            <p style={{ textAlign: 'right' }}><span style={boldText}>등록인:</span> {searchResults.username}</p>
            <p style={{ textAlign: 'right' }}><span style={boldText}>등록일:</span> {searchDate} </p>
          </Col>
        </Row>
        <hr style={{ marginTop: '20px' }} />
        <Row className="mb-3" style={{ marginTop: '40px' }}>
          <Col xs={12}>
            <h5 style={{ marginBottom: '10px' }}><span style={boldText}>활용사례 설명:</span></h5>
            <div style={getContentStyle()}>{searchResults.content}</div>
          </Col>
        </Row>
        <hr style={{ marginTop: '20px' }} />
        <Row className="mb-3" style={{ marginTop: '40px' }}>
          <Col xs={12}>
            <h5 style={{ marginBottom: '10px' }}><span style={boldText}>사용 API:</span></h5>
            {renderApiTable()}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UseCaseDetail;
