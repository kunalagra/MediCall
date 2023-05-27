import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import commonContext from '../../contexts/common/commonContext';
import AccountForm from '../form/Accountform';
import cartContext from '../../contexts/cart/cartContext';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import useOutsideClose from '../../hooks/useOutsideClose';
import httpClient from '../../httpClient';
import { RiFileList3Line } from "react-icons/ri";
import Profile from './Profile';
import { FiMail } from "react-icons/fi";
import { FiPhoneCall } from "react-icons/fi";
import { CiMenuFries } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";


const Header = () => {

    const { toggleForm, userLogout, toggleProfile } = useContext(commonContext);
    const { cartItems, setCartItems } = useContext(cartContext);
    const [isSticky, setIsSticky] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const curPath = location.pathname;
    const [showDropdown, setShowDropdown] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const windowWidth = window.innerWidth;
    const [isSideBarOpen, setSideBarOpen] = useState(false);

    // handle the sticky-header
    useEffect(() => {
        const handleIsSticky = () => window.scrollY >= 50 ? setIsSticky(true) : setIsSticky(false);
        const handleIsScrolled = () => window.scrollY >= 1 ? setIsScrolled(true) : setIsScrolled(false);

        window.addEventListener('scroll', handleIsSticky);
        window.addEventListener('scroll', handleIsScrolled);

        return () => {
            window.removeEventListener('scroll', handleIsSticky);
            window.removeEventListener('scroll', handleIsScrolled);
        };
        
    }, [isSticky, isScrolled]);

    const updatestatus = () => {
        httpClient.put('/doc_status', { "email": localStorage.getItem("email")});
        userLogout();
    }

    useEffect(() => {
        {(localStorage.getItem("email") && localStorage.getItem("email")!=="undefined") &&
        httpClient.post('/get_cart', { "email": localStorage.getItem("email")})
        .then((res) => {
            setCartItems(res.data.cart);
        })
        .catch((err) => {
            console.log(err);
        });}
    }, [localStorage.getItem("email")]);

    const dropdownRef = useRef();
    const sidebarRef = useRef();

    useOutsideClose(dropdownRef, () => setShowDropdown(false));
    useOutsideClose(sidebarRef, () => setSideBarOpen(false));

    return (
        <>
            {(localStorage.getItem("username") && localStorage.getItem("username")!=="undefined") && localStorage.getItem("usertype")==="patient" && 
             <div id='contact-header' className={`${isScrolled? "scrolled" : ""}`}>
                <div className='details'>
                    <Link to="/" className='contact-detail'>
                        <FiMail className='icon'/>
                        <p className='detail'>medicall489@gmail.com</p>
                    </Link>
                    <Link to="/" className='contact-detail'>
                        <FiPhoneCall className='icon'/>
                        <p className='detail'>+91 00000 12345</p>
                    </Link>
                </div>
                <div>
                    <Link to="/doctors" className='appt-link'>Appointment</Link>
                </div>
            </div>}
            <header id="header" className={isSticky ? 'sticky' : ''}>
                <div className="container">
                    <div className="navbar">
                        <h2 className="nav_logo">
                            <Link to="/">Medicall</Link>
                        </h2>

                        {
                            (localStorage.getItem("username")!==null && localStorage.getItem("username")!==undefined)? 

                                windowWidth >= 800 ? (
                                    <nav className="nav_actions">

                                        <div className={`dash_action ${curPath==="/home"? "active" : ""}`}>
                                            <span onClick={() => navigate("/home")}>
                                                HOME
                                            </span>
                                        </div>

                                        {localStorage.getItem("usertype")==="patient" && 
                                            <div className={`doctor_action ${curPath==="/doctors"? "active" : ""}`}>
                                                <span onClick={() => navigate("/doctors")}>
                                                    DOCTORS
                                                </span>
                                            </div>
                                        }

                                        <div className={`model_action ${curPath==="/disease-prediction"? "active" : ""}`}>
                                            <span onClick={() => navigate("/disease-prediction")}>
                                                MODEL
                                            </span>
                                        </div>
                                        
                                        {/* <div className={`model_action ${curPath==="/dispred"? "active" : ""}`}>
                                            <span onClick={() => navigate("/dispred")}>
                                                MODEL 2
                                            </span>
                                        </div> */}

                                        <div className={`medicine_action ${curPath==="/buy-medicines"? "active" : ""}`}>
                                            <span onClick={() => navigate("/buy-medicines")}>
                                                MEDICINES
                                                <span className="badge">20% off</span>
                                            </span>
                                        </div>

                                        <div className="user_action">
                                            <span onClick={() => setShowDropdown(!showDropdown)}>
                                                ACCOUNT
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
                                                        <IoWalletOutline className='cart-icon' />
                                                        <Link to="/my-wallet" onClick={() => setShowDropdown(false)}>My Wallet</Link>
                                                    </li>
                                                    <li>
                                                        <AiOutlineShoppingCart className='cart-icon' />
                                                        <Link to="/my-cart" onClick={() => setShowDropdown(false)}>My Cart</Link>
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

                                    <div id="sidebar">
                                        <div className='sidebar-icon' onClick={() => setSideBarOpen(prev => !prev)}>
                                            {isSideBarOpen? <MdClose /> : <CiMenuFries />}
                                        </div>
                                        <div className={`collapse ${isSideBarOpen? "active" : ""}`} ref={sidebarRef}>
                                        <nav className="nav_actions">
                                            <div className={`dash_action ${curPath==="/home"? "active" : ""}`}>
                                                <span onClick={() => {navigate("/home");setSideBarOpen(false);}}>
                                                    HOME
                                                </span>
                                            </div>

                                            {localStorage.getItem("usertype")==="patient" && 
                                                <div className={`doctor_action ${curPath==="/doctors"? "active" : ""}`}>
                                                    <span onClick={() => {navigate("/doctors"); setSideBarOpen(false);}}>
                                                        DOCTORS
                                                    </span>
                                                </div>
                                            }

                                            <div className={`model_action ${curPath==="/disease-prediction"? "active" : ""}`}>
                                                <span onClick={() => {navigate("/disease-prediction"); setSideBarOpen(false);}}>
                                                    MODEL
                                                </span>
                                            </div>

                                            <div className={`medicine_action ${curPath==="/buy-medicines"? "active" : ""}`}>
                                                <span onClick={() => {navigate("/buy-medicines"); setSideBarOpen(false);}}>
                                                    MEDICINES
                                                    <span className="badge">20% off</span>
                                                </span>
                                            </div>

                                            <div className="user_action">
                                                <span onClick={() => {
                                                        setSideBarOpen(prev => !prev);
                                                        setShowDropdown(true);
                                                    }}>
                                                    ACCOUNT
                                                </span>
                                            </div>
                                        </nav>
                                        </div>
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
                                                    <IoWalletOutline className='cart-icon' />
                                                    <Link to="/my-wallet" onClick={() => setShowDropdown(false)}>My Wallet</Link>
                                                </li>
                                                <li>
                                                    <AiOutlineShoppingCart className='cart-icon' />
                                                    <Link to="/my-cart" onClick={() => setShowDropdown(false)}>My Cart</Link>
                                                    <span className='cart_badge'>{cartItems.length}</span>
                                                </li>
                                                <li>
                                                    <RiFileList3Line className='cart-icon' />
                                                    <Link to="/my-orders" onClick={() => setShowDropdown(false)}>My Orders</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )
                         : (
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