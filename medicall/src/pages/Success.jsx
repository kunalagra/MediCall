import React, { useContext, useState } from "react";
import { CircularProgress } from "@mui/material";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import httpClient from "../httpClient";
import cartContext from "../contexts/cart/cartContext";

const Success = () => {

  
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  const { removeItem } = useContext(cartContext);

  const remove = (id) => {
    httpClient.post('/delete_cart', {email: localStorage.getItem("email"), id: id})
}

  window.onload = () => {
    if (localStorage.getItem("wallet") === "true") {
      setTimeout(() => {
        setActive(true);
        setTimeout(() => {
          httpClient.post('/wallet', {email: localStorage.getItem("email"), walletAmount: localStorage.getItem("totalPrice")})
          httpClient.post('/add_wallet_history', {email: localStorage.getItem("email"), 
          history: {desc: "Recharge", amount: Number(localStorage.getItem("totalPrice")), date: new Date().toLocaleString(), add: true}})
          navigate("/my-wallet");
          localStorage.removeItem("wallet");
        }, 3000);
      }, 1000);
    }
    else {
      // console.log("25")
    setTimeout(() => {
      setActive(true);
      // console.log(localStorage.getItem("orders"))
      setTimeout(() => {
        httpClient.post('/add_order', {orders: JSON.parse(localStorage.getItem("orders")), email: localStorage.getItem("email")})
        console.log(JSON.parse(localStorage.getItem("orders")));
        JSON.parse(localStorage.getItem("orders")).forEach(item => {
          removeItem(item.id);
          remove(item.id);
        });
        navigate("/my-orders");
      }, 3000);
    }, 1000);
  }
  };

  // useEffect(() => {
  //   if (localStorage.getItem("wallet") === "true") {
  //     setTimeout(() => {
  //       setActive(true);
  //       setTimeout(() => {
  //         httpClient.post('/wallet', {email: localStorage.getItem("email"), walletAmount: localStorage.getItem("totalPrice")})
  //         httpClient.post('/add_wallet_history', {email: localStorage.getItem("email"), 
  //         history: {desc: "Recharge", amount: Number(localStorage.getItem("totalPrice")), date: new Date().toLocaleString(), add: true}})
  //         navigate("/my-wallet");
  //         localStorage.removeItem("wallet");
  //       }, 3000);
  //     }, 1000);
  //   }
  //   else {
  //     // console.log("25")
  //   setTimeout(() => {
  //     setActive(true);
  //     // console.log(localStorage.getItem("orders"))
  //     setTimeout(() => {
  //       httpClient.post('/add_order', {orders: JSON.parse(localStorage.getItem("orders")), email: localStorage.getItem("email")})
  //       navigate("/my-orders");
  //     }, 3000);
  //   }, 1000);
  // }
  // }, []);
  
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
