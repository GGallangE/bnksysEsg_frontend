import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container }from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate';
import ApplyApiListDetail from './ApplyApiListDetail'
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';


function ApplyApiList(){
    const [searchApplyApiList, setSearchApplyApiList] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/admin/apiapplylist');
            setSearchApplyApiList(response.data.data.data);
        }catch(error){
            if(error.response.status == 403){
                alert("로그인을 해주세요.");
              }
        }
    }

    const handleTitleClick = (item) => {
        setSelectedItem(item.apiapplyid);
        setModalShow(true);
      };

    useEffect(() => {
        handleSearch();
    }, [])

    return(
    <div className="App">
      <Container style={{margin:'100px auto'}}>
        <div>
        <h5 style={{marginTop : '50px', marginBottom : '50px'}}>API 신청 관리</h5>
        <Table bordered>
            <thead>
                <tr>
                    <th>No</th>
                    <th>API 신청 이름</th>
                    <th>신청자</th>
                    <th>신청일</th>
                    <th>답변일</th>
                    <th>상태</th>
                </tr>
            </thead>
            <tbody>
                {searchApplyApiList.map((item, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                    <div
                    onClick={() => handleTitleClick(item)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                    {item.applynm}
                    </div>
                    </td>
                    <td>{item.username}</td>
                    <td>{item.applydate ? <FormatDate dateString={item.applydate} /> : ''}</td>
                    <td>{item.rplydate ? <FormatDate dateString={item.rplydate} /> : ''}</td>
                    <td>
                      {item.applydvcd === '01' ? '신청중' : (item.applydvcd === '02' ? '반려' : '승인완료')}
                    </td>
                  </tr>
                ))}
            </tbody>
        </Table>
        </div>
      </Container>
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
      <ApplyApiListDetail
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem = {selectedItem}
      />
    </div>
    );
}
export default ApplyApiList;