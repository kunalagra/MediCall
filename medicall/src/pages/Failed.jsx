import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { BiErrorCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Failed = () => {

  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  window.onload = () => {
    setTimeout(() => {
      setActive(true);
      setTimeout(() => {
        navigate("/buy-medicines");
      }, 3000);
    }, 1000);
  };

  return (
    <div id="success">
      <div className={`tick-icon ${active? "active" : ""} failed`}>
        <BiErrorCircle className="icon"/>
      </div>
      <div className="content">
        <h1>Payment Failed!!!</h1>
        <br></br>
        <h3>Please Try Again!</h3>
      </div>
      <div className="redirecting-div" onClick={() => setActive(prev => !prev)}>
        <CircularProgress size={24} />
        <p style={{marginLeft: "10px"}}>redirecting to medicines page...</p>
      </div>
    </div>
  );
};
export default Failed;
