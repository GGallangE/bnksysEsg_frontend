import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ApiList from './Api/ApiList';
import Login from './User/Login';
import Register from './User/Register';
import { BrowserRouter, Route, Link, Routes, Router } from 'react-router-dom';
import DetailApi_Status from './Detail/DetailApiStatus';
import { RecoilRoot } from 'recoil';
import TokenManagement from './TokenManagement';
import Navigation from './Navigation';
import Main from './Main/Main';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
  <BrowserRouter>
  <Navigation />
  <Routes>
  <Route path="/" element={<Main />}/>
  <Route path="/detailapi/:apilistid" element={<DetailApi_Status />}/>
  <Route path="/signup" element={<Register />} />
  <Route path="/apilist" element={<ApiList />} />
  <Route path="/login" element={<Login />} />
  </Routes>
  </BrowserRouter>
  </RecoilRoot>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
