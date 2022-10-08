export const config = process.env.NODE_ENV === 'production' ? {
  apiURL: "http://localhost:5000/"
} : {
  apiURL: "http://localhost:5000/"
}

export const toast_config = {
  position: "top-center",
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