import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineUser, AiOutlineMedicineBox } from 'react-icons/ai';
import { BsRobot } from 'react-icons/bs';
import { TbStethoscope } from 'react-icons/tb';
import { MdDashboard } from 'react-icons/md';
import commonContext from '../../contexts/common/commonContext';
import AccountForm from '../form/Accountform';
// import { dropdownMenu } from '../../data/headerData';
// import SearchBar from './SearchBar';


const Header = () => {

    const { formUserInfo, toggleForm } = useContext(commonContext);
    const [isSticky, setIsSticky] = useState(false);

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
                        <nav className="nav_actions">

                            <div className="dash_action">
                                <span>
                                    <MdDashboard />
                                </span>
                                <div className="tooltip">Dashboard</div>
                            </div>

                            <div className="doctor_action">
                                <span>
                                    <TbStethoscope />
                                </span>
                                <div className="tooltip">Doctors</div>
                            </div>

                            <div className="model_action">
                                <span>
                                    <BsRobot />
                                </span>
                                <div className="tooltip">Disease Prediction</div>
                            </div>

                            <div className="medicine_action">
                                <Link to="/">
                                    <AiOutlineMedicineBox />
                                    <span className="badge">20% off</span>
                                </Link>
                                <div className="tooltip">Medicines</div>
                            </div>

                            <div className="user_action">
                                <span>
                                    <AiOutlineUser />
                                </span>
                                <div className="dropdown_menu">
                                    <h4>Hello! {formUserInfo && <Link to="*">&nbsp;{formUserInfo}</Link>}</h4>
                                    <p>Access account and manage orders</p>
                                    {
                                        !formUserInfo? (
                                            <button
                                                type="button"
                                                onClick={() => toggleForm(true)}
                                            >
                                                Login / Signup
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                            >
                                                Logout
                                            </button>

                                        )
                                    }
                                    {/* <div className="separator"></div> */}
                                    {/* <ul>
                                        {
                                            dropdownMenu.map(item => {
                                                const { id, link, path } = item;
                                                return (
                                                    <li key={id}>
                                                        <Link to={path}>{link}</Link>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul> */}
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* <SearchBar /> */}
            <AccountForm />
        </>
    );
};

export default Header;