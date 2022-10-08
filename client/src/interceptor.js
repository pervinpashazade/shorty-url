import React from "react";
import axios from 'axios';
// import { localStorageKeys } from "./config123";
import { store } from './store/store';
import { logout } from './store/action';
import { toast } from 'react-toastify';
import { message, renderErrorMessage } from './store/staticData';

axios.interceptors.request.use(
  config => {
    // const token = localStorage.getItem(localStorageKeys.token);
    // if (token && config.url.indexOf('auth') === -1) {
    //   config.headers['Authorization'] = 'Bearer ' + token;
    // }
    return config;
  }, error => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  }, error => {
    if (!error?.response) {

      toast.error("ERROR")

      return Promise.reject(error);
    }
    else if (error.response.status === 400) {

      console.log('error.response.data', error.response.data);

      // toast.notify(({ onClose }) => (
      //   <div className="alert alert-danger m-3">
      //     <h5>Xəta baş verdi!</h5>
      //     <p className="mb-0">
      //       {
      //         error.response.data.message ? error.response.data.message : '.'
      //       }
      //     </p>
      //   </div>), { position: "top-right", duration: 3000 });

      // toast.error("ERROR")

      return Promise.reject(error)
    }
    else if (error.response.status === 422) {

      console.log('test', error.response.data.error.url[0]);

      toast.error(
        <div>
          {error.response.data.error.url[0]}
        </div>
      )

      return Promise.reject(error)
    }

    return new Promise((resolve) => {

      if (error.response.status === 401) {
        // toast.notify(() => (
        //   <div className="alert alert-danger m-3">
        //     <h5>{message.error}</h5>
        //     <p className="mb-0">
        //       {renderErrorMessage(message.user_not_found)}
        //     </p>
        //   </div>), { position: "top-right", duration: message.duration }
        // );
        // const { dispatch } = store;
        // dispatch(logout());
        toast.error("ERROR")

      }

      // // if(condition) resolve(response);

      return Promise.reject(error)
    });
  },
);