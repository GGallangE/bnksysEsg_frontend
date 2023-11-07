import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { RecoilRoot, useRecoilValue, useRecoilState } from 'recoil';
//import TokenManagement from '../TokenManagement';
import { tokenState } from '../TokenState';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useRecoilState(tokenState);
  const tokenValue = useRecoilValue(tokenState);

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
      const jwtToken = response.data.data.token; // 서버에서 받은 토큰
      console.log(response.data.data.token);
      setToken(jwtToken); // Recoil 상태에 토큰 저장

      // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
		axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    } catch (error) {
      // 오류 처리
    }
    test();
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
          </form>
          <p className="mt-3">
            아직 계정이 없으신가요? <a href="/signup">회원가입</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
