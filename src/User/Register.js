import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

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
    // 회원가입 로직을 작성하면 됩니다.
    // 이 예제에서는 간단하게 입력된 정보를 콘솔에 출력합니다.
    console.log('Username:', username);
    console.log('Nickname:', nickname);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('PasswordCheck:', passwordCheck);

    try{
        

    }catch(e){
        setError(e);
    }
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
            이미 계정이 있으신가요? <Link to="/">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
