// Navigation.js
import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { isLoggedInAtom } from './atom';
import LoginPopup from './User/LoginPopup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navigation.css';

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [userRoles, setUserRoles] = useState([]);
  const navigate = useNavigate();

  const handleLoginLogout = () => {
    if (isLoggedIn !== '') {
      setIsLoggedIn('');
    } else {
      navigate('/login');
    }
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleNavItemClick = (path) => {
    if (!isLoggedIn && (path.includes('/mypage') || path.includes('/OPENAPI/ApiApply'))) {
      // 현재 URL 저장
      setRedirectUrl(path);
      setShowLoginModal(true);
      return;
    }
    navigate(path);
  };

  const handleDropdownClose = (dropdownId) => {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.click();
    }
  };

  useEffect(() => {
    // URL에 따라 모달을 열지 확인
    const path = window.location.pathname;
    if (!isLoggedIn && (path.includes('/mypage') || path.includes('/OPENAPI/ApiApply'))) {
      // 현재 URL 저장
      setRedirectUrl(path);
      setShowLoginModal(true);
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    // 로그인 성공 시 저장한 URL로 이동
    if (redirectUrl) {
      navigate(redirectUrl);
      setRedirectUrl(''); // 리디렉션 후 초기화
    }
  };

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${isLoggedIn}`;

        const response = await axios.get('/spring/user/auth_check'); 
        if (response.data.success) {
          setUserRoles(response.data.roles);
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
        if (error.response && (error.response.status === 400 || !error.response.data.success)) {
          setUserRoles([]);
        }
      }
    };

    fetchUserRoles();
  }, [isLoggedIn]);

  console.log(userRoles);

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary custom-navbar">
        <Container>
          <Navbar.Brand href="/">API_BNK</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto custom-nav">
              <NavDropdown title="OPEN API" id="basic-nav-dropdown" className='custom-nav' onClick={() => handleDropdownClose('open-api-dropdown')}>
                <Nav className="flex-row">
                  <NavDropdown.Item onClick={() => handleNavItemClick('/OPENAPI/ApiList')}>목록</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/OPENAPI/ApiApply')}>API 신청하기</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/openapi/usecase')}>활용사례</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.4">데이터 시각화</NavDropdown.Item>
                </Nav>
              </NavDropdown>
              <NavDropdown title="이용안내" id="basic-nav-dropdown" className='custom-nav' onClick={() => handleDropdownClose('information-dropdown')}>
                <Nav className="flex-row">  
                  <NavDropdown.Item onClick={() => handleNavItemClick('/Information/Notice')}>공지사항</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/Information/inquiryregister')}>문의하기</NavDropdown.Item>
                </Nav>
              </NavDropdown>
              <NavDropdown title="마이페이지" id="basic-nav-dropdown" className='custom-nav' onClick={() => handleDropdownClose('mypage-dropdown')}>
                <Nav className="flex-row">
                  <NavDropdown.Item onClick={() => handleNavItemClick('/mypage/myinterestdata')}>관심데이터</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/mypage/myrecentusedata')}>최근사용데이터</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/mypage/myinquiry')}>MY 문의사항</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/mypage/myapiapply')}>API 신청현황</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/mypage/myapirsv')}>API 예약현황</NavDropdown.Item>
                </Nav>
              </NavDropdown>
              {userRoles.includes('ROLE_ADMIN') && (
                <NavDropdown title="관리자" id="basic-nav-dropdown" className='custom-nav' onClick={() => handleDropdownClose('admin-dropdown')}>
                  <Nav className="flex-row">
                    <NavDropdown.Item onClick={() => handleNavItemClick('/admin/apiapply')}>API 신청 관리</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleNavItemClick('/admin/apilist')}>API 목록 관리</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleNavItemClick('/admin/notice')}>공지사항 작성</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleNavItemClick('/admin/inquiry')}>문의사항 관리</NavDropdown.Item>
                  </Nav>
                </NavDropdown>
              )}
            </Nav>
            {isLoggedIn !== '' && (
                <Nav.Link onClick={() => handleNavItemClick('/mypage/myalarm')} className="custom-nav">
                  알림
                </Nav.Link>
              )}
            <Nav.Link onClick={handleLoginLogout} href="#">
              {isLoggedIn !== '' ? '로그아웃' : '로그인'}
            </Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <LoginPopup show={showLoginModal} handleClose={handleLoginModalClose} handleLoginSuccess={handleLoginSuccess} />
    </div>
  );
}

export default Navigation;
