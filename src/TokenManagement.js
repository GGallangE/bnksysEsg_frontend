import React from 'react';
import { useRecoilState } from 'recoil';
import { tokenState } from './TokenState';

function TokenManagement() {
  const [token, setToken] = useRecoilState(tokenState);

  // 토큰을 저장하고 업데이트하는 함수
  const saveToken = (newToken) => {
    setToken(newToken);
  };

  // 토큰 삭제 함수
  const clearToken = () => {
    setToken(null);
  };

  return (
    <div>
      <p>현재 토큰: {token || '토큰이 없습니다'}</p>
      <button onClick={() => saveToken('새로운 JWT 토큰을 여기에 넣으세요')}>토큰 저장</button>
      <button onClick={clearToken}>토큰 삭제</button>
    </div>
  );
}

export default TokenManagement;