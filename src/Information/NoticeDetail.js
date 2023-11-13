import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format'

function NoticeDetail() {

    const [searchResults, setSearchResults] = useState([]);
    const [searchatchfileResults, setSearchatchfileResults] = useState([]);
    const { noticeid } = useParams();
    const handleSearch = async () => {
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

      const atchfile = async (atchfileid) => {
        try{
            const response = await axios.get('/spring/main/notice/detailatchfile', {
                params : {
                    atchfileid : atchfileid}
            });
            setSearchatchfileResults(response.data.data.data);
            console.log(response);
        }catch (error) {
            console.error("Error searching: ", error);
          }
      }

      const handledownloadatchfile = async (atchdetailfileid) => {
        try {
        console.log(atchdetailfileid);
          const response = await axios.get(`/spring/atchfile/download/${atchdetailfileid}`);
          console.log(response);
        } catch (error) {
          console.error("Error searching: ", error);
        }
      };

      useEffect(() => {
        handleSearch();
      }, []);


    return (
        <div>
            <h1 style={{marginTop : '50px', textAlign : 'center'}}>공지사항</h1>
        <Container className="border border-dashed p-3" style={{marginTop : '100px'}}>
            <Row className="mb-3">
            <Col xs={12}>
                <h4>제목: {searchResults.noticenm}</h4>
            </Col>
            </Row>
            <Row className="mb-3" style={{marginTop : '100px'}}>
            <Col xs={12}>
                <h4>내용: {searchResults.noticecntn}</h4>
            </Col>
            </Row>
            <Row className="mb-3" style={{marginTop : '300px'}}>
            <Col xs={12}>
                <h4>첨부파일:</h4>
                {searchatchfileResults.map((atchfile, index) => (
                <div key={index} onClick={() => handledownloadatchfile(atchfile.atchdetailfileid)} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>
                {atchfile.orgfilename}.{atchfile.atchfileext}
              </div>
                ))}
            </Col>
            </Row>
        </Container>
        </div>
    );
  }
  

export default NoticeDetail;