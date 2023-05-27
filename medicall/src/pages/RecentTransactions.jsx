import React, { useContext, useEffect } from "react";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";
import Preloader from "../components/common/Preloader";

const RecentTransactions = () => {

    // Set this to real time transactions: 
    // Item Structure: {desc: <Description>, amount: <Transaction Amount>, add: <bool for recharged or charged>, date: <Date should in form of "16 May, 12:05 PM">}
    const transactions = [{desc: "Doctor Fee", amount: 299, add: false}, {desc: "Recharge", amount: 2000, add: true}, {desc: "Doctor Fee", amount: 499, add: false}];

    const { isLoading, toggleLoading } = useContext(commonContext);

    useScrollDisable(isLoading)

    useEffect(() => {
        toggleLoading(true);
        setTimeout(() => toggleLoading(false), 1500);
    }, []);

    if(isLoading) return <Preloader />;

    return (
        <div id="recent-transactions">
            <section className="transactions">
                <h3 className="head">Transaction History</h3>
                <div className="trans-list"> 
                    {
                        transactions.map((trans, index) => (
                            <div key={index} className="trans-item">
                                <div className="text">
                                    <p className="desc">{trans.desc}</p>
                                    <p>16 May, 12:05 PM</p>
                                    <div className="tooltip">{trans.desc}</div>
                                </div>
                                <div className={`amount ${trans.add? "add" : ""}`}>
                                    {trans.add? "+" : "-"} ₹ {trans.amount}</div>
                            </div>
                        ))
                    }
                </div>
            </section>
        </div>
    )
}

export default RecentTransactions;