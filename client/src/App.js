import React, { useRef, useState } from 'react';
import './assets/bootstrap/bootstrap.scss';
import './assets/scss/style.scss';
import {
  Button,
  Form, Input, Label
} from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { config } from './config';
import { useSelector, useDispatch } from 'react-redux';
import { changeValue } from './store/action';
import Loader from "./components/Lib/Loader";
import { HashRouter, Link } from 'react-router-dom';

const App = () => {

  const isLoading = useSelector(store => store.isLoading);
  const dispatch = useDispatch();

  const [switchStatus, setSwitchStatus] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    url: [],
  });
  const [data, setData] = useState(null);

  const formRef = useRef();

  const handleSubmit = e => {
    e.preventDefault();

    if (data) setData(null)

    const form = new FormData(e.target);
    let formData = {};
    let errors = {
      url: [],
    }

    for (const [key, value] of form.entries()) {
      formData[key] = value.trim();
    };

    if (!formData.url) {
      toast.error('Opps, URL is required!');
      errors.url = [...errors.url, "This field is required"]
    }

    setValidationErrors(errors);

    if (errors.url.length) return;

    dispatch(changeValue('isLoading', 'action', true))

    const id = toast.loading("Please wait...");
    let toastConfig = {
      isLoading: false,
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: false,
      draggable: false,
      pauseOnHover: false,
      theme: 'dark'
    }

    axios.post(config.apiURL + 'api/v1/shortlinks', {
      url: formData.url,
      provider: !switchStatus ? "bitly" : "tinyurl"
    })
      .then(res => {
        if (res.data.success) {
          setData(res.data.data)
          toast.update(id, {
            render: "Yeah, Successfully created!",
            type: "success",
            ...toastConfig,
          })
          // formRef.current.reset();
        }
      })
      .catch(err => {

        if (err.response?.status === 400) {
          toast.update(id, {
            render: `Opps, ${err.response?.data?.message}`,
            type: "error",
            ...toastConfig,
          })
        } else if (err.response?.status === 422) {
          setValidationErrors({
            url: err.response.data.error.url ? err.response.data.error.username : [],
          });
          toast.update(id, {
            render: "Opps, not completed!",
            type: "error",
            ...toastConfig,
          })
        } else {
          toast.update(id, {
            render: "Sorry, error ocoured!",
            type: "error",
            ...toastConfig,
          })
        }
      }).finally(() => dispatch(changeValue('isLoading', 'action', false)))
  }

  const resetState = () => {
    setData(null)
    setSwitchStatus(false)
    formRef.current.reset();
  }

  return (
    <HashRouter>
      <div className="app-container">
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='dark'
        />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 col-lg-10">
              <div className="wrapper">
                <div className="box form-wrapper">
                  <Form
                    className='row'
                    innerRef={formRef}
                    onSubmit={e => handleSubmit(e)}
                  >
                    <div className="col-12 mb-4">
                      <Label for='url'>
                        URL
                        {
                          validationErrors.url.length > 0 &&
                          <span className='text-danger ml-1'>*</span>
                        }
                      </Label>
                      <Input
                        id='url'
                        name='url'
                        onChange={() => {
                          if (validationErrors.url.length) {
                            setValidationErrors(prevState => {
                              return {
                                ...prevState,
                                url: []
                              }
                            })
                          }
                        }}
                        placeholder='https://example.com/JohnDoe'
                      />
                      {
                        validationErrors.url.length > 0 &&
                        <div className='validation-errors'>
                          {
                            validationErrors.url.map((item, index) => <span key={index}>{item}</span>)
                          }
                        </div>
                      }
                    </div>
                    <div className="col-12 mb-4">
                      <div className="d-flex align-items-center">
                        <span className={`${!switchStatus ? 'font-weight-bold' : ''}`}>Bit.ly</span>
                        <div className='d-flex mx-4'>
                          <input
                            id="toggle1"
                            name="switch"
                            type="checkbox"
                            className="ios-switch-btn"
                            onChange={e => setSwitchStatus(e.target.checked)}
                          />
                          <label htmlFor="toggle1"></label>
                        </div>
                        <span className={`${switchStatus ? 'font-weight-bold' : ''}`}>TinyURL</span>
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <Button
                        block
                        type='submit'
                        className='bg-primary'
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                </div>
                <div className="box detail-wrapper">
                  {
                    !isLoading.action ?
                      data ?
                        <>
                          <h1>Great, your link is ready!</h1>
                          <div className="text-center mt-3 mb-2">
                            <p className='text-left'>
                              URL:
                              <a
                                href={data.url}
                                target="_blank"
                                className="ml-1"
                              >
                                {data.url}
                              </a>
                            </p>
                            <p className='text-left'>
                              Link:
                              <a
                                href={data.link}
                                target="_blank"
                                className="ml-1 font-weight-bold"
                              >
                                {data.link}
                              </a>
                            </p>
                          </div>
                          <Button
                            size='sm'
                            color='link'
                            onClick={resetState}
                          >
                            Let's do it again ;)
                          </Button>
                        </>
                        :
                        <>
                          <h1>Welcome</h1>
                          <p>to <strong>Shortly URL</strong> shortener!</p>
                        </>
                      :
                      <Loader />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HashRouter>

  );
}

export default App;