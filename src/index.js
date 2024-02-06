import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import ApiList from "./Api/ApiList";
import ApiApply from "./Apply/ApiApply";
import Notice from "./Information/Notice";
import NoticeDetailModal from "./Modal/NoticeDetailModal";
import Login from "./User/Login";
import Register from "./User/Register";
import UseCase from "./UseCase/UseCase";
import UseCaseDetail from "./UseCase/UseCaseDetail";
import UseCaseRgt from "./UseCase/UseCaseRgt";
import { BrowserRouter, Route, Link, Routes, Router } from "react-router-dom";
import DetailApi_Status from "./Api/DetailApiStatus";
import { RecoilRoot } from "recoil";
import TokenManagement from "./TokenManagement";
import Navigation from "./Navigation";
import InquiryRgt from "./Information/InquiryRgt";
import MyInterestData from "./MyPage/MyInterestData";
import MyInquiry from "./MyPage/MyInquiry";
import MyRecentUseData from "./MyPage/MyRecentUseData";
import MyApiApply from "./MyPage/MyApiApply";
import Main from "./Main/Main";
import MyApiSchedule from "./MyPage/MyApiSchedule";
import MyAlarm from "./MyPage/MyAlarm";
import AdminInquiry from "./Admin/AdminInquiry";
import NoticeRgt from "./Admin/NoticeRgt";
import AdminApiList from "./Admin/AdminApiList";
import ApplyApiList from "./Admin/ApplyApiList";
import Apikey from "./Admin/ApiKey";
import ComCode from "./Admin/ComCode";
import AdminApiRequest from "./Admin/AdminApiRequest";
import AdminApiResponse from "./Admin/AdminApiResponse";
import { isLoggedInAtom } from "./atom";
import { useRecoilValue } from "recoil";
import Loading from "./Component/Loading";
import instance from "./apiAxios/axios";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <RecoilRoot>
    <App>
    </App>
  </RecoilRoot>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
