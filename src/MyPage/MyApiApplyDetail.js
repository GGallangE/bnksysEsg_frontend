import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import { Modal, Button, Spinner } from 'react-bootstrap';
import useDidMountEffect from '../hooks/useDidMountEffect'

function MyApiApplyDetail(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const apiapplyid = props.selectedItem;

  const handleSearch = async () => {
    if (apiapplyid != null) {
      try {
        const response = await axios.get('/spring/mypage/myapiapply', {
          params: {
            apiapplyid: apiapplyid
          }
        });
        setSearchResults(response.data.data.data[0]);
      } catch (error) {
        console.error("Error searching: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useDidMountEffect(() => {
    setIsLoading(true); // 컴포넌트가 마운트될 때 로딩 상태를 true로 설정
    handleSearch();
  }, [apiapplyid]);

  return (
    <div>
      {isLoading ? (
        // 스피너 표시
        <Spinner animation="border" role="status" />
      ) : searchResults ? ( // Modal을 렌더링하기 전에 searchResults가 참인지 확인
        //로딩완료시 컴포넌트 내용렌더링
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header style={{ background: '#bbd4ef' }} closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              API신청내용
            </Modal.Title>
          </Modal.Header>
            <Container>
              <Row className="mb-3">
                <Col xs={12}>
                  <span style={{margin:'10px', fontWeight:'bold'}}>
                    제목: {searchResults.applynm}</span>
                </Col>
              </Row>
              <Row className="mb-3" style={{ marginTop: '30px' }}>
                <Col xs={12}>
                <span style={{margin:'10px', fontWeight:'bold'}}>내용</span>
                <div style={{height:'300px'}} className='noti-content' >
                <span>{searchResults.applycntn}</span>
                </div>
                </Col>
              </Row>
              <Button style={{
            padding: '10px 30px',
            margin: '10px auto', 
            display: 'block', 
            background: '#bbd4ef',
            border: 'none', 
            color: 'black', 
          }} onClick={props.onHide}>닫기</Button>
            </Container>
        </Modal>
      ) : (
        //검색결과가 없는 경우
        <div>데이터가 없습니다.</div>
      )
      }
    </div>
  );
}

export default MyApiApplyDetail;