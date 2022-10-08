import React from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

axios.interceptors.request.use(
  config => {
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

      // toast.error("ERROR")

      // return Promise.reject(error);
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
        toast.error("ERROR")
      }

      // // if(condition) resolve(response);

      return Promise.reject(error)
    });
  },
);