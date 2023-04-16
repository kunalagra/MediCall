import useDocTitle from "../hooks/useDocTitle";



const LandingPage = () => {

    useDocTitle();
    
    return (
        <div id="landing-page">
            <section className="intro-section">
                <div className="bg"></div>
                <div className="content">
                    <h2>MEDICALL</h2>
                    <p>Let's cure lives together</p>
                </div>
            </section>

            <section className="features-section">
                <div><h2>Our Features</h2></div>
                <div className="features">
                    <div className="item">
                        <h3>Live Video Calls</h3>
                        <p>Live Video Call between doctor and patient and generating prescriptions.</p>
                    </div>
                    <div className="item">
                        <h3>Disease Identification model</h3>
                        <p>You can test your health whether you have a possibility of disease or not.</p>
                    </div>
                    <div className="item">
                        <h3>Pharmacy integrated with stripe</h3>
                        <p>You can purchase medicines through our pharmacy store with stripe secured payments.</p>
                    </div>
                </div>

            </section>

            <section className="need-section">
                <div className="qn">
                    <h2>Why do we need?</h2>
                </div>
                <div className="ans">
                    <ul>
                        <li>WHO recommends 44.5 doctors per 10,000 people but India has only 22 per 10k people so major supply demand mismatchIndia has 22.8 doctors for every 10K citizens, the half of what WHO recommends.</li>
                        <li>Also, local doctors may fail to provide  the best consultation as they lack expertise & experience.</li>
                        <li>Thus all-in-one online hospital was created. It offers a disease prediction system, pharmacy, and payments.</li>
                        <li>This platform provides access to quality healthcare from anywhere, improving healthcare outcomes and accessibility.</li>
                    </ul>
                </div>
            </section>

            <section className="benefits-section">
                <div className="main">
                    <h2>Benefits</h2>
                    <div className="first">TeleHealth services</div>
                    <div className="second">Convenience and accessibility</div>
                    <div className="third">Online Appointment Booking</div>
                    <div className="fourth">Competitive advantage</div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage;