import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineUser, AiOutlineMedicineBox } from 'react-icons/ai';
import { BsRobot } from 'react-icons/bs';
import { TbStethoscope } from 'react-icons/tb';
import { MdDashboard } from 'react-icons/md';
import commonContext from '../../contexts/common/commonContext';
import AccountForm from '../form/Accountform';
import { useNavigate } from 'react-router-dom';
import cartContext from '../../contexts/cart/cartContext';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import useOutsideClose from '../../hooks/useOutsideClose';
import httpClient from '../../httpClient';
import { RiFileList3Line } from "react-icons/ri";
import Profile from './Profile';


const Header = () => {

    const { toggleForm, userLogout, toggleProfile } = useContext(commonContext);
    const { cartItems } = useContext(cartContext);
    const [isSticky, setIsSticky] = useState(false);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    // handle the sticky-header
    useEffect(() => {
        const handleIsSticky = () => window.scrollY >= 50 ? setIsSticky(true) : setIsSticky(false);

        window.addEventListener('scroll', handleIsSticky);

        return () => {
            window.removeEventListener('scroll', handleIsSticky);
        };
    }, [isSticky]);

    const updatestatus = () => {
        httpClient.put('/doc_status', { "email": localStorage.getItem("email")});
            // .then((res) => {
            //     // console.log(res);
            // })
            // .catch((err) => {
            //     console.log(err);
            // })
        userLogout();
    }


    const dropdownRef = useRef();

    useOutsideClose(dropdownRef, () => setShowDropdown(false));

    return (
        <>
            <header id="header" className={isSticky ? 'sticky' : ''}>
                <div className="container">
                    <div className="navbar">
                        <h2 className="nav_logo">
                            <Link to="/">Medicall</Link>
                        </h2>

                        {
                            (localStorage.getItem("username")!==null && localStorage.getItem("username")!==undefined)? (

                                <nav className="nav_actions">

                                    <div className="dash_action">
                                        <span onClick={() => navigate("/home")}>
                                            <MdDashboard />
                                        </span>
                                        <div className="tooltip">Home</div>
                                    </div>

                                    {localStorage.getItem("usertype")==="patient" && 
                                        <div className="doctor_action">
                                            <span onClick={() => navigate("/doctors")}>
                                                <TbStethoscope />
                                            </span>
                                            <div className="tooltip">Doctors</div>
                                        </div>
                                    }

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
                                        <span onClick={() => setShowDropdown(!showDropdown)}>
                                            <AiOutlineUser />
                                        </span>
                                        <div className={`dropdown_menu ${showDropdown && "active"}`} ref={dropdownRef}>
                                            <h4>Hello! {localStorage.getItem("username")!==undefined && <span>&nbsp;{localStorage.getItem("username")}</span>}</h4>
                                            <p>Have a great health!!</p>
                                            <button type="button" className='profile_btn' onClick={() => {
                                                setShowDropdown(false);
                                                toggleProfile(true);
                                            }}>
                                                Profile
                                            </button>
                                            <button type="button" className='logout_btn' onClick={() => {
                                                setShowDropdown(false);
                                                localStorage.getItem("usertype") === "doctor" ? updatestatus() : userLogout()
                                                navigate("/");
                                            }}>
                                                Logout
                                            </button>
                                            <div className="separator"></div>
                                            <ul>
                                                <li>
                                                    <AiOutlineShoppingCart className='cart-icon' />
                                                    <Link to="/my-cart" onClick={() => setShowDropdown(false)}>My cart</Link>
                                                    <span className='cart_badge'>{cartItems.length}</span>
                                                </li>
                                                <li>
                                                    <RiFileList3Line className='cart-icon' />
                                                    <Link to="/my-orders" onClick={() => setShowDropdown(false)}>My Orders</Link>
                                                </li>
                                            </ul>
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

            <AccountForm />
            <Profile />
        </>
    );
};

export default Header;