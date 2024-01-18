import React, { useEffect, useState } from 'react';
import axios from "axios";
import { isLoggedInAtom } from "../atom";
import { useRecoilValue } from "recoil";

const instance = axios.create({
    baseURL: "/spring",
    timeout: 1000,
})

const AxiosInterceptor = ({ children }) => {

    const isLoggedIn = useRecoilValue(isLoggedInAtom);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const reqInterceptor = config => {
            debugger
            config.headers['Authorization'] = `Bearer ${isLoggedIn}`;
            setLoading(true);
            return config;
        }

        const errInterceptor = error => {
            console.log(error);
            return Promise.reject(error);
        }


        const interceptor = instance.interceptors.request.use(reqInterceptor, errInterceptor);

        return () => instance.interceptors.request.eject(interceptor);

    }, [isLoggedIn])

    useEffect(() => {
        
        const resInterceptor = reponse => {
            debugger
            setLoading(false);
            return reponse;
        }

        const errInterceptor = error => {
            console.log(error);
            return Promise.reject(error);
        }


        const interceptor = instance.interceptors.response.use(resInterceptor, errInterceptor);

        return () => instance.interceptors.response.eject(interceptor);

    }, [isLoggedIn])

    return children;
}


export default instance;
export { AxiosInterceptor }
