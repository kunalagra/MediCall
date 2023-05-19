import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import httpClient from "../httpClient";

const Success = () => {


  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  window.onload = () => {
    setTimeout(() => {
      setActive(true);
      setTimeout(() => {
        httpClient.post('/add_order', {orders: JSON.parse(localStorage.getItem("orders")), email: localStorage.getItem("email")})
        navigate("/my-orders");
      }, 3000);
    }, 1000);
  };
  
  return (
    <div id="success">
      <div className={`tick-icon ${active? "active" : ""}`}>
        <IoCheckmarkDoneCircleOutline className="icon"/>
      </div>
      <div className="content">
        <h1>Payment Successful!!!</h1>
        <br></br>
        <h3>Thank you for choosing MEDICALL!</h3>
      </div>
      <div className="redirecting-div" onClick={() => setActive(prev => !prev)}>
        <CircularProgress size={24} />
        <p style={{marginLeft: "10px"}}>redirecting to orders page...</p>
      </div>
    </div>
  );
};
export default Success;
