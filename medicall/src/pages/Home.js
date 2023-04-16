import { useState } from "react";
import Modal from '@mui/material/Modal';
import useDocTitle from "../hooks/useDocTitle";
import { IoMdClose } from "react-icons/io";
import { Alert } from "@mui/material";
import { BsEmojiAngry, BsEmojiFrown, BsEmojiExpressionless, BsEmojiSmile, BsEmojiLaughing } from "react-icons/bs";

const Home = () => {
    useDocTitle("Home");
    const [haslastMeet, setHasLastMeet] = useState(localStorage.getItem("lastMeetWith") && !localStorage.getItem("lastMeetWith")==="null");
    const [feedbackRate, setFeedbackRate] = useState(3);
    const [feedbackAlert, setFeedbackAlert] = useState(false);
    const handleFeedbackClose = () => {
        localStorage.setItem("lastMeetWith", null);
        console.log(feedbackRate);
        setFeedbackAlert(true);
        setTimeout(() => {
            setHasLastMeet(false);
            setFeedbackAlert(false);
        }, 2000);
    };
    const ratings = ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"];


    return (
        <>
            <div id="home-page"></div>
            <Modal
                open={haslastMeet && (localStorage.getItem("usertype")==="patient")}
                onClose={handleFeedbackClose}
                >
                <div id="feedback-modal">
                    <div className="close_btn_div">
                        <IoMdClose onClick={handleFeedbackClose} />
                    </div>
                    <div className="feedback-details">
                        { feedbackAlert && <Alert severity="success">Thank you for your response</Alert>}
                        <h3>Feedback</h3>
                        <div className="consultation-qn">How was your consultation with {localStorage.getItem("lastMeetWith")}?</div>
                        <div className="ratings">
                            <div className="rating-icons">
                                <div className="icon" style={{color: `${feedbackRate===0? "red" : "grey"}`}} onClick={() => setFeedbackRate(0)}><BsEmojiAngry /></div>
                                <div className="icon" style={{color: `${feedbackRate===1? "red" : "grey"}`}} onClick={() => setFeedbackRate(1)}><BsEmojiFrown /></div>
                                <div className="icon" style={{color: `${feedbackRate===2? "orange" : "grey"}`}} onClick={() => setFeedbackRate(2)}><BsEmojiExpressionless /></div>
                                <div className="icon" style={{color: `${feedbackRate===3? "green" : "grey"}`}} onClick={() => setFeedbackRate(3)}><BsEmojiSmile /></div>
                                <div className="icon" style={{color: `${feedbackRate===4? "green" : "grey"}`}} onClick={() => setFeedbackRate(4)}><BsEmojiLaughing /></div>
                            </div>
                            <div className="rating-text">
                                {ratings[feedbackRate]}
                            </div>
                        </div>
                    </div>
                    <div className="submit-btn">
                        <button onClick={handleFeedbackClose} disabled={feedbackAlert}>{feedbackAlert? "Submitted" : "Submit" }</button>
                    </div>
                </div>
            </Modal>
            <Modal
                open={haslastMeet && (localStorage.getItem("usertype")==="doctor")}
                onClose={() => setHasLastMeet(false)}
                >
                <div id="feedback-modal">
                    <div className="close_btn_div">
                        <IoMdClose onClick={() => setHasLastMeet(false)} />
                    </div>
                    <div className="doctor-feedback">
                        <h3>Thank You <BsEmojiSmile /> </h3>
                        <div className="thankyou-note">
                            Thank you, {localStorage.getItem("username")}!!<br /> You just threated one more life!
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Home;