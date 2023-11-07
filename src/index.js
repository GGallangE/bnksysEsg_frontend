import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import App2 from './App2';
import App3 from './App3';
import Main from './Main';
import Login from './User/Login';
import Register from './User/Register';
import { BrowserRouter, Route, Link, Routes, Router } from 'react-router-dom';
import DetailApi_Status from './DetailApi_Status';
import { RecoilRoot } from 'recoil';
import TokenManagement from './TokenManagement';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
  <BrowserRouter>
  <Routes>
  <Route path="/" element={<Login />}/>
  <Route path="/detailapi/:apilistid" element={<DetailApi_Status />}/>
  <Route path="/signup" element={<Register />} />
  
  </Routes>
  </BrowserRouter>
  </RecoilRoot>

  
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
