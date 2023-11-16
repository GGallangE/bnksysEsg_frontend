import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format'
import { Modal, Button } from 'react-bootstrap';

function NoticeDetail(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchatchfileResults, setSearchatchfileResults] = useState([]);
  const noticeid = props.selectedItem;

  const handleSearch = async () => {
    console.log(props)
    if(noticeid!=null){
      try{
          const response = await axios.get('/spring/main/notice/detail', {
              params : {
                  noticeid : noticeid}
          });
          setSearchResults(response.data.data.data[0]);
          const atchfileid = response.data.data.data[0].atchfileid;
          atchfile(atchfileid);
      }catch (error) {
          console.error("Error searching: ", error);
        }
      }
    }

  const atchfile = async (atchfileid) => {
    try {
      const response = await axios.get('/spring/main/notice/detailatchfile', {
        params: {
          atchfileid: atchfileid,
        },
      });
      setSearchatchfileResults(response.data.data.data);
      console.log(response);
    } catch (error) {
      console.error('Error searching: ', error);
    }
  };

  const handledownloadatchfile = async (
    atchdetailfileid,
    orgfilename,
    atchfileext
  ) => {
    try {
      // 사용자에게 다운로드 폴더를 변경하는 방법에 대한 안내 텍스트
      const downloadGuideText =
        '파일을 다운로드할 폴더를 변경하려면 브라우저 설정으로 이동하세요.\n\n크롬: 설정 -> 다운로드 -> "다운로드 전에 각 파일의 저장 위치 확인"을 체크하세요.\n엣지: 설정 -> 다운로드 -> "각 다운로드 시 수행할 작업에 대해 확인"을 체크하세요.';
      
      // 다운로드 링크 생성
      const response = await axios.get(
        `/spring/atchfile/download/${atchdetailfileid}`,
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const link = document.createElement('a');


      link.href = window.URL.createObjectURL(blob);
      const defaultFileName = `${orgfilename}.${atchfileext}`;
      link.download = defaultFileName;

      // 다운로드 링크 클릭
      link.click();

      // 다운로드 링크 해제
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading: ', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [noticeid]);

    return (
      <div>
      <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          공지사항
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Container
        className="border border-dashed p-3"
      >
        <Row className="mb-3">
          <Col xs={12}>
            <h5>제목: {searchResults.noticenm}</h5>
          </Col>
        </Row>
        <Row className="mb-3" style={{ marginTop: '100px' }}>
          <Col xs={12}>
            <h5>내용: {searchResults.noticecntn}</h5>
          </Col>
        </Row>
        <Row className="mb-3" style={{ marginTop: '300px' }}>
          <Col xs={12}>
            <h5>첨부파일:</h5>
            <p>
              다운로드 경로 설정을 원하시면 아래 안내를 확인하세요.
              <br />
              크롬: 설정 - 다운로드 - "다운로드 전에 각 파일의 저장 위치 확인"을
              체크하세요.
              <br />
              엣지: 설정 - 다운로드 - "각 다운로드 시 수행할 작업에 대해
              확인"을 체크하세요.
            </p>
            {searchatchfileResults.map((atchfile, index) => (
              <div
                key={index}
                onClick={() =>
                  handledownloadatchfile(
                    atchfile.atchdetailfileid,
                    atchfile.orgfilename,
                    atchfile.atchfileext
                  )
                }
                style={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  color: 'blue',
                }}
              >
                {atchfile.orgfilename}.{atchfile.atchfileext}
              </div>
            ))}
          </Col>
        </Row>
      </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
        </div>
    );
  }

export default NoticeDetail;