import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordCheckChange = (e) => {
    setPasswordCheck(e.target.value);
  };

  const handleRegister = async () => {
  try{
    const response = await axios.post('/spring/user/signup',{
    "username": username,
    "nickname": nickname,
    "email": email,
    "password": password,
    "passwordCheck": passwordCheck
    
  }).then(
    response => {
      console.log(1)
    }
  )
  if (response.data.success) {
    // 회원가입 성공
    console.log('회원가입 성공');
    navigate('/login');
  } else {
    // 회원가입 실패
    console.log('회원가입 실패');
    // console.log(response);
    // // 에러 메시지 표시
    // response.data.messages.forEach((message) => {
    //   console.log(message);
    // });
  }
  
  } catch (error){
      // 오류 처리
      if (error.response) {
        // 서버에서 오류 응답을 받았을 때
        console.log(1)
        //console.error('서버 오류:', error.response);
        // 사용자에게 오류 메시지를 보여줄 수 있습니다.
      } else if (error.request) {
        // 요청을 보내지 못한 경우
        console.error('요청 오류:', error.request);
      } else {
        // 다른 오류
        console.error('오류:', error.message);
      }
    };
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nickname" className="form-label">Nickname</label>
              <input
                type="text"
                className="form-control"
                id="nickname"
                value={nickname}
                onChange={handleNicknameChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordCheck" className="form-label">Password Check</label>
              <input
                type="password"
                className="form-control"
                id="passwordCheck"
                value={passwordCheck}
                onChange={handlePasswordCheckChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRegister}
            >
              회원가입
            </button>
          </form>
          <p className="mt-3">
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
