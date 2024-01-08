import axios from 'axios';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Table } from 'react-bootstrap';
import FormatDate from '../Format/FormatDate';
import { useNavigate } from 'react-router-dom';
import '../css/UseCaseDetail.css'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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
    <div class="wrap-a">
      <div>
      <h3 style={{ textAlign: 'center', paddingTop:'50px'}}>활용사례 상세</h3>
      <Container style={{ marginTop: '20px' }}>

      
				<div class="wrap-cont">
					<article class="box-detail">
						<div class="box-detail-tit">
							<h4>{searchResults.title}</h4>
						</div>
						<div class="box-detail-info">
							
							<div class="fl-item-r-box-detail-info-txt">
								<span style={{fontSize:'15px', marginRight:'10px'}}>등록일</span><span class="en">{searchDate}</span>
								<span class="txt-mark">|</span>
								<span style={{fontSize:'15px', marginRight:'10px'}}>등록자</span><b>{searchResults.username}</b>
							</div>
							{/* <div class="fl-item-l-link-with">
								<dl>
									<dt>관련링크</dt>
									<dd>
										<a href="https://fluffy-begonia-6cbe0c.netlify.app/" target="_blank" class="btn-base-s-bgc-p1" title="새창 열림"><span>바로가기</span></a>
									</dd>
								</dl>
							</div> */}
						</div>
						<div class="box-detail-body">	
							{/* <h3 class="tit-check">주요기능 소개</h3>
							<div class="box-line">
								<p>지하철 과천역에서 현재 위치를&nbsp;&nbsp;공유하는&nbsp; 웹입니다.</p>
<p>&nbsp;</p>
							</div> */}
							<h3 class="tit-check"><NavigateNextIcon/>활용사례 설명</h3>
							<div class="box-line">
              {searchResults.content}
							</div>
							<h3 class="tit-check" style={{marginTop:'30px'}}><NavigateNextIcon/>사용 API</h3>
							<div>
              {renderApiTable()}<br/>
							</div>
							<div class="box-detail-img">               
                <img style={{height:'300px'}}alt="지하철 현재 위치 공유 웹 글의 사용자 업로드 이미지" src="https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=FILE_000000002444385&fileDetailSn=2"/>
                <img style={{height:'300px'}}alt="지하철 현재 위치 공유 웹 글의 사용자 업로드 이미지" src="https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=FILE_000000002444385&fileDetailSn=3"/> 
                <img style={{height:'300px'}}alt="지하철 현재 위치 공유 웹 글의 사용자 업로드 이미지" src="https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=FILE_000000002444385&fileDetailSn=4"/> 
                <img style={{height:'300px'}}alt="지하철 현재 위치 공유 웹 글의 사용자 업로드 이미지" src="https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=FILE_000000002444385&fileDetailSn=5"/> 
                <img style={{height:'300px'}}alt="지하철 현재 위치 공유 웹 글의 사용자 업로드 이미지" src="https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=FILE_000000002444385&fileDetailSn=6"/>                     
							</div>
						</div>
					</article>
				</div>
			
      </Container>
      </div>
    </div>
  );
}

export default UseCaseDetail;
