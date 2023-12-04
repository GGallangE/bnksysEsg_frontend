import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { RecoilRoot, useRecoilValue, useRecoilState } from 'recoil';
import TokenManagement from '../TokenManagement';
import { tokenState } from '../TokenState';
import { isLoggedInAtom } from '../atom';
import Container from 'react-bootstrap/Container';
import { Button, Table, Modal } from 'react-bootstrap';
import ScheduleModify from './ScheduleModify'
import FormatCode from '../Format/FormatCode';

function MyApiSchedule(){
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [batchlistId, setBatchlistId] = useState(null);
    const [apilistId, setApilistId] = useState(null);
    const [showDeleteCheck, setShowDeleteCheck] = useState(false);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;
    
    const handleSearch = async () => {
      try{
          const response = await axios.get('/spring/mypage/myapischedule');
          setSearchResults(response.data.data.data);
          console.log(response.data.data.data)
      }catch (error) {
          console.error("Error searching: ", error);
        }
    };

    const handleTitleClick = (item) => {
      setBatchlistId(item.batchlistid);
      setApilistId(item.apilistid);
      setModalShow(true);
    };

    useEffect(() => {
      handleSearch();
    }, []);
  
    const handleCheckboxChange = async (event, item) => {
      const { checked } = event.target;
      if (checked) {
        setSelectedItems((prevItems) => [...prevItems, item]);
      } else {
        setSelectedItems((prevItems) => prevItems.filter((selectedItem) => selectedItem !== item));
      }
    };

    const handleDeleteCheck = () => {
      setShowDeleteCheck(true);
    };

    const handleDelete = async () => {
      try{
        // selectedItems 배열에 있는 모든 batchlistid에 대해 삭제 요청을 보냄
        await Promise.all(
          selectedItems.map(async (selectedItem) => {
            const response = await axios.post('/spring/mypage/myapischedule/delete', {
              batchlistid: selectedItem.batchlistid,
            });
          })
        );
        // 삭제 후 초기화
        setSelectedItems([]);
        window.location.reload();
      }catch (error) {
        console.error("Error searching: ", error);
      }
    };

    return(
      <div className="App">
        <Container style={{margin:'100px auto'}}>
          <div>
          <h5 style={{marginTop : '50px', marginBottom : '50px'}}>API예약현황</h5>
          <Table bordered>
              <thead>
                  <tr>
                    <th>선택</th>
                    <th>No</th>
                    <th>API이름</th>
                    <th>주기</th>
                  </tr>
              </thead>
              <tbody>
                  {searchResults.map((item, index) => (
                    <tr key={index}>
                    <td>
                    <input
                      type="checkbox"
                      onChange={(event) => handleCheckboxChange(event, item)}
                      checked={selectedItems.includes(item)}
                    />
                    </td>
                    <td>{index + 1}</td>
                    <td>
                    <div
                    onClick={() => handleTitleClick(item)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                    {item.apinm}
                    </div>
                    </td>
                    <td><FormatCode code="frequency" value={item.frequency} /> <FormatCode code="day" value={item.dayofweek} /> {item.dayofmonth && <>{item.dayofmonth}일</>} {item.time}</td>
                    </tr>
                  ))}
              </tbody>
          </Table>
          <Button variant="primary" onClick={() => handleDeleteCheck()}>
            삭제
          </Button>
          </div>
        </Container>
        <ScheduleModify
          show={modalShow}
          onHide={() => {setModalShow(false); window.location.reload(); setSelectedItems([]);}}
          batchlistId = {batchlistId}
          apilistId = {apilistId}
        />
        {/* 삭제 확인 팝업 */}
        <Modal show={showDeleteCheck} onHide={() => setShowDeleteCheck(false)}>
          <Modal.Header closeButton>
            <Modal.Title>삭제 확인</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            삭제하시겠습니까?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteCheck(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={() => { setShowDeleteCheck(false); handleDelete(); }}>
              확인
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      );
}
export default MyApiSchedule;