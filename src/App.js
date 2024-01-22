import React, { useEffect, useState, Suspense } from 'react';
import axios from "axios";
import { isLoggedInAtom } from "./atom";
import { useRecoilValue } from "recoil";
import ApiList from './Api/ApiList';
import ApiApply from './Apply/ApiApply';
import Notice from './Information/Notice';
import NoticeDetailModal from './Modal/NoticeDetailModal';
import Login from './User/Login';
import Register from './User/Register';
import UseCase from './UseCase/UseCase';
import UseCaseDetail from './UseCase/UseCaseDetail';
import UseCaseRgt from './UseCase/UseCaseRgt';
import { BrowserRouter, Route, Link, Routes, Router } from 'react-router-dom';
import DetailApi_Status from './Api/DetailApiStatus';
import { RecoilRoot } from 'recoil';
import TokenManagement from './TokenManagement';

import InquiryRgt from './Information/InquiryRgt';
import MyInterestData from './MyPage/MyInterestData';

import MyRecentUseData from './MyPage/MyRecentUseData';
import MyApiApply from './MyPage/MyApiApply';

import MyApiSchedule from './MyPage/MyApiSchedule';
import MyAlarm from './MyPage/MyAlarm';
import AdminInquiry from './Admin/AdminInquiry';
import NoticeRgt from './Admin/NoticeRgt';
import AdminApiList from './Admin/AdminApiList';
import ApplyApiList from './Admin/ApplyApiList';
import Apikey from './Admin/ApiKey';
import ComCode from './Admin/ComCode';
import AdminApiRequest from './Admin/AdminApiRequest';
import AdminApiResponse from './Admin/AdminApiResponse';
import Loading from './Component/Loading';
import instance from "./apiAxios/axios";
import useDidMountEffect from './hooks/useDidMountEffect';

const Navigation = React.lazy(() => import('./Navigation'));
const Main = React.lazy(() => import('./Main/Main'));
const MyInquiry = React.lazy(() => import('./MyPage/MyInquiry'));

function App(){
    const [loading, setLoading] = useState(false);
    const AxiosInterceptor = ({ children }) => {
    
      const isLoggedIn = useRecoilValue(isLoggedInAtom);

      useDidMountEffect( ()=>{const reqInterceptor = config => {
              
        config.headers['Authorization'] = `Bearer ${isLoggedIn}`;
        setLoading(true);
        
        return config;
    }

    const reqerrInterceptor = error => {
        console.log(error);
        return Promise.reject(error);
    }

    const resInterceptor = response => {
     
      setLoading(false);
      return response;
  }

  const reserrInterceptor = error => {
      console.log(error);
      return Promise.reject(error);
  }

  const reqinterceptor = axios.interceptors.request.use(reqInterceptor, reqerrInterceptor);
  const resinterceptor = axios.interceptors.response.use(resInterceptor, reserrInterceptor);

  return () => {
      debugger
      axios.interceptors.request.eject(reqinterceptor);
      axios.interceptors.response.eject(resinterceptor);
  };}, [isLoggedIn])

  
        
        return children;
    }

    return(
        <>
        <AxiosInterceptor>
        
            <BrowserRouter>
            <React.Suspense fallback={<Loading loading={loading} />}>
            <Navigation />
            
            <Routes>
            <Route path="/" element={<Main />}/>
            <Route path="/api/detailapi/:apilistid" element={<DetailApi_Status />}/>
            <Route path="/signup" element={<Register />} />
            <Route path="/information/notice" element={<Notice />} />
            <Route path="/information/noticeDetailModal/:noticeid" element={<NoticeDetailModal />} />
            <Route path="/information/inquiryregister" element={<InquiryRgt/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/openapi/apilist" element={<ApiList />} />
            <Route path="/openapi/apiapply" element={<ApiApply />} />
            <Route path="/openapi/usecase" element={<UseCase />} />
            <Route path="/openapi/usecasedetail/:usecaseid" element={<UseCaseDetail/>} />
            <Route path="/openapi/usecaseregister" element={<UseCaseRgt/>} />
            <Route path="/mypage/myinterestdata" element={<MyInterestData/>} />
            <Route path="/mypage/myinquiry" element={<MyInquiry/>} />
            <Route path="/mypage/myrecentusedata" element={<MyRecentUseData/>} />
            <Route path="/mypage/myapiapply" element={<MyApiApply/>} />
            <Route path="/mypage/myapirsv" element={<MyApiSchedule/>} />
            <Route path="/mypage/myalarm" element={<MyAlarm/>} />
            <Route path="/admin/inquiry" element={<AdminInquiry/>} />
            <Route path="/admin/noticergt" element={<NoticeRgt/>} />
            <Route path="/admin/apiapply" element={<ApplyApiList/>} />
            <Route path="/admin/apilist" element={<AdminApiList/>} />
            <Route path="/admin/apikey" element={<Apikey/>} />
            <Route path="/admin/comcode" element={<ComCode/>} />
            <Route path="/admin/adminapirequest" element={<AdminApiRequest/>} />
            <Route path="/admin/adminapiresponse" element={<AdminApiResponse/>} />
            </Routes>
            </React.Suspense>
            </BrowserRouter>
            <Loading loading={loading} />
            
            
            
            
            </AxiosInterceptor>
        </>
    );
}

export default App;