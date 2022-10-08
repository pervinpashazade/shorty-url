import React, { useState } from 'react';
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
import logo from "./assets/img/logo.png"

const App = () => {

  const [switchStatus, setSwitchStatus] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    url: [],
  });

  const handleSubmit = e => {
    e.preventDefault();

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

    axios.post(config.apiURL + 'api/v1/shortlinks', {
      url: formData.url,
      provider: !switchStatus ? "bit.ly" : "TinyURL"
    }).then(res => {
      console.log('res', res);
    }).catch(err => {
      if (err.response?.status === 422) {
        setValidationErrors({
          url: err.response.data.error.url ? err.response.data.error.username : [],
        });
      }
    });

  }

  return (
    <div className="app-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-10">
            <div className="wrapper">
              <div className="box form-wrapper">
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
                <Form
                  className='row'
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
                <h1>Welcome</h1>
                <p>to <strong>Shortly URL</strong> shortener!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;