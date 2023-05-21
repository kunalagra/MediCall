import React, { useContext, useState, useEffect } from "react";
import useDocTitle from "../hooks/useDocTitle";
import EmptyView from "../components/cart/EmptyView";
import { useNavigate } from "react-router-dom";
import OrderedItem from "../components/orders/OrderedItem";
import httpClient from "../httpClient";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";


const MyOrders = () => {

    const { isLoading, toggleLoading } = useContext(commonContext);

    const navigate = useNavigate();
    const [orderedItems, setOrderedItems] = useState([]);

    useDocTitle("My Orders");

    useEffect(() => {
        toggleLoading(true);
        httpClient.post('/get_orders', {email: localStorage.getItem("email")})
        .then((res) => {
            setOrderedItems(res.data.orders.reverse());
            toggleLoading(false);
        })
        .catch((err) => {
            toggleLoading(false);
            console.log(err);
        });
    }, []);

    const orderedQuantity = orderedItems.length;
    const [viewAll, setViewAll] = useState(false);

    useScrollDisable(isLoading);

    if(isLoading) {
        return <Preloader />;
    }

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
