import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineUser, AiOutlineMedicineBox } from 'react-icons/ai';
import { BsRobot } from 'react-icons/bs';
import { TbStethoscope } from 'react-icons/tb';
import { MdDashboard } from 'react-icons/md';
import commonContext from '../../contexts/common/commonContext';
import AccountForm from '../form/Accountform';
import { useNavigate } from 'react-router-dom';


const Header = () => {

    const { formUserInfo, toggleForm, userLogout } = useContext(commonContext);
    const [isSticky, setIsSticky] = useState(false);
    const navigate = useNavigate();

    // handle the sticky-header
    useEffect(() => {
        const handleIsSticky = () => window.scrollY >= 50 ? setIsSticky(true) : setIsSticky(false);

        window.addEventListener('scroll', handleIsSticky);

        return () => {
            window.removeEventListener('scroll', handleIsSticky);
        };
    }, [isSticky]);

    return (
        <>
            <header id="header" className={isSticky ? 'sticky' : ''}>
                <div className="container">
                    <div className="navbar">
                        <h2 className="nav_logo">
                            <Link to="/">Medicall</Link>
                        </h2>

                        {
                            (formUserInfo.username!==null && formUserInfo.username!=="")? (

                                <nav className="nav_actions">

                                    <div className="dash_action">
                                    <span onClick={() => navigate("/")}>
                                            <MdDashboard />
                                        </span>
                                        <div className="tooltip">Dashboard</div>
                                    </div>

                                    <div className="doctor_action">
                                        <span onClick={() => navigate("/doctors")}>
                                            <TbStethoscope />
                                        </span>
                                        <div className="tooltip">Doctors</div>
                                    </div>

                                    <div className="model_action">
                                        <span onClick={() => navigate("/disease-prediction")}>
                                            <BsRobot />
                                        </span>
                                        <div className="tooltip">Disease Prediction</div>
                                    </div>

                                    <div className="medicine_action">
                                        <span onClick={() => navigate("/buy-medicines")}>
                                            <AiOutlineMedicineBox />
                                            <span className="badge">20% off</span>
                                        </span>
                                        <div className="tooltip">Medicines</div>
                                    </div>

                                    <div className="user_action">
                                        <span>
                                            <AiOutlineUser />
                                        </span>
                                        <div className="dropdown_menu">
                                            <h4>Hello! {formUserInfo.username!=="" && <Link to="*">&nbsp;{formUserInfo.username}</Link>}</h4>
                                            <p>Have a great health!!</p>
                                            <button type="button" className='profile_btn' onClick={() => console.log(formUserInfo)}>
                                                Profile
                                            </button>
                                            <button type="button" className='logout_btn' onClick={() => userLogout()}>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </nav>
                            ) : (
                                <div>
                                    <button type="button" onClick={toggleForm} className='get_started_btn'>
                                        Get Started
                                    </button>
                                </div>
                            )
                        }

                    </div>
                </div>
            </header>

            {/* <SearchBar /> */}
            <AccountForm />
        </>
    );
};

export default Header;