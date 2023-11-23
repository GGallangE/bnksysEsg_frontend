import React, { useState, useEffect}  from 'react';
import { Table, Container } from 'react-bootstrap';
import axios from 'axios'
import FormatDate from '../Format/FormatDate'
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';
import LoginPopup from '../User/LoginPopup';

function MyInquiry(){
    const [searchMyInquiry, setSearchMyInquiry] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [inquiryAnswer, setInquiryAnswer] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const isLoggedIn= useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const handleSearch = async () => {
        try {
            const response = await axios.get('/spring/mypage/myinquiry');
            setSearchMyInquiry(response.data.data.data);
        } catch (error) {
            if (error.response.status === 403) {
                setShowLoginModal(true);
            }
        }
    }

    const handleInquiryAnswer = async (inquiryid) => {
        try {
            const response = await axios.get('/spring/mypage/myinquiry_answer', {
                params: {
                    inquiryid: inquiryid
                }
            });
            setInquiryAnswer(response.data.data.data[0].inquirycntn);
        } catch (error) {
            setInquiryAnswer("등록된 답변이 없습니다.");
        }
    }

    const handleRowClick = (inquiryid) => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        setSelectedRow(inquiryid === selectedRow ? null : inquiryid);
        handleInquiryAnswer(inquiryid);
    }

    const handleLoginModalClose = () => {
        setShowLoginModal(false);
    }

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <div className="App">
            <Container style={{ margin: '50px auto' }}>
                <div>
                    <h5 style={{ marginTop: '50px', marginBottom: '50px' }}>My 문의사항</h5>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>제목</th>
                                <th>등록일</th>
                                <th>답변 현황</th>
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
                                        <td>{item.replycount}</td>
                                    </tr>
                                    {selectedRow === item.inquiryid && (
                                    <tr>
                                        <td colSpan="4">
                                        <div>
                                            <strong>질문 내용:</strong> {item.inquirycntn}
                                        </div>
                                        <div>
                                        <strong>답변 상태:</strong> {item.replycount === 0 ? "답변중" : "답변완료"}
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

            {/* 로그인 모달 */}
            <LoginPopup show={showLoginModal} handleClose={handleLoginModalClose} />

        </div>
    );
}

export default MyInquiry;
