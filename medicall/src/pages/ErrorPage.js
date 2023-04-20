import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();

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