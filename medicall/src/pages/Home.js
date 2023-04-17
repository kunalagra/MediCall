import { useState } from "react";
import Modal from '@mui/material/Modal';
import useDocTitle from "../hooks/useDocTitle";
import { IoMdClose } from "react-icons/io";
import { Alert } from "@mui/material";
import { BsEmojiAngry, BsEmojiFrown, BsEmojiExpressionless, BsEmojiSmile, BsEmojiLaughing } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { HiOutlineLightBulb } from "react-icons/hi";

const Home = () => {
    useDocTitle("Home");
    const [haslastMeet, setHasLastMeet] = useState(localStorage.getItem("lastMeetWith")!==undefined && localStorage.getItem("lastMeetWith")!=="null");
    const [feedbackRate, setFeedbackRate] = useState(3);
    const [feedbackAlert, setFeedbackAlert] = useState(false);
    const navigate = useNavigate();


    const handleFeedbackClose = () => {
        // TODO: fetch the data of the doctor name = <<localStorage.setItem("lastMeetWith")>>; and 
        // increase the <<noOfAppointments>> by 1 and increase the <<noOfStars>> by <<feedbackRate>>; 
        // then set the <<lastMeetWith>> in localStorage to null;
        
        localStorage.setItem("lastMeetWith", null);

        setFeedbackAlert(true);
        setTimeout(() => {
            setHasLastMeet(false);
            setFeedbackAlert(false);
        }, 2000);
    };
    const ratings = ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"];


    const upcomingAppointments = [{date: "2023-04-18", time: "11:50", doctor: "Shiva", meet: "qwerty12345"}, {date: "2023-04-18", time: "06:00", doctor: "Aryan", meet: "qwerty12345"}];
    
    // const pastAppointments = [{date: "2023-04-17", time: "11:20", doctor: "Shiva", meet: "qwerty12345"}, {date: "2023-04-16", time: "06:00", doctor: "Aryan", meet: "qwerty12345"}];


    return (
        <>
            <div id="home-page">

                <div className="dis-pred-test-div">
                    <div className="test-bg"></div>
                    <div className="main">
                        <div className="content-div">
                            <h2>Feeling Dizzy?</h2>
                            <p>Test your health now</p>
                        </div>
                        <div className="test-btn">
                            <button onClick={() => navigate('/disease-prediction')}>
                                Test now
                            </button>
                        </div>
                    </div>
                </div>


                <div className="upcoming-appointments">
                    <h2>Upcoming Appointments</h2>
                    <div className="main">
                        <ul>
                            {upcomingAppointments.map((item, index) => (
                                <li className="appt-item" key={index}>
                                    <div className="content">
                                        <p>{new Date(item.date + " " + item.time).toString().slice(0,3) + "," + new Date(item.date + " " + item.time).toString().slice(3, 16) + "at " + new Date(item.date + " " + item.time).toString().slice(16,21)},</p>
                                        <p> By Dr. {item.doctor}</p>
                                    </div>
                                    <button className="join-btn" disabled={new Date(item.date + " " + item.time) < new Date()} onClick={() => navigate(`/instant-meet/?meetId=${item.meet}&selectedDoc=${item.doctor}`)}>Join</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="past-appointments">
                    <h2>Past Appointments</h2>
                    <div className="main">
                        <ul>
                            {upcomingAppointments.map((item, index) => (
                                <li className="appt-item" key={index}>
                                    <div className="content">
                                        <p>{new Date(item.date + " " + item.time).toString().slice(0,3) + "," + new Date(item.date + " " + item.time).toString().slice(3, 16) + "at " + new Date(item.date + " " + item.time).toString().slice(16,21)},</p>
                                        <p> By Dr. {item.doctor}</p>
                                    </div>
                                    <button className="join-btn" onClick={() => {}}>Prescription</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


                <div className="todays-tip">
                    <div className="head">
                        <HiOutlineLightBulb className="bulb-icon"/>
                        <h2>Healthy Tip of the Day</h2>
                    </div>
                    <div className="content">
                        <h4>Eat lots of fruit and veg</h4>
                        <p>It's recommended that you eat at least 5 portions of a variety of fruit and veg every day. They can be fresh, frozen, canned, dried or juiced.</p>
                        <p>A portion of fresh, canned or frozen fruit and vegetables is 80g. A portion of dried fruit (which should be kept to mealtimes) is 30g.</p>
                        <p>A 150ml glass of fruit juice, vegetable juice or smoothie also counts as 1 portion, but limit the amount you have to no more than 1 glass a day as these drinks are sugary and can damage your teeth.</p>
                    </div>
                </div>


            </div>
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