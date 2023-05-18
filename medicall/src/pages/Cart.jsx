import React, { useContext, useState, useEffect } from "react";
import useDocTitle from "../hooks/useDocTitle";
import cartContext from "../contexts/cart/cartContext";
import CartItem from "../components/cart/CartItem";
import EmptyView from "../components/cart/EmptyView";
import { Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  useDocTitle("Cart");

  const navigate = useNavigate(); 
  const userNotExists = localStorage.getItem("usertype")===undefined || localStorage.getItem("usertype")===null;

  useEffect(() => {
      if(userNotExists) {
          navigate("/");
      }
      //eslint-disable-next-line
  }, []);

  const { cartItems, clearCart } = useContext(cartContext);
  
  const cartQuantity = cartItems.length;

  // total original price
  let cartTotal = 0;

  cartItems.forEach((item) => {
    cartTotal += item.price * item.quantity;
  });

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isAlert, setIsAlert] = useState(0);
  
  return (
    <>
      <section id="cart" className="section">
        <div className="container">
          {cartQuantity === 0 ? (
            <EmptyView
              // icon={<BsCartX />}
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
                  <button onClick={clearCart}>Clear Cart</button>
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
                      <b>₹ {cartTotal} /-</b>
                    </div>
                    <div className="separator"></div>
                    <div className="summary_note">
                      The subtotal reflects the total price of your order,
                      including duties and taxes, before any applicable
                      discounts. It does not include delivery costs and
                      international transaction fees.
                    </div>
                  </div>
                  <button
                    type="button"
                    method="post"
                    className={`btn checkout_btn ${
                      isCheckoutLoading && "active"
                    }`}
                    onClick={() => {
                      setIsCheckoutLoading(true);
                      setTimeout(() => {
                        localStorage.setItem("totalPrice", cartTotal);
                        navigate("/checkout");
                        setIsCheckoutLoading(false);
                        setIsAlert(2);
                      }, 2000);
                      
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
