import FeaturedSlider from "../components/medicines/FeaturedProducts";
import TopProducts from "../components/medicines/TopProducts";

const BuyMedicines = () => {
    return (
        <div id="buy-medicines">
            <section className="home">
                <div className="home__container">
                    <div className="home__img-bg">
                        <img src="buy-medicines-banner.png" alt="" className="home__img"/>
                    </div>
    
                    <div className="home__data">
                        <h1 className="home__title">MEDICINES <br/> COLLECTION</h1>
                        <p className="home__description">
                            All medicines at one place...
                        </p>
                        <span className="home__price">Starting at <b>₹49</b> only</span>

                        <div className="home__btns">
                            <button className="home__button">
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