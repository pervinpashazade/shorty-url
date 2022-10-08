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

    console.log('interceptor', error);

    if (!error?.response) {

      toast.error("Oh, no! Could not connect to server",)
      return
      // return Promise.reject(error);
    }
    else if (error.response.status === 400) {

      console.log('error.response.data', error.response.data);

      // toast.error("ERROR")

      return Promise.reject(error)
    }
    else if (error.response.status === 422) {
      toast.error(
        <div>
          {error.response.data.error.url[0]}
        </div>
      )

      return Promise.reject(error)
    } else if (error.response.status === 500) {
      toast.error(
        <div>
          Oh, no! {error.response.data.error.message}
        </div>
      )

      // return Promise.reject(error)
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