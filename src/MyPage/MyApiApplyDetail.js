import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import { Modal, Button, Spinner } from 'react-bootstrap';

function MyApiApplyDetail(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiapplyid = props.selectedItem;

  const handleSearch = async () => {
    if(apiapplyid!=null){
      try{
          const response = await axios.get('/spring/mypage/myapiapply', {
              params : {
                  apiapplyid : apiapplyid}
          });
          setSearchResults(response.data.data.data[0]);
      }catch (error) {
          console.error("Error searching: ", error);
        } finally{
          setIsLoading(false);
        }
      }
    }

  useEffect(() => {
    setIsLoading(true); // 컴포넌트가 마운트될 때 로딩 상태를 true로 설정
    handleSearch();
  }, [apiapplyid]);

    return (
      <div>
        {isLoading? (
          // 스피너 표시
          <Spinner animation="border" role="status" />
            
        ) : searchResults?( // Modal을 렌더링하기 전에 searchResults가 참인지 확인
          //로딩완료시 컴포넌트 내용렌더링
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                API신청내용
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container
              className="border border-dashed p-3"
            >
              <Row className="mb-3">
                <Col xs={12}>
                  <h5>제목: {searchResults.applynm}</h5>
                </Col>
              </Row>
              <Row className="mb-3" style={{ marginTop: '100px' }}>
                <Col xs={12}>
                  <h5>내용: {searchResults.applycntn}</h5>
                </Col>
              </Row>
            </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
          </Modal>
        ): (
          //검색결과가 없는 경우
          <div>데이터가 없습니다.</div>
        )
      }
      </div>
    );
  }

export default MyApiApplyDetail;