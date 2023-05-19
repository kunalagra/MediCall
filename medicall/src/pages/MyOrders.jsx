import React, { useContext, useState, useEffect } from "react";
import useDocTitle from "../hooks/useDocTitle";
import EmptyView from "../components/cart/EmptyView";
import { Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OrderedItem from "../components/orders/OrderedItem";
import httpClient from "../httpClient";

const MyOrders = () => {

    const navigate = useNavigate();
    const [orderedItems, setOrderedItems] = useState([]);

    useEffect(() => {
        httpClient.post('/get_orders', {email: localStorage.getItem("email")})
        .then((res) => {
            setOrderedItems(res.data.orders);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    // const orderedItems = [
    //     {
    //         id: 3,
    //         images: ["/medicines/prod1.jpg"],
    //         title: "Benadryl",
    //         price: 79,
    //         path: "/",
    //         quantity: 0,
    //       },
    //       {
    //         id: 5,
    //         images: ["/medicines/prod21.jpg"],
    //         title: "Farlin Bottle Safety Bag",
    //         price: 288,
    //         path: "/",
    //         quantity: 0,
    //       },
    //       {
    //         id: 6,
    //         images: ["/medicines/prod6.jpeg"],
    //         title: "Moxikind",
    //         price: 150,
    //         path: "/",
    //         quantity: 0,
    //       },
    //       {
    //         id: 7,
    //         images: ["/medicines/prod7.jpg"],
    //         title: "Kivokast",
    //         price: 88,
    //         path: "/",
    //         quantity: 0,
    //       },
    //       {
    //         id: 8,
    //         images: ["/medicines/prod8.jpg"],
    //         title: "Alecensa",
    //         price: 100,
    //         path: "/",
    //         quantity: 0,
    //       }
    // ];

    const orderedQuantity = orderedItems.length;
    const [viewAll, setViewAll] = useState(false);

    return (
        <>
            <section id="orders" className="section">
                <div className="container">
                    {orderedQuantity === 0 ? (
                        <EmptyView
                            msg="Your Cart is Empty"
                            link="/all-medicines"
                            btnText="Start Shopping"
                        />
                    ) : (
                        <div className="orders_wrapper">
                            <h2 className="orders_head">Recent Orders</h2>
                            <div className="ordered_items">
                                {
                                    viewAll? 
                                    orderedItems.map((item) => (
                                        <OrderedItem key={item.id} {...item} />
                                    )) : 
                                    orderedItems.slice(0,3).map((item) => (
                                        <OrderedItem key={item.id} {...item} />
                                    ))
                                }
                            </div>
                            <h3 className="view_all" onClick={() => setViewAll((prev) => !prev)}>
                                {viewAll? "show less" : "show more"}</h3>
                        </div>
                    )}
                </div>
                <div className="back_to_home_btn">
                    <button onClick={() => navigate("/")}>Back to Home</button>
                </div>
            </section>
        </>
    );
};

export default MyOrders;
