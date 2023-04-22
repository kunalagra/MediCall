import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import httpClient from "../httpClient";
import CheckoutForm from "./CheckoutForm";
import env from "../env";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(`${env.PUBLICATION_KEY}`);

export default function Checkout() {

  // const navigate = useNavigate(); 
  // const userNotExists = localStorage.getItem("usertype")===undefined || localStorage.getItem("usertype")===null;

  // useEffect(() => {
  //     if(userNotExists) {
  //         navigate("/");
  //     }
  //     //eslint-disable-next-line
  // }, []);

  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    console.log(`${env.PUBLICATION_KEY}`)
    httpClient.post("/create-payment-intent", {
      amount: localStorage.getItem("totalPrice"),
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.log(err);
      }
    );
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
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