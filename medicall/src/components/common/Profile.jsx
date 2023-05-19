import React, { useState, useContext, useRef } from "react";
import commonContext from "../../contexts/common/commonContext";
import useOutsideClose from '../../hooks/useOutsideClose';
import useScrollDisable from '../../hooks/useScrollDisable';
import { Alert, CircularProgress } from "@mui/material";
import httpClient from '../../httpClient';

const Profile = () => {
    const { isProfileOpen, toggleProfile } = useContext(commonContext);
    const [username, setUsername] = useState(localStorage.getItem("username")? localStorage.getItem("username") : "");
    const [age, setAge] = useState(localStorage.getItem("age")? localStorage.getItem("age") : "");
    const [gender, setGender] = useState(localStorage.getItem("gender")? localStorage.getItem("gender") : "");
    const [phone, setPhone] = useState(localStorage.getItem("phone")? localStorage.getItem("phone") : "");
    const [specialization, setSpecialization] = useState(localStorage.getItem("specialization")? localStorage.getItem("specialization") : "");
    const email = localStorage.getItem("email")? localStorage.getItem("email") : "";
    const [isChPasswd, setChPasswd] = useState(false);
    const [passwd, setPasswd] = useState("");
    const [isInvPass, setIsInvPass] = useState(false);
    const [isInvAge, setIsInvAge] = useState(false);
    const [isAlert, setIsAlert] = useState("");
    const [alertCont, setAlertCont] = useState("");
    const [isSuccessLoading, setIsSuccessLoading] = useState(false);
    const isDoctor = localStorage.getItem("usertype")==="doctor";

    const profileRef = useRef();

    useOutsideClose(profileRef, () => {
        toggleProfile(false);
    });

    useScrollDisable(isProfileOpen);

    const checkAge = (a) => {
        const t = ( parseInt(a) > 0 && parseInt(a) <= 120 && /^[0-9]{1,3}$/.test(a));
        setIsInvAge(!t);
        return t;
    } 

    const checkPasswd = (passwd) => {
        const res = (/^.{6,}$/.test(passwd));
        setIsInvPass(!res);
        return res;
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if ( isInvAge || (isChPasswd && isInvPass) ) {
            return;
        }

        setIsSuccessLoading(true);

        httpClient.put('/update_details', {
            "email": email,
            "username": username,
            "usertype": isDoctor? "doctor" : "patient",
            "age": age,
            "specialization": specialization,
            "gender": gender,
            "phone": phone,
            "passwd": passwd
        })
        .then((res) => {
            setIsSuccessLoading(false);
            setIsAlert("success");
            setAlertCont("Successfully updated");
            
            setTimeout(() => {
                setIsAlert("");
                setAlertCont("");
            }, 2000);
        })
        .catch((err) => {
            setIsSuccessLoading(false);
            setIsAlert("error");
            setAlertCont("Something went wrong. Please try again later");
            
            setTimeout(() => {
                setIsAlert("");
                setAlertCont("");
            }, 2000);
        });
    }


    return (
        <>
            {
                isProfileOpen && (
                    <div className="backdrop">
                        <div className="modal_centered">
                            <form id="account_form" ref={profileRef} onSubmit={handleFormSubmit}>
                                { isAlert!=="" && <Alert severity={isAlert} className='form_sucess_alert'>{alertCont}</Alert> }

                                {/*===== Form-Header =====*/}
                                <div className="form_head">
                                    <h2>Profile</h2>
                                    <p>Check your profile</p>
                                </div>

                                {/*===== Form-Body =====*/}
                                <div className="form_body">
                                    <>
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

                                        { isDoctor && (
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="specialization"
                                                    className="input_field"
                                                    value={specialization}
                                                    onChange={(e) => setSpecialization(e.target.value)}
                                                    required
                                                />
                                                <label className="input_label">Specialization {"(Eg. Cancer Surgeon)"}</label>
                                            </div>
                                        )}

                                        { !isDoctor && (
                                            <div>
                                                <div className="input_box">
                                                    <input
                                                        type="text"
                                                        name="age"
                                                        className="input_field"
                                                        value={age}
                                                        onChange={(e) => {
                                                            checkAge(e.target.value);
                                                            setAge(e.target.value);
                                                        }}
                                                        required
                                                    />
                                                    <label className="input_label">Age</label>
                                                </div>
                                                { age!=="" && isInvAge && <Alert severity="error" className='form_sucess_alert'>Invalid Age</Alert> }
                                            </div>
                                        )}

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

                                    <div>
                                        <div className="input_box">
                                            <input
                                                type="text"
                                                name="email"
                                                className="input_field disabled"
                                                value={email}
                                                disabled
                                            />
                                            <label className="input_label">Email</label>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="check_box">
                                            <input
                                                type="checkbox"
                                                name="passcheck"
                                                className="check_field"
                                                checked={isChPasswd}
                                                onChange={() => setChPasswd((prev) => !prev)}
                                            />
                                            <label className="radio_input_label" onClick={() => setChPasswd((prev) => !prev)}> Wanna change password?</label>
                                        </div>
                                    </div>

                                    { isChPasswd && (
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
                                                    autoComplete=""
                                                />
                                                <label className="input_label">Password</label>
                                            </div>
                                            { passwd!=="" && isInvPass && <Alert severity="warning" className='input_alert'>Password should contain atleast 6 characters</Alert> }
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn login_btn"
                                        disabled={isInvAge || isInvPass}
                                    >
                                        {isSuccessLoading? (
                                            <CircularProgress
                                                size={24}
                                                sx={{ color: "#f5f5f5" }}
                                            />
                                        ) : "Update" 
                                        }
                                    </button>

                                </div>

                                {/*===== Form-Close-Btn =====*/}
                                <div
                                    className="close_btn"
                                    title="Close"
                                    onClick={() => toggleProfile(false)}
                                >
                                    &times;
                                </div>

                            </form>
                        </div>
                    </div>
                )
            }
        </>
    )
}


export default Profile;

