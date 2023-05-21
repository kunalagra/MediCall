import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";

const ErrorPage = () => {

    const { isLoading, toggleLoading } = useContext(commonContext);

    const navigate = useNavigate();

    useEffect(() => {
        toggleLoading(true);
        setTimeout(() => toggleLoading(false), 1000);
        //eslint-disable-next-line
    }, []);

    useScrollDisable(isLoading);

    if(isLoading) {
        return <Preloader />;
    }

    return (
        <div id="error-page">
            <div className="err-img">
                <img src="error-bg.png" alt="error-bg" />
            </div>
            <h2>OOPS! PAGE NOT FOUND</h2>
            <div className="err-content">
                Sorry, the page you're looking for doesn't exist. Let's get you back on track.
            </div>
            <div className="back-btn">
                <button onClick={() => navigate("/")}>Back to Home</button>
            </div>
        </div>
    );
}

export default ErrorPage;