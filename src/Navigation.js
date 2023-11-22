// Navigation.js
import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { isLoggedInAtom } from './atom';
import LoginPopup from './User/LoginPopup';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const navigate = useNavigate();

  const handleLoginLogout = () => {
    if (isLoggedIn !== '') {
      setIsLoggedIn('');
    } else {
      // 현재 URL 저장
      setRedirectUrl(window.location.pathname);
      setShowLoginModal(true);
    }
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleNavItemClick = (path) => {
    // 로그인이 필요한 페이지에 진입하기 전에 확인
    if (!isLoggedIn && (path.includes('/mypage') || path.includes('/OPENAPI/ApiApply'))) {
      // 현재 URL 저장
      setRedirectUrl(path);
      setShowLoginModal(true);
      return;
    }
    // 정상적으로 링크 이동
    navigate(path);
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

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary custom-navbar">
        <Container>
          <Navbar.Brand href="/">API_BNK</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto custom-nav">
              <NavDropdown title="OPEN API" id="basic-nav-dropdown" className='custom-nav'>
                <Nav className="flex-row">
                  <NavDropdown.Item onClick={() => handleNavItemClick('/OPENAPI/ApiList')}>목록</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/OPENAPI/ApiApply')}>API 신청하기</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/openapi/usecase')}>활용사례</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.4">데이터 시각화</NavDropdown.Item>
                </Nav>
              </NavDropdown>
              <NavDropdown title="이용안내" id="basic-nav-dropdown" className='custom-nav'>
                <Nav className="flex-row">  
                  <NavDropdown.Item onClick={() => handleNavItemClick('/Information/Notice')}>공지사항</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/Information/inquiryregister')}>문의하기</NavDropdown.Item>
                </Nav>
              </NavDropdown>
              <NavDropdown title="마이페이지" id="basic-nav-dropdown" className='custom-nav'>
                <Nav className="flex-row">
                  <NavDropdown.Item onClick={() => handleNavItemClick('/mypage/interestdata')}>관심데이터</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/mypage/recentusedata')}>최근사용데이터</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/mypage/myinquiry')}>MY 문의사항</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/mypage/apiapply')}>API 신청현황</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavItemClick('/mypage/apirsv')}>API 예약현황</NavDropdown.Item>
                </Nav>
              </NavDropdown>
            </Nav>
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
