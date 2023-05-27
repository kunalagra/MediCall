import React, { useContext, useEffect, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import commonContext from "../contexts/common/commonContext";
import Preloader from "../components/common/Preloader";
import useScrollDisable from "../hooks/useScrollDisable";
import { CircularProgress } from "@mui/material";
import httpClient from "../httpClient";

const MyWallet = () => {

    const [canSeeMoney, setSeeMoney] = useState(false);

    // Set this to user's balance amount
    const [availableMoney, setAvailableMoney] = useState(0.00);
    const [searchparams] = useSearchParams();
    const [inputMoney, setInputMoney] = useState(searchparams.get("recharge")? searchparams.get("recharge") : "");
    const recommendedMoney = [1000, 1500, 2000];
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);

    // Set this to real time transactions: 
    // Item Structure: {desc: <Description>, amount: <Transaction Amount>, add: <bool for recharged or charged>, date: <Date should in form of "16 May, 12:05 PM">}
    // const transactions = [{desc: "Doctor Fee", amount: 299, add: false}, {desc: "Recharge", amount: 2000, add: true}, {desc: "Doctor Fee", amount: 499, add: false}];

    const { isLoading, toggleLoading } = useContext(commonContext);
    const [addingMoney, setAddingMoney] = useState(false);
    const [rechargeText, setRechargeText] = useState("Proceed to Topup");

    useScrollDisable(isLoading);

    useEffect(() => {
        httpClient.post("/get_wallet", {email: localStorage.getItem("email")})
        .then((res) => {
            setAvailableMoney(Number((res.data.wallet).toFixed(2)));
        })
        .catch((err) => {
            console.log(err);
        });
        httpClient.post("/get_wallet_history", {email: localStorage.getItem("email")})
        .then((res) => {
            setTransactions(res.data.wallet_history);
        }
        )
        .catch((err) => {
            console.log(err);
        }
        );
    }, [localStorage.getItem("wallet")]);

    useEffect(() => {
        setInputMoney(prev => displayMoney(prev));
        toggleLoading(true);
        setTimeout(() => toggleLoading(false), 1000);
    }, []);

    const displayMoney = (money) => {
        let k = 0;
        while (k < money.length && money[k]==="0") k++;
        let res = "";
        let i = 0; 
        for(let j = money.length-1; j >= k; j--) {
            if(money[j]===",") continue;
            if("1234567890".indexOf(money[j])===-1) return "";
            if(i===3) {
                res += ",";
                i = 0;
            }
            res += `${Number(money[j]) % 10}`;
            i += 1;
        };
        return res.split("").reverse().join("");
    };

    const handleClick = () => {
        let k = 0;
        while (k < inputMoney.length && inputMoney[k]==="0") k++;
        let res = 0;
        for(let j = k; j < inputMoney.length; j++) {
            if(inputMoney[j]===",") continue;
            res = res*10 + Number(inputMoney[j]);
        };
        setAddingMoney(true);
        setTimeout(() => {
            setAddingMoney(false);

            // This is temporarily adding money: Update this to add the money via checkout form
            //start
            localStorage.setItem("wallet", true)
            localStorage.setItem("totalPrice", res);
            navigate("/checkout");
            setTimeout(() => {
                setRechargeText("Successfully Recharged");
            }, 2000);
            //end

        }, 2000);
    };

    if(isLoading) return <Preloader />;

    return (
        <div id="my-wallet">
            <h2 className="main-head">My Wallet</h2>

            <section className="check-balance">
                <div className="bal-head">Available balance</div>
                { canSeeMoney? (
                    <div className="price">
                        <div>₹ {availableMoney}</div>
                        <div className="visibility" onClick={() => setSeeMoney(false)}><MdVisibilityOff /></div>
                    </div>
                ): (
                    <div className="price">
                        <div>₹ *****</div>
                        <div className="visibility" onClick={() => setSeeMoney(true)}><MdVisibility /></div>
                    </div>
                )}
            </section>
                
            <div className="seperator"></div>

            <section className="topup-wallet">
                <h3 className="head">Topup Wallet</h3>
                <div className="topup">
                    <div className="input-div">
                        <input type="text" value={inputMoney} 
                            onChange={(e) => setInputMoney(displayMoney(e.target.value))}
                            placeholder="Enter the amount"
                        />
                        <span className="unit">₹</span>
                    </div>

                    <div className="recommended-div">
                        <div className="head">Recommended</div>
                        <div className="rec-list">
                        { recommendedMoney.map((money, index) => (
                            <div key={index} className="rec-item" onClick={() => setInputMoney(displayMoney((money).toString()))}>
                                ₹ {displayMoney((money).toString())}</div>
                            ))
                        }
                        </div>
                    </div>

                    <button onClick={() => handleClick()} disabled={inputMoney==="" || addingMoney}>
                        {addingMoney ? 
                            <CircularProgress size={24} sx={{ color: "#f5f5f5" }} />
                            : rechargeText
                        }
                    </button>
                </div>
            </section>

            <div className="seperator"></div>

            <section className="transactions">
                <h3 className="head">Recent Transactions</h3>
                {
                    transactions.length > 0? (
                        <div className="trans-list"> 
                            {
                                transactions.map((trans, index) => (
                                    <div key={index} className="trans-item">
                                        <div className="text">
                                            <p className="desc">{trans.desc}</p>
                                            <p>{trans.date}</p>
                                            <div className="tooltip">{trans.desc}</div>
                                        </div>
                                        <div className={`amount ${trans.add? "add" : ""}`}>
                                            {trans.add? "+" : "-"} ₹ {trans.amount}</div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="no-trans">No transactions found...</div>
                    )
                }
                {transactions.length > 0 && 
                    <button className="view-all" onClick={() => navigate("/recent-transactions")}>View All</button>}
            </section>

        </div>
    )
}

export default MyWallet;