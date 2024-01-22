import React, { useEffect, useState } from 'react';
import axios from "axios";
import { isLoggedInAtom } from "../atom";
import { useRecoilValue } from "recoil";

const instance = axios.create({
    baseURL: "/spring",
    timeout: 1000,
})




export default instance;

