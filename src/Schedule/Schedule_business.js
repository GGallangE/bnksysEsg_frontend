import axios from 'axios';
import React, { useEffect, useState, useRef  } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import FormatDate from '../Format/FormatDate'
import { Form, Modal, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import * as XLSX from "xlsx";
import { isLoggedInAtom } from '../atom'
import { useRecoilValue } from 'recoil';

function Schedule_business(props) {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [secondOptions, setSecondOptions] = useState([]);
  const [content, setContent] = useState('');
  const [businessmanArray, setBusinessmanArray] = useState([]);
  const [excelArray, setExcelArray] = useState([]);
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

  const clickRsv = () => {
    const array = content.split(',').map(item => item.trim());
    console.log(businessmanArray);
    setBusinessmanArray(excelArray.concat(array).map((item) => {
      return { "arg1": item };
    }));
  }

  useEffect(() => {
    if (isMounted.current) {
      const handleSchedule = async () => {
        console.log(businessmanArray);
        try {
          if(selectedFrequency === 'monthly'){
            const response = await axios.post('/spring/reservation/schedule', {
              apilistid: props.apilistid,
              frequency: selectedFrequency,
              time: selectedTime,
              dayofmonth: selectedDay,
              batchDetailargsDto: businessmanArray  
            }
          );
          alert(`${selectedFrequency} ${selectedDay} ${selectedTime}에 예약이 완료되었습니다.`);
          }else if (selectedFrequency === 'weekly'){
            const response = await axios.post('/spring/reservation/schedule', {
              apilistid: props.apilistid,
              frequency: selectedFrequency,
              time: selectedTime,
              dayofweek: selectedDay,
              batchDetailargsDto: businessmanArray
            }
          );
          alert(`${selectedFrequency} ${selectedDay} ${selectedTime}에 예약이 완료되었습니다.`);
        }else{
            const response = await axios.post('/spring/reservation/schedule', {
              apilistid: props.apilistid,
              frequency: selectedFrequency,
              time: selectedTime,
              batchDetailargsDto: businessmanArray
            } 
          );
          alert(`${selectedFrequency} ${selectedTime}에 예약이 완료되었습니다.`);
        }
        setBusinessmanArray([]);
        setExcelArray([]);
        setContent('');

        props.onHide();
      }catch (error) {
            if(error.response.status == 403){
              alert("로그인을 해주세요.");
            }
            console.log(error.response.data)
          } 
      };
      handleSchedule();
    } else{
      isMounted.current = true;
    }
    
  },[businessmanArray])
 

  const handleContent = (e) => {
    setContent(e.target.value);
  }

  const handleFileInputChange = (event) => {
    //파일이 선택되었을 때
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
      // 엑셀에서 데이터 추출
      const array = XLSX.utils.sheet_to_json(sheet).map(row => row['사업자 등록번호']); // '사업자 등록번호' 컬럼의 데이터만을 선택
      setExcelArray(array);
      console.log(array);
  };
  reader.readAsArrayBuffer(file);
    //setSelectedFile(file);
  }

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
          예약하기
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
            <Form.Select onChange={(e) => setSelectedDay(e.target.value)} disabled={selectedFrequency === 'daily'} >
              <option value="">선택하세요</option>
              {secondOptions.map((option, index) => (
                <option key={index} value={option}>
                  {selectedFrequency === 'monthly' ? option + '일' : selectedFrequency === 'weekly' ? getDayKorean(option) : option}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={3}>
            <Form.Select onChange={(e) => setSelectedTime(e.target.value)}>
              <option value="">선택하세요</option>
              {hours.map((hour) => (
                <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                {`${hour.toString().padStart(2, '0')}:00`}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <label htmlFor="content" style={{marginRight:'20px'}}>사업자번호: </label>
            <input type="text" id="content" name="content" onChange={handleContent} value={content} style={{ width: '600px' }} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col style={{ fontSize: '14px'}}>
           ',' 로 구분해 주세요. (예시) 0000000000, 1111111111
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Label>Excel파일 업로드</Form.Label>
            <Form.Control
              type="file"
              name="file"
              onChange={handleFileInputChange}  
              accept=".xlsx, .xls"            
            />
          </Col>
        </Row>
      </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={clickRsv}>예약</Button>
        <Button onClick={props.onHide}>닫기</Button>
      </Modal.Footer>
    </Modal>
        </div>
    );
  }

export default Schedule_business;