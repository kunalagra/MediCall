import axios from "axios";
export default axios.create({
  withCredentials: true,
  accessControlAllowCredentials: true,
  credientials: "same-origin",
  headers: {
    "Content-type": "application/json",
    // "Authorization": "Bearer " + localStorage.getItem("token")
  },
  baseURL: "https://applied-flag-344105.uc.r.appspot.com"
});

