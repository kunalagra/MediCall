import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedSlider from "../components/medicines/FeaturedProducts";
import TopProducts from "../components/medicines/TopProducts";
import useDocTitle from "../hooks/useDocTitle";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";

const BuyMedicines = () => {

    const { isLoading, toggleLoading } = useContext(commonContext);

    useDocTitle("Buy Medicines");
    
    const navigate = useNavigate(); 
    const userNotExists = localStorage.getItem("usertype")===undefined || localStorage.getItem("usertype")===null;

    useEffect(() => {
        if(userNotExists) {
            navigate("/");
        } else {
            toggleLoading(true);
            setTimeout(() => toggleLoading(false), 1000);
        }
        //eslint-disable-next-line
    }, []);

    useScrollDisable(isLoading);

    if(isLoading) {
        return <Preloader />;
    }

    return (
        <div id="buy-medicines">
            <section className="home">
                <div className="home__container">
                    <div className="home__imgdiv">
                        <div className="home__imgdiv__bg">
                            <img src="buy-medicines-banner.png" alt="" className="home__img"/>
                            <div className="home__imgdiv__bg__design triangle-1"></div>
                            <div className="home__imgdiv__bg__design triangle-2"></div>
                            <div className="home__imgdiv__bg__design triangle-3"></div>
                            <div className="home__imgdiv__bg__design triangle-4"></div>
                            <div className="home__imgdiv__bg__design triangle-5"></div>
                        </div>
                    </div>
    
                    <div className="home__data">
                        <h1 className="home__title">MEDICINES <br/> COLLECTION</h1>
                        <p className="home__description">
                            All medicines at one place...
                        </p>
                        <span className="home__price">Starting at <b>₹49</b> only</span>

                        <div className="home__btns">
                            <button className="home__button" onClick={() => navigate("/all-medicines")}>
                                Discover
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="featured_section">
                <h2 className="section-header">Featured Medicines</h2>
                <FeaturedSlider />
            </section>
            <section className="latest_section">
                <h2 className="section-header">Latest Medicines</h2>
                <TopProducts />
            </section>
        </div>
    )
}

export default BuyMedicines;