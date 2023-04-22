import axios from "axios";
const url = (process.env.NODE_ENV === 'development' ? "http://127.0.0.1:5000" : "https://gfg-medicall-backend.onrender.com");

export default axios.create({
  withCredentials: true,
  accessControlAllowCredentials: true,
  credientials: "same-origin",
  headers: {
    "Content-type": "application/json",
    // "Authorization": "Bearer " + localStorage.getItem("token")
  },
  baseURL: url
});

