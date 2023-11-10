import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useRecoilValue, useRecoilState } from 'recoil';
//import TokenManagement from '../TokenManagement';
import { tokenState } from '../TokenState';
import { useNavigate } from 'react-router-dom';
import { isLoggedInAtom } from '../atom'

function Login() {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useRecoilState(tokenState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const tokenValue = useRecoilValue(tokenState);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/spring/user/login',{
        "email": email,
        "password": password
      }); // 서버로 JWT 토큰 요청
      if(response.data.success){
        const jwtToken = response.data.data.token; // 서버에서 받은 토큰
        setToken(jwtToken); // Recoil 상태에 토큰 저장
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
        // 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
        setIsLoggedIn(true);

        navigate('/main');  // 로그인 성공 시 메인 페이지로 이동
      }else{
        setError(response.data.errors[0]);
      }
		} catch (error) {
      // 오류 처리
    if (error.response) {
      // 서버에서 오류 응답을 받았을 때
      console.error('서버 오류:', error.response.data);
    } else if (error.request) {
      // 요청을 보내지 못한 경우
      console.error('요청 오류:', error.request);
    } else {
      // 다른 오류
      console.error('오류:', error.message);
    }
    };
  };
  const test = async () => {
    try {
      const response = await axios.get('/spring/user/test',{
      });
    } catch (error) {
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form>
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              로그인
            </button>
            {error && <div>{error}</div>}
          </form>
          <p className="mt-3">
            아직 계정이 없으신가요? <a href="/signup">회원가입</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
