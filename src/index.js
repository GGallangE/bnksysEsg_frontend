import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ApiList from './Api/ApiList';
import ApiApply from './Apply/ApiApply';
import Notice from './Information/Notice';
import NoticeDetail from './Information/NoticeDetail';
import Login from './User/Login';
import Register from './User/Register';
import UseCase from './UseCase/UseCase';
import UseCaseDetail from './UseCase/UseCaseDetail';
import UseCaseRgt from './UseCase/UseCaseRgt';
import { BrowserRouter, Route, Link, Routes, Router } from 'react-router-dom';
import DetailApi_Status from './Api/DetailApiStatus';
import { RecoilRoot } from 'recoil';
import TokenManagement from './TokenManagement';
import Navigation from './Navigation';
import InquiryRgt from './Inquiry/InquiryRgt';
import InterestData from './MyPage/InterestData'
import MyInquiry from './MyPage/MyInquiry'
import RecentUseData from './MyPage/RecentUseData'
import Main from './Main/Main';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
  <BrowserRouter>
  <Navigation />
  <Routes>
  <Route path="/" element={<Main />}/>
  <Route path="/api/detailapi/:apilistid" element={<DetailApi_Status />}/>
  <Route path="/signup" element={<Register />} />
  <Route path="/openapi/apilist" element={<ApiList />} />
  <Route path="/openapi/apiapply" element={<ApiApply />} />
  <Route path="/information/notice" element={<Notice />} />
  <Route path="/information/noticeDetail/:noticeid" element={<NoticeDetail />} />
  <Route path="/login" element={<Login />} />
  <Route path="/openapi/usecase" element={<UseCase />} />
  <Route path="/openapi/usecasedetail" element={<UseCaseDetail/>} />
  <Route path="/openapi/usecaseregister" element={<UseCaseRgt/>} />
  <Route path="/information/inquiryregister" element={<InquiryRgt/>} />
  <Route path="/mypage/interestdata" element={<InterestData/>} />
  <Route path="/mypage/myinquiry" element={<MyInquiry/>} />
  <Route path="/mypage/recentusedata" element={<RecentUseData/>} />
  </Routes>
  </BrowserRouter>
  </RecoilRoot>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
