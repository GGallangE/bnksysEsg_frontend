import React, { useState, useEffect } from 'react';
import { Table, Container, Spinner } from 'react-bootstrap';
import axios from 'axios'
import FormatDate from '../Format/FormatDate'
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';
import LoginPopup from '../User/LoginPopup';

function MyInquiry() {
    const [searchMyInquiry, setSearchMyInquiry] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [inquiryAnswer, setInquiryAnswer] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isLoggedIn = useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const handleSearch = async () => {
        try {
            const response = await axios.get('/spring/mypage/myinquiry');
            setSearchMyInquiry(response.data.data.data);
            console.log(response.data.data.data);
        } catch (error) {
            if (error.response.status === 403) {
                setShowLoginModal(true);
            }
        }
    }

    const handleInquiryAnswer = (item) => {
        if (item.replycount === 1) {
            setIsLoading(true);
            axios
                .get('/spring/mypage/myinquiry_answer', {
                    params: {
                        inquiryid: item.inquiryid,
                    },
                })
                .then((response) => {
                    setInquiryAnswer(response.data.data.data[0]);
                })
                .catch((error) => {
                    setInquiryAnswer("등록된 답변이 없습니다.");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setInquiryAnswer("등록된 답변이 없습니다.");
        }
    };


    const handleRowClick = (item) => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        setSelectedRow(item.inquiryid === selectedRow ? null : item.inquiryid);
        handleInquiryAnswer(item);
    }

    const handleLoginModalClose = () => {
        setShowLoginModal(false);
    }

    const handleLoginSuccess = () => {
        setShowLoginModal(false);
    };

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <div className="App">
            <Container style={{ margin: '100px auto' }}>
                <div>
                    <h1 style={{ marginTop: '50px', marginBottom: '50px' }}>My 문의사항</h1>
                    <div class="tb_w">
                        <div class="st_tb_w ">
                            <ul class="st_tb_col">
                                <li class="tr">
                                    <div class="th-num">
                                        <span>NO</span>
                                    </div>
                                    <div class="th-tit">
                                        <span>제목</span>
                                    </div>
                                    <div class="th-date">
                                        <span>등록일</span>
                                    </div>
                                    <div class="th-writer">
                                        <span>답변현황</span>
                                    </div>
                                </li>
                                {searchMyInquiry.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <li class="tr" key={index} onClick={() => handleRowClick(item)}>
                                            <div class="td-num">{index + 1}</div>
                                            <div class="td-tit">{item.inquirynm}</div>
                                            <div class="td-date"><FormatDate dateString={item.regdt} /></div>
                                            <div class="td-writer">{item.replycount === 0 ? "답변중" : "답변완료"}</div>
                                        </li>

                                        {selectedRow === item.inquiryid && (
                                            <tr>
                                                {isLoading ? (
                                                    // 스피너 표시
                                                    <td colSpan="4" style={{ textAlign: 'center' }}>
                                                        <Spinner animation="border" role="status" />
                                                    </td>)
                                                    : (
                                                        <td colSpan="4" style={{ textAlign: 'left' }}>

                                                            <div>
                                                                <strong>질문 내용:</strong>
                                                                <div style={{ marginTop: '20px' }}>{item.inquirycntn}</div>
                                                            </div>
                                                            <hr style={{ borderTop: '1px solid #ccc', marginBottom: '10px' }} />
                                                            {inquiryAnswer && item.replycount === 1 && (
                                                                <>
                                                                    <div>
                                                                        <strong>답변 제목:</strong> {inquiryAnswer.inquirynm}
                                                                    </div>
                                                                    <div style={{ float: 'right' }}>
                                                                        <strong>작성일:</strong> {inquiryAnswer.regdt && <FormatDate dateString={inquiryAnswer.regdt} />}
                                                                    </div>
                                                                    <br />
                                                                    <div>
                                                                        <strong>답변 내용:</strong>
                                                                        <div style={{ marginTop: '20px' }}>{inquiryAnswer.inquirycntn}</div>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {inquiryAnswer && item.replycount === 0 && (
                                                                <div>
                                                                    아직 답변 중입니다.
                                                                </div>
                                                            )}
                                                            {!inquiryAnswer && <p>Loading...</p>}
                                                        </td>
                                                    )}
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
            {/* 로그인 모달 */}
            <LoginPopup show={showLoginModal} handleClose={handleLoginModalClose} onLoginSuccess={handleLoginSuccess} />

        </div>
    );
}

export default MyInquiry;
