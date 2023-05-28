import React, { useState, useEffect, useContext } from "react";
import { IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { IoMdMail } from "react-icons/io";
import { RiWhatsappFill } from "react-icons/ri";
import Modal from '@mui/material/Modal';
import { IoMdClose } from "react-icons/io";
import useDocTitle from "../hooks/useDocTitle";
import { AiFillStar, AiOutlineClockCircle } from 'react-icons/ai';
import { TbPointFilled } from 'react-icons/tb';
import { useNavigate } from "react-router-dom";
import httpClient from "../httpClient";
import { Alert, CircularProgress } from "@mui/material";
import { IoMdRefresh } from "react-icons/io";
import useActive from "../hooks/useActive";
import { FaVideo } from "react-icons/fa";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";

const Doctors = () => {

  useDocTitle("Doctors");

  const { isLoading, toggleLoading } = useContext(commonContext);

  const [meetModal, setMeetModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isInstantMeet, setInstantMeet] = useState(false);
  const [isConnecting, setConnecting] = useState(false);
  const [isScheduleMeet, setScheduleMeet] = useState(false);
  const [isInvDateTime, setInvDateTime] = useState(false);
  const [scheduleAlert, setScheduleAlert] = useState(0);
  const [meetScheduling, setMeetScheduling] = useState(false);
  const [curDate, setCurDate] = useState(null);
  const [curTime, setCurTime] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [available, setAvailable] = useState({
    "08:00": true, "09:00": true, "10:00": true, "11:00": true, "12:00": true, "15:00": true, "16:00": true, "17:00": true, "18:00": true
  });

  // Set this to user's balance amount
  const [balance, setBalance] = useState(0);
  const [isLowBalance, setLowBalance] = useState(false);
  const [curFee, setCurFee] = useState(0);


  const navigate = useNavigate();
  const userNotExists = localStorage.getItem("usertype") === undefined || localStorage.getItem("usertype") === null;

  useEffect(() => {
    if (userNotExists) {
      navigate("/");
    }
    else {
      fetchDoctors();
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    handletimings();
  }, [isScheduleMeet, curDate])

  function fetchDoctors() {
    setFetchingData(true);
    toggleLoading(true);
    httpClient.get("/get_status").then((res) => {
      setDoctors(res.data.details);
      // console.log(doctors)
      toggleLoading(false);
      setFetchingData(false);
    }).catch(() => {
      // console.log(res)
      toggleLoading(false);
      setFetchingData(false);
    });
  };

  function checkInvDateTime(date, time) {
    const now = new Date(new Date().getTime() + 30 * 60000);
    const d = new Date(date + ' ' + time);
    setInvDateTime(now >= d);
  }


  const handleSchedule = (upcomingAppointments) => {
    for (let i = 0; i < upcomingAppointments.length; i++) {
      const now = new Date(curDate + " " + curTime);
      const d1 = new Date(new Date(upcomingAppointments[i].date + ' ' + upcomingAppointments[i].time).getTime() - 30 * 60000);
      const d2 = new Date(new Date(upcomingAppointments[i].date + ' ' + upcomingAppointments[i].time).getTime() + 30 * 60000);

      if (d1 < now && now <= d2)
        return false;
    };
    return true;
  };

  const handletimings = () => {

    {
      selectEmail !== "" ? httpClient.post('/set_appointment', {
        email: selectEmail
      }).then((res) => {
        // console.log(res.data);
        const appointments = res.data.appointments;
        let times = {
          "08:00": true, "09:00": true, "10:00": true, "11:00": true, "12:00": true, "15:00": true, "16:00": true, "17:00": true, "18:00": true
        };
        console.log(curDate)
        appointments.filter((item) => item.date === curDate).map((item) => {
          times[item.time] = false;
          return null;
        });
        setAvailable(times);
      }).catch((err) => {
        console.log(err);
      }) : null
    }
  };

  const doctorNames = doctors.map(item => "Dr. " + item.username.split(" ").map(item => item[0].toUpperCase() + item.slice(1).toLowerCase()).join(" "));
  const [selectedDoc, setSelectedDoc] = useState(doctorNames[0]);
  const [selectedDocStatus, setSelectedDocStatus] = useState(false);
  const [selectedDocAvailable, setSelectedDocAvailable] = useState(false);
  const [selectEmail, setSelectEmail] = useState("");
  const [message, setMessage] = useState("");
  const timings = [{ time: "08:00", available: available["08:00"] }, { time: "09:00", available: available["09:00"] }, { time: "10:00", available: available["10:00"] }, { time: "11:00", available: available["11:00"] }, { time: "12:00", available: available["12:00"] }, { time: "15:00", available: available["15:00"] }, { time: "16:00", available: available["16:00"] }, { time: "17:00", available: available["17:00"] }, { time: "18:00", available: available["18:00"] }];
  const { handleActive, activeClass } = useActive(-1);

  const handlemeet = () => {
    const time = new Date().getTime();
    console.log(time)
    httpClient.post("/meet_status", { "email": selectEmail }).then((res) => {
      if (res.status === 200) {
        httpClient.put("/make_meet", {
          "email": selectEmail,
          "link": `/instant-meet?meetId=${time}&selectedDoc=${selectedDoc}&selectedMail=${encodeURIComponent(selectEmail)}&name=${localStorage.getItem("username")}&age=${localStorage.getItem("age")}&gender=${localStorage.getItem("gender")}&pemail=${localStorage.getItem("email")}&fee=${curFee}`,
          "patient": localStorage.getItem("username")
        }).then((res) => {
          setTimeout(() => {
            httpClient.post("/currently_in_meet", { "email": selectEmail }).then((res) => {
              if (res.data.curmeet) {
                setConnecting(false);
                navigate(`/instant-meet?meetId=${time}&selectedDoc=${selectedDoc}&selectedMail=${encodeURIComponent(selectEmail)}&name=${localStorage.getItem("username")}&age=${localStorage.getItem("age")}&gender=${localStorage.getItem("gender")}&pemail=${localStorage.getItem("email")}fee=${curFee}`);
              }
              else {
                httpClient.put('/delete_meet', { "email": selectEmail })
                setConnecting(false);
                setMessage(res.data.message);
              }
            })
          }, 20000);
        }).catch(() => {
          // console.log(res)
        })
      }
      else {
        setConnecting(false);
        setMessage(res.data.message);
      }
    }).catch(() => {
      // console.log(res)
    })

  };

  useEffect(() => {
    httpClient.post("/get_wallet", { "email": localStorage.getItem("email") }).then((res) => {
      setBalance(res.data.wallet);
    }).catch(() => {
      // console.log(res)
    })
  }, []);

  const columns = [
    { field: "id", headerName: "#", headerAlign: "center", align: "center", width: 100 },
    {
      field: "username", headerName: "Doctor", headerAlign: "center", align: "left", width: 150,
      renderCell: (params) => {
        const fullname = "Dr. " + params.row.username.split(" ").map(item => item[0].toUpperCase() + item.slice(1).toLowerCase()).join(" ");
        return (
          <div className="name-column--cell">
            {fullname}
          </div>
        );
      }
    },
    { field: "email", headerName: "Email", headerAlign: "center", align: "left", width: 150 },
    {
      field: "gender", headerName: "Gender", headerAlign: "center", align: "center", width: 100, renderCell: (params) => {
        return <>{params.row.gender[0].toUpperCase() + params.row.gender.slice(1).toLowerCase()}</>
      }
    },
    { field: "specialization", headerName: "Specialization", headerAlign: "center", align: "center", width: 150, },
    { field: "fee", headerName: "Fee", headerAlign: "center", align: "center", width: 100,
      renderCell: (params) => {
        return (
          <div>₹ {params.row.fee}</div>
        )
      }
     },
    {
      field: "languages", headerName: "Languages", headerAlign: "center", align: "center", width: 100,
      renderCell: () => {
        return (
          <div className="social-column--cell">
            English / Hindi
          </div>
        )
      },
    },
    // {
    //   field: "contact", headerName: "Contact", headerAlign: "center", align: "center", width: 100,
    //   renderCell: (params) => {
    //     return (
    //       <div className="social-column--cell">
    //         <IconButton onClick={() => {
    //           const shareUrl = `https://wa.me/${params.row.phone}?text=Hello sir,%0AI want to talk to you!!`;
    //           window.open(shareUrl, "_blank");
    //         }}>
    //           <RiWhatsappFill className="social-icon whatsapp" />
    //         </IconButton>
    //         <IconButton onClick={() => {
    //           window.open(`mailto:${params.row.email}`, "_blank");
    //         }}>
    //           <IoMdMail className="social-icon mail" />
    //         </IconButton>
    //       </div>
    //     )
    //   },
    // },
    {
      field: "ratings",
      headerName: "Ratings", headerAlign: "center", align: "center", width: 100,
      renderCell: (params) => {
        return (
          <div className="ratings-column--cell">
            {params.row.noOfAppointments ? <>{(params.row.noOfStars / params.row.noOfAppointments).toFixed(1)} <AiFillStar className="ratings-icon" /></> : <>0 <AiFillStar className="ratings-icon" /></>}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status", headerAlign: "center", align: "center", width: 100,
      renderCell: (params) => {
        return (
          <div className="status-column--cell">
            <TbPointFilled className={`${params.row.status === "online" ? "green-icon" : "red-icon"}`} /> {params.row.status}
          </div>
        );
      },
    },
    {
      field: "appointments",
      headerName: "Book an Appointment", headerAlign: "center", align: "center", width: 150,
      renderCell: (params) => {
        return (
          <div className="appointment-column--cell">
            <button onClick={() => {
              if(params.row.fee > balance) {
                setLowBalance(true);
                setCurFee(params.row.fee);
              } else {
                setSelectEmail(params.row.email);
                setSelectedDocStatus(params.row.status === "online");
                setSelectedDocAvailable(params.row.isInMeet);
                setScheduleMeet(false);
                setInstantMeet(false);
                setLowBalance(false);
              }
              setSelectedDoc("Dr. " + params.row.username.split(" ").map(item => item[0].toUpperCase() + item.slice(1).toLowerCase()).join(" "));
              setMeetModal(true);
            }}>
              BOOK
            </button>
          </div>
        );
      },
    },
  ];

  useScrollDisable(isLoading);

  if(isLoading) {
    return <Preloader />;
  };

  return (
    <>
      <div id="doctors-page">
        <div className="doctor-details">
          <div className="heading">
            <h3>Doctor Details</h3>
            <div className="refresh-btn" onClick={fetchDoctors}>
              <span className={`${fetchingData ? "active" : ""}`}>
                <IoMdRefresh className="refresh-icon" />
              </span>
              <div className="refresh-tooltip tooltip">Refresh details</div>
            </div>
          </div>
          <DataGrid
            className="doctor-details-table"
            rows={doctors}
            columns={columns}
            components={{ Toolbar: GridToolbar }
            }
          />
        </div>
      </div>
      <Modal
        open={meetModal && isLowBalance}
        onClose={() => {
          setMessage("")
          setMeetModal(false);
        }}
      >
        <div id="meet-modal" style={{ width: "min(400px, 90vw)" }}>
          <div className="close_btn_div">
            <IoMdClose onClick={() => {
              setMessage("")
              setMeetModal(false)
              setConnecting(false)
              httpClient.put('/delete_meet', { email: selectEmail} )
            }} />
          </div>
          <div className="balance-details">
            <h3>Uhuh!!</h3>
            <p>Low Balance!</p>
            <div className="fee-split">
              <div className="text">Doctor Fee {`(${selectedDoc})`}</div>
              <div className="fee">₹ {curFee}</div>
            </div>
            <div className="fee-split">
              <div className="text">Available Balance</div>
              <div className="fee">₹ {balance}</div>
            </div>
            <div className="fee-split last">
              <div className="text">Remaining Balance</div>
              <div className="fee">₹ {(curFee - balance).toFixed(2)}</div>
            </div>
            <button className="recharge-btn" onClick={() => navigate(`/my-wallet?recharge=${curFee - balance}`)}>Recharge Wallet</button>
          </div>
        </div>
      </Modal>
      <Modal
        open={meetModal && !isLowBalance}
        onClose={() => {
          setMessage("")
          setMeetModal(false);
          setConnecting(false);
        }}
      >
        <div id="meet-modal" style={{ width: `${!selectedDocAvailable && selectedDocStatus ? "min(570px, 90vw)" : "min(400px, 90vw)"}` }}>
          <div className="close_btn_div">
            <IoMdClose onClick={() => {
              setMessage("")
              setMeetModal(false)
              setConnecting(false)
              httpClient.put('/delete_meet', { email: selectEmail} )
            }} />
          </div>
          <div className="meet-details-div">
            <h3>Wanna meet?</h3>
            <div className="meet-details">
              {selectedDocStatus && !selectedDocAvailable && <div className="create-meet" onClick={() => {
                setScheduleMeet(false);
                setInstantMeet(!isInstantMeet);
                setConnecting(false);
              }}>Create an Instant meet</div>}
              <div className="create-meet" onClick={() => {
                const d = new Date();
                setCurDate(`${d.getFullYear()}-${parseInt(d.getMonth()) < 9 ? '0' : ''}${d.getMonth() + 1}-${parseInt(d.getDate()) < 10 ? '0' : ''}${d.getDate()}`);
                setCurTime(`${parseInt(d.getHours()) < 10 ? '0' : ''}${d.getHours()}:${parseInt(d.getMinutes()) < 10 ? '0' : ''}${d.getMinutes()}`);
                setInvDateTime(true);
                setScheduleMeet(!isScheduleMeet);
                setInstantMeet(false);
                setConnecting(false);
              }}>Schedule a meet</div>
              {message && <div className="not-available-note">Oops! {selectedDoc} is currently in another meet, you can wait a few minutes or else schedule your meet. </div>}
              {selectedDocStatus && selectedDocAvailable && <div className="not-available-note">Oops! {selectedDoc} is currently in another meet, you can wait a few minutes or else schedule your meet. </div>}
            </div>
          </div>

          {isInstantMeet && (
            isConnecting ? (
              <div className="instant-meet-div">
                <div className="loader">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                </div>
                <div>Connecting...</div>
              </div>
            ) : (
              <div className="instant-meet-div">
                <button onClick={() => {
                  setConnecting(true);
                  handlemeet();
                }}>Connect <FaVideo /></button>
              </div>
            )
          )}

          {isScheduleMeet && (
            <div className="schedule-meet-div">
              <h3>Pick a Date and Time</h3>
              {isInvDateTime && <Alert severity="error">Pick a future date and time</Alert>}
              {scheduleAlert !== 0 && <Alert severity={`${scheduleAlert === 1 ? "error" : "success"}`}>{scheduleAlert === 1 ? "Doctor isn't available at that time. Please pick up some other time" : "Meet scheduled successfully"}</Alert>}
              <div className="schedule-meet">
                <input type="date" id="date"
                  value={curDate}
                  onChange={(e) => { }}
                  onChangeCapture={(e) => {
                    setCurDate(e.target.value);
                    checkInvDateTime(e.target.value, curTime);
                  }}
                />
                <div className="timings">
                  {timings.map((item, index) => (
                    <div className={`timing-slot ${!item.available && "not-avail"} ${activeClass(index)}`} onClick={() => { handleActive(index); checkInvDateTime(curDate, item.time); setCurTime(item.time) }} key={index}>
                      <div className="slot"><TbPointFilled /></div>
                      <div className="time">{item.time}</div>
                      <div className="clock-icon"><AiOutlineClockCircle /></div>
                    </div>
                  ))}
                </div>

              </div>
              <div className="schedule-btn">
                <button onClick={() => {
                  setMeetScheduling(true);
                  setTimeout(() => {
                    setMeetScheduling(false);

                    httpClient.post('/set_appointment', {
                      email: selectEmail
                    }).then((res) => {
                      // console.log(res.data);
                      if (handleSchedule(res.data.appointments)) {
                        setScheduleAlert(2);
                        const datetime = `${curDate}${curTime.replace(":", "")}`;
                        const link = `/instant-meet?meetId=${datetime}&selectedDoc=${selectedDoc}&selectedMail=${encodeURIComponent(selectEmail)}&name=${localStorage.getItem("username")}&age=${localStorage.getItem("age")}&gender=${localStorage.getItem("gender")}&pemail=${localStorage.getItem("email")}fee=${curFee}`;
                        httpClient.put('/patient_apo', { email: localStorage.getItem('email'), date: curDate, time: curTime, doctor: selectedDoc, demail: selectEmail, link: link }).then((res) => {
                          console.log(res);
                        }).catch((err) => {
                          console.log(err);
                        });

                        httpClient.put('/set_appointment', { email: selectEmail, date: curDate, time: curTime, patient: localStorage.getItem('username'), pemail: localStorage.getItem("email"), link: link }).then((res) => {
                          console.log(res);
                        }).catch((err) => {
                          console.log(err);
                        });
                        // TODO: 
                        // Append the date, time, patient details and meet link to the <<doctor.upcomingAppointments>>
                      } else {
                        setScheduleAlert(1);
                      }
                    }).catch((err) => {
                      console.log(err);
                    });

                    // TODO: fetch the <<selectedDoc>> doctor data 
                    // check the doctor availability using <<doctor.upcomingAppointments>>
                    // now pass the in the <<handleSchedule(doctor.upcomingAppointments)>>
                    // Note that the <<doctor.upcomingAppointments>> should be an array and it should contain date and time
                    // <<handleSchedule>> function returns true if slot is available

                    setTimeout(() => {
                      setScheduleAlert(0);
                      setMeetModal(false);
                    }, 4000);
                  }, 2000);
                }}
                  disabled={isInvDateTime}
                >{meetScheduling ? (
                  <CircularProgress
                    size={18}
                    sx={{ color: "#f5f5f5", margin: "0px 30px" }}
                  />
                ) : "Schedule"}</button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Doctors;
