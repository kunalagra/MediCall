import React, { useContext, useState, useEffect } from "react";
import useDocTitle from "../hooks/useDocTitle";
import cartContext from "../contexts/cart/cartContext";
import CartItem from "../components/cart/CartItem";
import EmptyView from "../components/cart/EmptyView";
import { Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import httpClient from "../httpClient";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";

const Cart = () => {

  const { isLoading, toggleLoading } = useContext(commonContext);

  useDocTitle("Cart");

  const navigate = useNavigate(); 
  const userNotExists = localStorage.getItem("usertype")===undefined || localStorage.getItem("usertype")===null;
  const [cart, setCart] = useState([]);
  const { cartItems, clearCart, placeOrder, setCartItems } = useContext(cartContext);

  useEffect(() => {
      if(userNotExists) {
          navigate("/");
      } else {
          toggleLoading(true);
          if (cart !== cartItems) {
            httpClient.post('add_to_cart', {email: localStorage.getItem("email"), cart: cartItems})
            .then((res) => {
              setCartItems(res.data.cart);
              setCart(res.data.cart);
              toggleLoading(false);
            })
            .catch((err) => { 
              console.log(err);
              toggleLoading(false);
            });
          }
      }
      //eslint-disable-next-line
  }, []);


  useScrollDisable(isLoading);
  
  const cartQuantity = cartItems.length;

  // total original price
  const [cartTotal, setCartTotal] = useState(0);

  // Set this to user's balance amount
  const [balance, setBalance] = useState(0);
  const [addBalance, setAddBalance] = useState(false);
  const [totalBalance, setTotalBalance] = useState(cartTotal);
  
  
  useEffect(() => {
    setCartTotal(0);
    setTotalBalance(0);
    cartItems.forEach((item) => {
      setCartTotal(prev => prev + (item.price * item.quantity));
      setTotalBalance(prev => prev + (item.price * item.quantity));  
    });
    // console.log(cartItems);
    httpClient.post('/get_wallet', {email: localStorage.getItem("email")})
    .then((res) => {
      setBalance(Number(res.data.wallet))
    });
  }, [cartItems]);

  
  // setTotalBalance(cartTotal);


  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isAlert, setIsAlert] = useState(0);

  const deleteAll = () => {
    httpClient.post('delete_all_cart', {email: localStorage.getItem("email")})
  }

  if(isLoading) {
    return <Preloader />;
  };
  
  return (
    <>
      <section id="cart" className="section">
        <div className="container">
          {cartQuantity === 0 ? (
            <EmptyView
              msg="Your Cart is Empty"
              link="/all-medicines"
              btnText="Start Shopping"
            />
          ) : (
            <div className="wrapper cart_wrapper">
              <div className="cart_left_col">
                {cartItems.map((item) => (
                  <CartItem key={item.id} {...item} />
                ))}
              </div>

              <div className="cart_right_col">
                <div className="clear_cart_btn">
                  <button onClick={() => {clearCart();deleteAll()} }>Clear Cart</button>
                </div>
                <div className="order_summary">
                  <h3>
                    Order Summary &nbsp; ( {cartQuantity}{" "}
                    {cartQuantity > 1 ? "items" : "item"} )
                  </h3>
                  <div className="order_summary_details">
                    <div className="total_price">
                      <b>
                        <small>SUBTOTAL</small>
                      </b>
                      <b>₹ {totalBalance} /-</b>
                    </div>
                    <div className="separator"></div>
                    <div className="summary_note">
                      The subtotal reflects the total price of your order,
                      including duties and taxes, before any applicable
                      discounts. It does not include delivery costs and
                      international transaction fees.
                    </div>
                  </div>

                  <div onClick={() => {
                    console.log(cartTotal);
                    if(!addBalance) {
                      if(cartTotal <= balance) {
                        setTotalBalance(0);
                      } else {
                        setTotalBalance(cartTotal - balance);
                      }
                    } else {
                      setTotalBalance(cartTotal);
                    }
                    setAddBalance(prev => !prev);
                  }} className="use-balance-div">
                    <input type="checkbox" checked={addBalance} onChange={() => {}}/>
                    <p>Use Wallet Money {`(₹ ${balance})`}</p>
                  </div>

                  <button
                    type="button"
                    method="post"
                    className={`btn checkout_btn ${
                      isCheckoutLoading && "active"
                    }`}
                    onClick={() => {
                      if (totalBalance===0){
                        httpClient.post('/debit_wallet', {email: localStorage.getItem("email"), walletAmount: cartTotal})
                        localStorage.setItem("totalPrice", cartTotal);
                        // cartItems.forEach((item) => {
                        //   placeOrder(item);
                        // });
                        localStorage.setItem("orders", JSON.stringify(cartItems))
                        window.location.href = "https://gfg-sfi.onrender.com/success";
                      }
                      else{
                        setIsCheckoutLoading(true);
                        httpClient.post('/debit_wallet', {email: localStorage.getItem("email"), walletAmount: balance})
                        setTimeout(() => {
                          localStorage.setItem("totalPrice", cartTotal);
                          cartItems.forEach((item) => {
                            placeOrder(item);
                          });
                          navigate("/checkout");
                          setIsCheckoutLoading(false);
                          setIsAlert(2);
                        }, 2000);
                      }
                      
                    }}
                  >
                    {isCheckoutLoading ? (
                      <CircularProgress size={24} sx={{ color: "#f5f5f5" }} />
                    ) : (
                      "Checkout"
                    )}
                  </button>

                  {isAlert !== 0 &&
                    (isAlert === 1 ? (
                      <Alert severity="error">
                        Error in ordering medicines
                      </Alert>
                    ) : (
                      <Alert severity="success">Order Successful</Alert>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Cart;
