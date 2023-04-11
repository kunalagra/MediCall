import React, { useContext, useRef, useState } from 'react';
import commonContext from '../../contexts/common/commonContext';
import useOutsideClose from '../../hooks/useOutsideClose';
import useScrollDisable from '../../hooks/useScrollDisable';
import { Alert } from "@mui/material";

const AccountForm = () => {

    const { isFormOpen, toggleForm } = useContext(commonContext);
    const [username, setUsername] = useState("");
    const [usertype, setUsertype] = useState("patient");
    const [gender, setGender] = useState("male");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [passwd, setPasswd] = useState("");
    const [isInvEmail, setIsInvEmail] = useState(false);
    const [isInvPass, setIsInvPass] = useState(false);

    const formRef = useRef();

    useOutsideClose(formRef, () => {
        toggleForm(false);
    });

    useScrollDisable(isFormOpen);

    const [isSignupVisible, setIsSignupVisible] = useState(false);


    // Signup-form visibility toggling
    const handleIsSignupVisible = () => {
        setIsSignupVisible(prevState => !prevState);
    };

    const checkEmail = (email) => {
        // eslint-disable-next-line
        const res = (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email));
        setIsInvEmail(!res);
        return res;
    }

    const checkPasswd = (passwd) => {
        const res = (/^.{6,}$/.test(passwd));
        setIsInvPass(!res);
        return res;
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if( isInvEmail || isInvPass ) {
            return;
        }
        localStorage.clear();
        localStorage.setItem("username", username);
        localStorage.setItem("usertype", usertype);
        localStorage.setItem("gender", gender);
        localStorage.setItem("phone", phone);
        localStorage.setItem("email", email);
        localStorage.setItem("passwd", passwd);
        toggleForm(false);
    }


    return (
        <>
            {
                isFormOpen && (
                    <div className="backdrop">
                        <div className="modal_centered">
                            <form id="account_form" ref={formRef} onSubmit={handleFormSubmit}>

                                {/*===== Form-Header =====*/}
                                <div className="form_head">
                                    <h2>{isSignupVisible ? 'Signup' : 'Login'}</h2>
                                    <p>
                                        {isSignupVisible ? 'Already have an account ?' : 'New to X-Beat ?'}
                                        &nbsp;&nbsp;
                                        <button type="button" onClick={handleIsSignupVisible}>
                                            {isSignupVisible ? 'Login' : 'Create an account'}
                                        </button>
                                    </p>
                                </div>

                                {/*===== Form-Body =====*/}
                                <div className="form_body">
                                    {
                                        isSignupVisible && (
                                            <>
                                            <div className="input_box">
                                                <label className="radio_label">Register as</label>
                                                <div className='radio_inputs'>
                                                    <input
                                                        type="radio"
                                                        name="usertype"
                                                        className="radio_input_field"
                                                        value="patient"
                                                        checked={usertype==="patient"}
                                                        onChange={(e) => setUsertype(e.target.value)}
                                                    /> <label className='radio_input_label'>Patient</label>
                                                    <input
                                                        type="radio"
                                                        name="usertype"
                                                        className="radio_input_field"
                                                        value="doctor"
                                                        checked={usertype==="doctor"}
                                                        onChange={(e) => setUsertype(e.target.value)}
                                                    /> <label className='radio_input_label'>Doctor</label>
                                                </div>
                                            </div>

                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="username"
                                                    className="input_field"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    required
                                                />
                                                <label className="input_label">Username</label>
                                            </div>

                                            <div className="input_box">
                                                <label className="radio_label">Gender</label>
                                                <div className='radio_inputs'>
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        className="radio_input_field"
                                                        value="male"
                                                        checked={gender==="male"}
                                                        onChange={(e) => setGender(e.target.value)}
                                                    /> <label className='radio_input_label'>Male</label>
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        className="radio_input_field"
                                                        value="female"
                                                        checked={gender==="female"}
                                                        onChange={(e) => setGender(e.target.value)}
                                                    /> <label className='radio_input_label'>Female</label>
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        className="radio_input_field"
                                                        value="other"
                                                        checked={gender==="other"}
                                                        onChange={(e) => setGender(e.target.value)}
                                                    /> <label className='radio_input_label'>Other</label>
                                                </div>
                                            </div>

                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    className="input_field"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    required
                                                />
                                                <label className="input_label">Phone</label>
                                            </div>
                                            </>
                                        )
                                    }

                                    <div>
                                        <div className="input_box">
                                            <input
                                                type="text"
                                                name="email"
                                                className="input_field"
                                                value={email}
                                                onChange={(e) => {
                                                    checkEmail(e.target.value);
                                                    setEmail(e.target.value);
                                                }}
                                                required
                                            />
                                            <label className="input_label">Email</label>
                                        </div>
                                        { email!=="" && isInvEmail && <Alert severity="error" className='input_alert'>Invalid Email</Alert> }
                                    </div>

                                    <div>
                                        <div className="input_box">
                                            <input
                                                type="password"
                                                name="password"
                                                className="input_field"
                                                value={passwd}
                                                onChange={(e) => {
                                                    checkPasswd(e.target.value);
                                                    setPasswd(e.target.value);
                                                }}
                                                required
                                            />
                                            <label className="input_label">Password</label>
                                        </div>
                                        { isSignupVisible && passwd!=="" && isInvPass && <Alert severity="warning" className='input_alert'>Password should contain atleast 6 characters</Alert> }
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn login_btn"
                                    >
                                        {isSignupVisible ? 'Signup' : 'Login'}
                                    </button>

                                </div>

                                {/*===== Form-Close-Btn =====*/}
                                <div
                                    className="close_btn"
                                    title="Close"
                                    onClick={() => toggleForm(false)}
                                >
                                    &times;
                                </div>

                            </form>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default AccountForm;