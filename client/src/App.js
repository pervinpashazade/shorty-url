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

const App = () => {

  const handleSubmit = e => {
    e.preventDefault();

    const form = new FormData(e.target);
    let formData = {};

    for (const [key, value] of form.entries()) {
      formData[key] = value.trim();
    };

    if (!formData.url) {
      toast.error('Opps, URL is required!', {
        position: "bottom-right",
        autoClose: 5000,
        newestOnTop: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        pauseOnFocusLoss: true,
        theme: 'dark',
      });
      return
    }

    axios.post(config.apiURL + 'api/v1/shortlinks', {
      url: formData.url,
      provider: "bit.ly"
    }).then(res => {
      console.log('res', res);
    })

  }

  return (
    <div className="app-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-10">
            <div className="wrapper">
              {/* p-md-4 p-lg-5 */}
              <div className="box form-wrapper">
                {/* <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme='dark'
                /> */}
                <ToastContainer />
                <Form
                  className='row'
                  onSubmit={e => handleSubmit(e)}
                >
                  <div className="col-12 mb-4">
                    <Label for='url'>URL</Label>
                    <Input
                      id='url'
                      name='url'
                      placeholder='Enter URL to shorten'
                    />
                  </div>
                  <div className="col-12 mb-4">
                    <div className="d-flex align-items-center">
                      <span className='font-weight-bold'>Bit.ly</span>
                      <div className='d-flex mx-4'>
                        <input
                          type="checkbox"
                          name="toggle1"
                          className="ios-switch-btn"
                          id="toggle1"
                        />
                        <label htmlFor="toggle1"></label>
                      </div>
                      <span>TinyURL</span>
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
              {/* p-md-4 p-lg-5 */}
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