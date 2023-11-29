import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import { Modal, Button, Form } from 'react-bootstrap';
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';
import FormatCode from '../Format/FormatCode';

function MyApiApplyDetail(props) {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [selectedDayM, setSelectedDayM] = useState(null);
  const [selectedDayW, setSelectedDayW] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [secondOptions, setSecondOptions] = useState([]);
  const batchlistid = props.selectedItem;
  const hours = Array.from({ length: 24 }, (_, index) => index); // 0부터 23까지의 숫자 배열 생성
  const isLoggedIn= useRecoilValue(isLoggedInAtom);
  const isMounted = useRef(false);
  axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

  const handleOptionChange = (e) => {
    const selectedFrequency = e.target.value;
    setSelectedFrequency(selectedFrequency);

    if(selectedFrequency === 'monthly'){
      setSecondOptions(Array.from({ length:31 }, (_, index) => `${index + 1}`));
    }else if (selectedFrequency === 'weekly'){
      setSecondOptions(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']);
    }else {
      setSecondOptions([]);
    }
  };

  const clickModify = () => {
    //시간 형식에 맞을 때만 실행
    if (parseInt(selectedHour, 10) < 23 && parseInt(selectedMinute, 10) < 59) {
    setSelectedTime(selectedHour + ":" + selectedMinute);
    }else{
      alert("올바른 시간을 입력하세요");
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      const handleSchedule = async () => {
        if(batchlistid!=null){
        try {
          const response = await axios.post('/spring/mypage/myapischedule/updatetime', {
              params : {
                  batchlistid : batchlistid,
                  frequency: selectedFrequency,
                  time: selectedTime,
                  dayofmonth: selectedDayM,
                  dayofweek: selectedDayW,
                  }
          });
          const freKorean = getFreKorean(selectedFrequency);
          //alert(`${freKorean} ${selectedDay}일 ${selectedTime}으로 수정이 완료되었습니다.`);

        setSelectedHour('');
        setSelectedMinute('');
        setSelectedDayM(null);
        setSelectedDayW(null);

        props.onHide();
      }catch (error) {
        alert(error.response.data.messages)
      }
    }
    };
      handleSchedule();
    } else{
      isMounted.current = true;
    }
  },[selectedTime])

  const handleHourChange = (e) => {
    setSelectedHour(e.target.value);
  };

  const handleMinuteChange = (e) => {
    setSelectedMinute(e.target.value);
  };

  const handleHourBlur = (e) => {
    const inputValue = e.target.value;
    // 한 자리일 때만 0을 붙여 두 자리로 만들기
    setSelectedHour((prevValue) => (inputValue.length === 1 ? `0${inputValue}` : inputValue));
  };

  const handleMinuteBlur = (e) => {
    const inputValue = e.target.value;
    // 한 자리일 때만 0을 붙여 두 자리로 만들기
    setSelectedMinute((prevValue) => (inputValue.length === 1 ? `0${inputValue}` : inputValue));
  };

  const handleClose = () =>{
    setSelectedHour('');
    setSelectedMinute('');
    props.onHide();
  };
 
  const getFreKorean = (frequency) => {
    switch (frequency) {
      case 'monthly':
        return '매달';
      case 'weekly':
        return '매주';
      case 'daily':
        return '매일';
      default:
        return '';
    }
  };

  const getDayKorean = (day) => {
    switch (day) {
      case 'MON':
        return '월';
      case 'TUE':
        return '화';
      case 'WED':
        return '수';
      case 'THU':
        return '목';
      case 'FRI':
        return '금';
      case 'SAT':
        return '토';
      case 'SUN':
        return '일';
      default:
        return '';
    }
  };

    return (
      <div>
      <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          예약 수정하기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Container>
        <Row className="mb-3">
          <Col xs={2} className="d-flex align-items-center"  style={{width:'104px'}}>
          예약일시:
          </Col>
          <Col xs={3}>
            <Form.Select onChange={handleOptionChange}>
              <option value="">선택하세요</option>
              <option value="monthly">매달</option>
              <option value="weekly">매주</option>
              <option value="daily">매일</option>
            </Form.Select>
          </Col>
          <Col xs={3}>
            <Form.Select onChange={(e) => {selectedFrequency === "monthly"? setSelectedDayM(e.target.value): setSelectedDayW(e.target.value)}} disabled={selectedFrequency === 'daily'} >
              <option value="">선택하세요</option>
              {secondOptions.map((option, index) => (
                <option key={index} value={option}>
                  {selectedFrequency === 'monthly' ? option + '일' : selectedFrequency === 'weekly' ? <FormatCode code="day" value={option} /> : option}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={3} className="d-flex align-items-center">
            <Form.Control
              style={{margin:'0px 10px'}}
              type="text"
              placeholder="00"
              value={selectedHour}
              onChange={handleHourChange}
              onBlur={handleHourBlur}  // onBlur 이벤트 추가
              onKeyDown={(e) => {
                // 숫자, Backspace 이외의 키 입력 방지 및 두 자리까지만 입력 허용
                if (
                  !(
                    (e.keyCode >= 48 && e.keyCode <= 57) ||
                    (e.keyCode >= 96 && e.keyCode <= 105) ||
                    e.keyCode === 8
                  ) ||
                  (e.target.value.length >= 2 && e.keyCode !== 8)
                ) {
                  e.preventDefault();
                }
              }}
              />:
              <Form.Control
              style={{margin:'0px 10px'}}
              type="text"
              placeholder="00"
              value={selectedMinute}
              onChange={handleMinuteChange}
              onBlur={handleMinuteBlur}  // onBlur 이벤트 추가
              onKeyDown={(e) => {
                // 숫자, Backspace 이외의 키 입력 방지 및 두 자리까지만 입력 허용
                if (
                  !(
                    (e.keyCode >= 48 && e.keyCode <= 57) ||
                    (e.keyCode >= 96 && e.keyCode <= 105) ||
                    e.keyCode === 8
                  ) ||
                  (e.target.value.length >= 2 && e.keyCode !== 8)
                ) {
                  e.preventDefault();
                }
              }}
              />
          </Col>
        </Row>
      </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={clickModify}>수정</Button>
        <Button onClick={handleClose}>닫기</Button>
      </Modal.Footer>
      </Modal>
        </div>
    );
  }

export default MyApiApplyDetail;