import { useState, useEffect } from "react";
import Modal from '@mui/material/Modal';
import useDocTitle from "../hooks/useDocTitle";
import { IoMdClose } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";
import { Alert } from "@mui/material";
import { BsEmojiAngry, BsEmojiFrown, BsEmojiExpressionless, BsEmojiSmile, BsEmojiLaughing } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { HiOutlineLightBulb, HiUserGroup } from "react-icons/hi";
import { FaVideo } from "react-icons/fa";
import httpClient from "../httpClient";

const Home = () => {
    useDocTitle("Home");
    const navigate = useNavigate();

    const [haslastMeet, setHasLastMeet] = useState(localStorage.getItem("lastMeetWith")!==undefined && localStorage.getItem("lastMeetWith")!==null && localStorage.getItem("lastMeetWith")!=="null");
    const [feedbackRate, setFeedbackRate] = useState(3);
    const [feedbackAlert, setFeedbackAlert] = useState(false);
    const [searchPatient, setSearchPatient] = useState(false);
    const isDoctor = localStorage.getItem("usertype")==="doctor";
    // eslint-disable-next-line
    const [searching, setSearching] = useState(0); 
    const [patient_name, setPatient_name] = useState("");
    const [meetlink, setMeetlink] = useState("");
    const userNotExists = localStorage.getItem("usertype")===undefined || localStorage.getItem("usertype")===null;


    const handleFeedbackClose = () => {
        // TODO: fetch the data of the doctor name = <<localStorage.setItem("lastMeetWith")>>; and 
        // increase the <<noOfAppointments>> by 1 and increase the <<noOfStars>> by <<feedbackRate>>; 
        // then set the <<lastMeetWith>> in localStorage to null;

        httpClient.post('/doctor_app', {
            email: localStorage.getItem("lastMeetMail"),
            stars: feedbackRate
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
        localStorage.setItem("lastMeetWith", null);
        setHasLastMeet(false);

        setFeedbackAlert(true);
        setTimeout(() => {
            setHasLastMeet(false);
            setFeedbackAlert(false);
        }, 2000);
    };
    const ratings = ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"];

    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);

    useEffect(() => {
        // const now = new Date();
        // console.log(now);
        if(userNotExists) {
            navigate("/");
        }

        if(!userNotExists) {
            if (!isDoctor) {
            httpClient.post('/patient_apo', { email: localStorage.getItem('email') })
                .then((res) => {
                    // console.log(res.data);
                    setUpcomingAppointments(res.data.appointments);
                    setPastAppointments(res.data.appointments);
                })
                .catch((err) => {
                    console.log(err);
                })
            }
            else {
                httpClient.post('/set_appointment', { email: localStorage.getItem('email') })
                    .then((res) => {
                        setUpcomingAppointments(res.data.appointments);
                        setPastAppointments(res.data.appointments);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        }
        // eslint-disable-next-line
    }, []);

    const searchmeet = () => {
        setSearchPatient(true);
        setSearching(0);
        httpClient.post('make_meet', { email: localStorage.getItem('email') })
            .then((res) => {
                console.log(res.data);
                if (res.data.link===null) {
                    setTimeout(() => {
                        setSearching(1);
                    }, 1000);
                }
                else {
                    setPatient_name(res.data.link['name']);
                    setMeetlink(res.data.link['link']);
                    setTimeout(() => {
                        setSearching(2);
                    }, 2000);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }


    // const upcomingAppointments = [{date: "2023-04-18", time: "11:50", doctor: "Shiva", meet: "qwerty12345"}, {date: "2023-04-18", time: "06:00", doctor: "Aryan", meet: "qwerty12345"}];
    
    // const pastAppointments = [{date: "2023-04-17", time: "11:20", doctor: "Shiva", meet: "qwerty12345"}, {date: "2023-04-16", time: "06:00", doctor: "Aryan", meet: "qwerty12345"}];


    return (
        <>
            <div id="home-page">

                {isDoctor && (
                    <div className="is-meet-div">
                        <div className="meet-bg"></div>
                        <div className="main">
                            <div className="content-div">
                                <h2>Is there any patient waiting?</h2>
                                <p>Search for a patient now</p>
                            </div>
                            <div className="test-btn">
                                <button onClick={() => {
                                    httpClient.put("/meet_end", {"email": localStorage.getItem("email")})
                                    searchmeet()}}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                        <p> By {item.doctor ? item.doctor : item.patient}</p>
                                    </div>
                                    <button className="join-btn" disabled={!((new Date(item.date)===new Date()) && (new Date(item.date + " " + item.time)<=new Date()))} onClick={() => navigate(`/instant-meet/?meetId=${item.meet}&selectedDoc=${item.doctor}`)}>Join</button>
                                </li>
                            ))}
                            {upcomingAppointments.length===0 && <li className="appt-item"><div className="content">No appointments found...</div>{!isDoctor && <button className="join-btn" onClick={() => navigate('/doctors')}>Book</button>}</li>}
                        </ul>
                    </div>
                </div>

                <div className="past-appointments">
                    <h2>Past Appointments</h2>
                    <div className="main">
                        <ul>
                            {pastAppointments.map((item, index) => (
                                <li className="appt-item" key={index}>
                                    <div className="content">
                                        <p>{new Date(item.date + " " + item.time).toString().slice(0,3) + "," + new Date(item.date + " " + item.time).toString().slice(3, 16) + "at " + new Date(item.date + " " + item.time).toString().slice(16,21)},</p>
                                        <p> By {item.doctor ? item.doctor : item.patient}</p>
                                    </div>
                                    {!isDoctor && <button className="join-btn" onClick={() => {}}>Prescription</button>}
                                </li>
                            ))}
                            {pastAppointments.length===0 && <li className="appt-item"><div className="content">No appointments found...</div></li>}
                        </ul>
                    </div>
                </div>


                <div className="todays-tip">
                    <div className="head">
                        <HiOutlineLightBulb className="bulb-icon"/>
                        <h2>Healthy Tip of the Day</h2>
                    </div>
                    <div className="content">
                        <h3>Eat lots of fruit and veg</h3>
                        <p>It's recommended that you eat at least 5 portions of a variety of fruit and veg every day. They can be fresh, frozen, canned, dried or juiced.</p>
                        <p>A portion of fresh, canned or frozen fruit and vegetables is 80g. A portion of dried fruit (which should be kept to mealtimes) is 30g.</p>
                        <p>A 150ml glass of fruit juice, vegetable juice or smoothie also counts as 1 portion, but limit the amount you have to no more than 1 glass a day as these drinks are sugary and can damage your teeth.</p>
                    </div>
                </div>


            </div>
            <Modal
                open={haslastMeet && (!isDoctor)}
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
                open={haslastMeet && isDoctor}
                onClose={() => {
                    localStorage.setItem("lastMeetWith", null);
                    setHasLastMeet(false);
                }}
                >
                <div id="feedback-modal">
                    <div className="close_btn_div">
                        <IoMdClose onClick={() => {
                            localStorage.setItem("lastMeetWith", null);
                            setHasLastMeet(false);
                        }} />
                    </div>
                    <div className="doctor-feedback">
                        <h3>Thank You <BsEmojiSmile /> </h3>
                        <div className="thankyou-note">
                            Thank you, {localStorage.getItem("username")}!!<br /> You just threated one more life!
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                open={searchPatient}
                onClose={() => {
                    httpClient.put('/delete_meet', { email: localStorage.getItem("email")})
                    setSearchPatient(false)
                }}
                >
                <div id="search-patient-modal">
                    <div className="close_btn_div">
                        <IoMdClose onClick={() => {
                            httpClient.put('/delete_meet', { email: localStorage.getItem("email")})
                            setSearchPatient(false)}} />
                    </div>
                    {searching===0 && (
                        <div className="searching-div">
                            <div className="search-div">
                                <HiUserGroup className="patients-icon" />
                                <div className="circle">
                                    <div className="search-img-div">
                                        <img className="search-img" src="search-img.png" alt="searching" />
                                    </div>
                                </div>
                            </div>
                            <h3>Searching...</h3>
                        </div>
                    )}
                    {searching===1 && (
                        <div className="searching-div">
                            <div className="search-div">
                                <HiUserGroup className="patients-icon" />
                                <div className="done-icon-div">
                                    <IoCheckmarkDone className="done-icon" />
                                </div>
                            </div>
                            <h3>No Patients Found!</h3>
                        </div>
                    )}
                    {searching===2 && (
                        <div className="searching-div">
                            <h3>Patient Found!</h3>
                            <div className="connect-details">
                                <div>Name: {patient_name}</div>
                                <div className="connect-div">
                                    <button
                                     onClick={() => {
                                        httpClient.post("meet_status", {email: localStorage.getItem("email")})
                                        httpClient.put("/currently_in_meet", {email: localStorage.getItem("email")})
                                        .then(res => {
                                            setSearchPatient(false);
                                            navigate(`${meetlink}`);
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        })
                                        }}
                                    >Connect now <FaVideo /></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default Home;