import React, { useState, useContext, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import httpClient from "../httpClient";
import CheckoutForm from "./CheckoutForm";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
// const stripePromise = loadStripe(`${process.env.REACT_APP_PUBLICATION_KEY}`);
const stripePromise = loadStripe(`${import.meta.env.VITE_PUBLICATION_KEY}`);

export default function Checkout() {

  const { isLoading, toggleLoading } = useContext(commonContext);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    // console.log(process.env.NODE_ENV)
    // console.log(`${process.env.REACT_APP_TITLE}`)
    toggleLoading(true);
    httpClient.post("/create-payment-intent", {
      amount: localStorage.getItem("totalPrice"),
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
        toggleLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toggleLoading(false);
      }
    );
  }, []);

  useScrollDisable(isLoading);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  if(isLoading) {
    return <Preloader />;
  };

  return (
    <div id="checkout">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}