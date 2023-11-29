import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { RecoilRoot, useRecoilValue, useRecoilState } from 'recoil';
import TokenManagement from '../TokenManagement';
import { tokenState } from '../TokenState';
import { isLoggedInAtom } from '../atom';
import Container from 'react-bootstrap/Container';
import { Button, Table } from 'react-bootstrap';
import ScheduleModify from './ScheduleModify'
import FormatCode from '../Format/FormatCode';

function MyApiSchedule(){
    const [searchResults, setSearchResults] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
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
    }

    const handleTitleClick = (item) => {
      setSelectedItem(item.batchlistid);
      setModalShow(true);
    };

    useEffect(() => {
      handleSearch();
    }, []);
  
    console.log(searchResults);

    return(
      <div className="App">
        <Container style={{margin:'100px auto'}}>
          <div>
          <h5 style={{marginTop : '50px', marginBottom : '50px'}}>API예약현황</h5>
          <Table bordered>
              <thead>
                  <tr>
                      <th>No</th>
                      <th>API이름</th>
                      <th>주기</th>
                      <th>날짜</th>
                      <th>상태</th>
                  </tr>
              </thead>
              <tbody>
                  {searchResults.map((item, index) => (
                      <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                      <div
                      onClick={() => handleTitleClick(item)}
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      >
                      {item.apinm}
                      </div>
                      </td>
                      <td><FormatCode code="frequency" value={item.frequency} /> <FormatCode code="day" value={item.dayofweek} /> {item.dayofmonth} {item.time}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
              </tbody>
          </Table>
          </div>
        </Container>
        <ScheduleModify
          show={modalShow}
          onHide={() => setModalShow(false)}
          selectedItem = {selectedItem}
        />
      </div>
      );
}
export default MyApiSchedule;