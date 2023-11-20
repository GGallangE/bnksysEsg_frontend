import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Link} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Button, Container }from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import NoticeDetail from './NoticeDetail'

function Notice(){
    const [searchNotice, setSearchNotice] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/main/notice');
            setSearchNotice(response.data.data.data);
        }catch(error){
            console.error("Error searching : ", error)
        }
    }

    const handleTitleClick = (item) => {
        setSelectedItem(item.noticeid);
        setModalShow(true);
      };

    useEffect(() => {
        handleSearch();
    }, []);

    return (
    <div className="App">
      <Container style={{margin:'50px auto'}}>
        <div>
        <h5 style={{marginTop : '50px',marginBottom : '50px'}}>공지사항</h5>
        <Table bordered>
            <thead>
                <tr>
                    <th>No</th>
                    <th>제목</th>
                    <th>등록자</th>
                    <th>등록일</th>
                </tr>
            </thead>
            <tbody>
                {searchNotice.map((item, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                    <div
                    onClick={() => handleTitleClick(item)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                    {item.noticenm}
                  </div>
                    </td>
                    <td>관리자</td>
                    <td><FormatDate dateString={item.regdt} /></td>
                  </tr>
                ))}
            </tbody>
        </Table>
        </div>
      </Container>
      <NoticeDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem = {selectedItem}
      />
    
    </div>
        
    )
};

export default Notice;