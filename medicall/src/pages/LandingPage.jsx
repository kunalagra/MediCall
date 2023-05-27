import React, { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useDocTitle from "../hooks/useDocTitle";
import { MdAccountCircle } from "react-icons/md";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { MdExpandMore } from 'react-icons/md';
import { AiFillLinkedin, AiFillGithub } from 'react-icons/ai';
import { IoMdMail } from "react-icons/io";
import { TbStethoscope, TbHeartPlus } from "react-icons/tb";
import { BsRobot } from "react-icons/bs";
import { GiMedicines } from "react-icons/gi";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { IoAccessibility } from "react-icons/io5";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";


const LandingPage = () => {

    const { isLoading, toggleLoading } = useContext(commonContext);

    useEffect(() => {
        toggleLoading(true);
        setTimeout(() => toggleLoading(false), 2000);
    }, []);

    useScrollDisable(isLoading);    

    useDocTitle();

    const navigate = useNavigate();

    const faqs = [
        {
            question: "What is Medicall?",
            answer: "It is the web application that connects patients to the right doctor or allow them to choose a doctor as per their need. It provides information about users, doctors, news, appointments, and prescriptions. It also allows users to create instant meetings with doctors, and buy medicines. It allows users to check their health status by using his/her symptoms."
        },
        {
            question: "Can we get a free account in Medicall and use all its features for free?",
            answer: "Yes, Ofcourse. You can use all the features provided by Medicall for free."
        },
        {
            question: "Can we book an appointment at any time?",
            answer: "Yes. You can book an appointment of a doctor if he/she is free at that time."
        },
        {
            question: "Is there a way to test our health?",
            answer: "Yes. You can test your health by a Model that predicts the disease probability in the future."
        },
        {
            question: "Can we purchase the medicines from here?",
            answer: "Yes. You can purchase the medicines from Medicall store."
        },
    ];

    if(isLoading) {
        return <Preloader />;
    }
    
    return (
        <>
        <div id="landing-page-bg"></div>
        <div id="landing-page">
            <section className="intro-section">
                <div className="curvy-img"></div>
                <div className="content">
                    <div className="text">
                        <h2>Take best quality treatments <br />and avoid health problems</h2>
                        <p>The art of medicine consists in amusing the patient while nature cures the disease. Treatment without prevention is simply unsustainable.</p>
                        {(localStorage.getItem("username") && localStorage.getItem("username")!=="undefined") && localStorage.getItem("usertype")==="patient" && 
                            <button onClick={() => navigate("/doctors")}>Appointment</button> }
                    </div>
                    <div className="doctor-img">
                        <img src="/doctor-image.png" alt="" />
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div><h2>Our Features</h2></div>
                <div className="features">
                    <div className="item">
                        <div className="img-div">
                            <div className="img first">
                                <TbStethoscope />
                            </div>
                        </div>
                        <h3>Qualified Doctors</h3>
                        <p>Live Video Call between doctor and patient and generating prescriptions.</p>
                    </div>
                    <div className="item">
                        <div className="img-div">
                            <div className="img second">
                                <BsRobot />
                            </div>
                        </div>
                        <h3>Disease Identification model</h3>
                        <p>You can test your health whether you have a possibility of disease or not.</p>
                    </div>
                    <div className="item">
                        <div className="img-div">
                            <div className="img third">
                                <GiMedicines />
                            </div>
                        </div>
                        <h3>Pharmacy integrated with stripe</h3>
                        <p>You can purchase medicines through our pharmacy store with stripe secured payments.</p>
                    </div>
                </div>

            </section>

            <section className="need-section">
                <div className="need-div">
                    <div className="img-div">
                        <img src="/why-img.png" alt="why" />
                    </div>
                    <div className="content">
                        <h2>Why do we need?</h2>
                        <ul>
                            <li>WHO recommends 44.5 doctors per 10,000 people but India has only 22 per 10k people so major supply demand mismatchIndia has 22.8 doctors for every 10K citizens, the half of what WHO recommends.</li>
                            <li>Also, local doctors may fail to provide  the best consultation as they lack expertise & experience.</li>
                            <li>Thus all-in-one online hospital was created. It offers a disease prediction system, pharmacy, and payments.</li>
                            <li>This platform provides access to quality healthcare from anywhere, improving healthcare outcomes and accessibility.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="benefits-section">
                <div className="content">
                    <h2>Our Benefits</h2>
                    <div className="benefits">
                        <div className="first">
                            <div className="icon"><MdOutlineHealthAndSafety /> </div>
                            <p>TeleHealth services</p>
                        </div>
                        <div className="second">
                            <div className="icon"><IoAccessibility /> </div>
                            <p>Convenience and accessibility</p>
                        </div>
                        <div className="third">
                            <div className="icon"><TbStethoscope /> </div>
                            <p>Online Appointment Booking</p>
                        </div>
                        <div className="fourth">
                            <div className="icon"><TbHeartPlus /> </div>
                            <p>Competitive advantage</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="team-section">
                <div className="team-div">
                    <div className="head"><h2>Meet Our Team</h2></div>
                    <div className="team">
                        <div className="item">
                            <div className="img-div">
                                <MdAccountCircle className="img"/>
                                <div className="contact-div">
                                    <div className="contact-icon"><IoMdMail /></div>
                                    <div className="contact-icon"><AiFillGithub /></div>
                                    <div className="contact-icon"><AiFillLinkedin /></div>
                                </div>
                            </div>
                            <h3>Kunal Agrawal</h3>
                            <p>Backend Developer</p>
                        </div>
                        <div className="item">
                            <div className="img-div">
                                <MdAccountCircle className="img"/>
                                <div className="contact-div">
                                    <div className="contact-icon"><IoMdMail /></div>
                                    <div className="contact-icon"><AiFillGithub /></div>
                                    <div className="contact-icon"><AiFillLinkedin /></div>
                                </div>
                            </div>
                            <h3>Ganesh Utla</h3>
                            <p>Frontend Developer</p>
                        </div>
                        <div className="item">
                            <div className="img-div">
                                <MdAccountCircle className="img"/>
                                <div className="contact-div">
                                    <div className="contact-icon"><IoMdMail /></div>
                                    <div className="contact-icon"><AiFillGithub /></div>
                                    <div className="contact-icon"><AiFillLinkedin /></div>
                                </div>
                            </div>
                            <h3>Deexith Madas</h3>
                            <p>Backend Developer</p>
                        </div>
                        <div className="item">
                            <div className="img-div">
                                <MdAccountCircle className="img"/>
                                <div className="contact-div">
                                    <div className="contact-icon"><IoMdMail /></div>
                                    <div className="contact-icon"><AiFillGithub /></div>
                                    <div className="contact-icon"><AiFillLinkedin /></div>
                                </div>
                            </div>
                            <h3>Aman Tiwari</h3>
                            <p>Frontend Developer</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="faq-section">
                <div className="faq-div">
                    <div className="img-div">
                        <img src="faq-img.png" alt="faq" />
                    </div>
                    <div className="content">
                        <h2 className="head">Any Queries?</h2>
                        <div className="faqs">
                            {faqs.map((item, index) => (
                                <Accordion key={index} className="faq-item">
                                    <AccordionSummary
                                        expandIcon={<MdExpandMore className="icon" />}
                                        className="expand-icon"
                                    >
                                    <div className="item-qn">{item.question}</div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className="item-ans">{item.answer}</div>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
        </>
    )
}

export default LandingPage;