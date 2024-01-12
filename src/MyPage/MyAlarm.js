import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate';
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';
import MyAlarmDetail from '../Modal/MyAlarmDetail';


function MyAlarm() {
    const [searchMyAlarm, setSearchMyAlarm] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const isLoggedIn = useRecoilValue(isLoggedInAtom);
    axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

    const handleSearch = async () => {
        try {
            const response = await axios.get('/spring/mypage/myalarm');
            setSearchMyAlarm(response.data.data.data);
        } catch (error) {
            if (error.response.status == 403) {
                alert("로그인을 해주세요.");
            }
        }
    }

    const handleTitleClick = (item) => {
        setSelectedItem(item.alarmid);
        setModalShow(true);
    };

    useEffect(() => {
        handleSearch();
    }, [])

    return (
        <div className="App">
            <Container style={{ margin: '100px auto' }}>
                <div>
                    <h5 style={{ marginTop: '50px', marginBottom: '50px' }}>MY 알림</h5>
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
                                    <div class="th-writer">
                                        <span>작성자</span>
                                    </div>
                                    <div class="th-date">
                                        <span>수신일시</span>
                                    </div>
                                </li>
                                {searchMyAlarm.map((item, index) => (
                                    <li class="tr" key={index}>
                                        <div class="td-num">{index + 1}</div>
                                        <div
                                            class="td-tit"
                                            onClick={() => handleTitleClick(item)}
                                            style={{
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                                fontWeight: item.readCheck ? 'normal' : 'bold',
                                                color: item.readCheck ? 'grey' : 'black',
                                            }}
                                        >
                                            {item.title}
                                        </div>
                                        <div class="td-writer">{item.sendusername}</div>
                                        <div class="td-date"><FormatDate dateString={item.regdt} /></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
            <MyAlarmDetail
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                    handleSearch();
                }}
                selectedItem={selectedItem}
            />
        </div>
    );
}
export default MyAlarm;