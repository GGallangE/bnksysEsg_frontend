import React, { useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { isLoggedInAtom } from './atom'

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const handleLoginLogout = () => {
    if(isLoggedIn)
    setIsLoggedIn(!isLoggedIn);
  };
  console.log(isLoggedIn);
    return(
        <div>
          <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
          <Navbar.Brand href="/">API_BNK</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">

            <NavDropdown title="OPEN API" id="basic-nav-dropdown">
              <NavDropdown.Item href="/ApiList">목록</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">API 신청하기</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">활용사례</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">데이터 시각화</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="이용안내" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">공지사항</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">문의하기</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="마이페이지" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">관심데이터</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">최근사용데이터</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">MY 문의사항</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">API 신청현황</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">API 예약현황</NavDropdown.Item>
            </NavDropdown>

          </Nav>
          <Nav.Link onClick={handleLoginLogout} href="login">
            {isLoggedIn ? "로그아웃" : "로그인"}
          </Nav.Link>
          </Navbar.Collapse>
          </Container>
          </Navbar>
        </div>
    );
}

export default Navigation;