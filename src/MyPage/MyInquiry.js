import React, { useState, useEffect}  from 'react';
import { Button, Table, Container } from 'react-bootstrap';
import axios from 'axios'
import FormatDate from '../Format/FormatDate'
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';

function MyInquiry(){
    const [searchMyInquiry, setSearchMyInquiry] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [inquiryAnswer, setInquiryAnswer] = useState(null);
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const handleSearch = async () => {
        try{
            const response = await axios.get('/spring/mypage/myinquiry');
            setSearchMyInquiry(response.data.data.data);
        }catch(error){
            if(error.response.status == 403){
                alert("로그인을 해주세요.");
              }
        }
    }

    const handleInquiryAnswer = async (inquiryid) => {
        try{
            setLoading(true); // 데이터 로딩 시작
            // inquiryAnswer 상태 초기화
            setInquiryAnswer([]);

            const response = await axios.get('/spring/mypage/myinquiry_answer',{
                params:{
                    inquiryid: inquiryid
                }
            });
            setInquiryAnswer(response.data.data.data[0].inquirycntn);
        }catch(error){
            setInquiryAnswer("등록된 답변이 없습니다." );
        } finally {
            setLoading(false); // 데이터 로딩 완료
          }
    }
    

    const handleRowClick = (inquiryid) => {
        setSelectedRow(inquiryid === selectedRow ? null : inquiryid);
        handleInquiryAnswer(inquiryid);
    }

    useEffect(() => {
        handleSearch();
    }, []);
return(
    <div className="App">
      <Container style={{margin:'50px auto'}}>
        <div>
        <h5 style={{marginTop : '50px', marginBottom : '50px'}}>My 문의사항</h5>
        <Table bordered>
            <thead>
                <tr>
                    <th>No</th>
                    <th>제목</th>
                    <th>등록일</th>
                </tr>
            </thead>
            <tbody>
                {searchMyInquiry.map((item, index) => (
                    <React.Fragment key={index}>
                    <tr key={index} onClick={() => handleRowClick(item.inquiryid)}>
                    <td>{index + 1}</td>
                    <td>
                    <div>
                    {item.inquirynm}
                  </div>
                    </td>
                    <td><FormatDate dateString={item.regdt} /></td>
                  </tr>
                  {selectedRow === item.inquiryid && (
                    <tr>
                      <td colSpan="3">
                        <div>
                        {inquiryAnswer}
                        </div>
                      </td>
                    </tr>
                    )}
                    </React.Fragment>
                ))}
            </tbody>
        </Table>
        </div>
      </Container>
    </div>
)
}

export default MyInquiry;