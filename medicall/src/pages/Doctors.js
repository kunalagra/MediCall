import { IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { IoMdMail } from "react-icons/io";
import { RiWhatsappFill } from "react-icons/ri";
import Modal from '@mui/material/Modal';
import { IoMdClose } from "react-icons/io";
import useDocTitle from "../hooks/useDocTitle";
import { AiFillStar } from 'react-icons/ai';
import { TbPointFilled } from 'react-icons/tb';
import { useNavigate } from "react-router-dom";
import httpClient from "../httpClient";
import { Alert, CircularProgress } from "@mui/material";
import { IoMdRefresh } from "react-icons/io";

const Doctors = () => {

    useDocTitle("Doctors");

    const [meetModal, setMeetModal] = useState(false);
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [isScheduleMeet, setScheduleMeet] = useState(false);
    const [isInvDateTime, setInvDateTime] = useState(false);
    const [scheduleAlert, setScheduleAlert] = useState(0);
    const [meetScheduling, setMeetScheduling] = useState(false);
    const [curDate, setCurDate] = useState(null);
    const [curTime, setCurTime] = useState(null);
    const [fetchingData, setFetchingData] = useState(false);


    useEffect(() => {
      fetchDoctors();
    }, [])

    function fetchDoctors() {
      setFetchingData(true);
      httpClient.get("/get_status").then((res) => {
        setDoctors(res.data.details);
        // console.log(doctors)
        setFetchingData(false);
      }).catch(() => {
        // console.log(res)
        setFetchingData(false);
      });
    };

    function checkInvDateTime(date,time) {
      const now = new Date();
      const d = date.split('-');
      const t = time.split(':');

      let hh = now.getHours();
      let mm = now.getMinutes() + 30;
      if (mm < 30) hh += 1;
      console.log(d,t);

      if (parseInt(d[1]) < now.getMonth() || parseInt(d[0]) < now.getFullYear() || parseInt(d[2]) < now.getDate()) {
        setInvDateTime(true);
      }
      else if (parseInt(d[0])===now.getDate() && parseInt(t[0]) < hh) {
        setInvDateTime(true);
      }
      else if (parseInt(t[0])===hh && parseInt(t[1]) < mm) {
        setInvDateTime(true);
      }
      else {
        setInvDateTime(false);
      }
    }


    const doctorNames = doctors.map(item => "Dr. " + item.username.split(" ").map(item => item[0].toUpperCase() + item.slice(1).toLowerCase()).join(" "));
    const [selectedDoc, setSelectedDoc] = useState(doctorNames[0]);
    const [selectedDocStatus, setSelectedDocStatus] = useState(false);
    const [selectedDocAvailable, setSelectedDocAvailable] = useState(false);
    const [selectEmail, setSelectEmail] = useState("");
    const [message, setMessage] = useState("");
    
    const handelmeet = () => {
      httpClient.post("/meet_status",{"email":selectEmail}).then((res) => {
        if(res.status === 200){
          navigate(`/instant-meet?meetId=qwerty12345&selectedDoc=${selectedDoc}`);
        }
        else{
          setMessage(res.data.message);
        }
      }).catch(() => {
        // console.log(res)
      })
    };
    
    const columns = [
        {field: "id", headerName: "#", headerAlign:"center", align:"center", width: 100},
        {field: "username", headerName: "Doctor", headerAlign:"center", align:"left", width: 150,
          renderCell: (params) => {
            const fullname = "Dr. " + params.row.username.split(" ").map(item => item[0].toUpperCase() + item.slice(1).toLowerCase()).join(" ");
            return (
              <div className="name-column--cell">
                 {fullname}
              </div>
            );
          }
        },
        {field: "email", headerName: "Email", headerAlign: "center", align: "left", width: 150},
        {field: "gender", headerName: "Gender", headerAlign: "center", align: "center", width: 100, renderCell: (params) => {
          return <>{params.row.gender[0].toUpperCase() + params.row.gender.slice(1).toLowerCase()}</>
        }},
        {field: "specialization", headerName: "Specialization", headerAlign: "center", align: "center", width: 150,},
        {
          field: "contact", headerName: "Contact", headerAlign: "center", align: "center", width: 150,
          renderCell: (params) => {
            return (
              <div className="social-column--cell">
                  <IconButton onClick={() => {
                    const shareUrl = `https://wa.me/${params.row.phone}?text=Hello sir,%0AI want to talk to you!!`;
                    window.open(shareUrl, "_blank");
                  }}>
                    <RiWhatsappFill className="social-icon whatsapp" />
                  </IconButton>
                  <IconButton onClick={() => {
                    window.open(`mailto:${params.row.email}`, "_blank");
                  }}>
                    <IoMdMail className="social-icon mail" />
                  </IconButton>
              </div>
            )
          },
        },
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
                 <TbPointFilled className={`${params.row.status==="online"? "green-icon" : "red-icon"}`} /> {params.row.status}
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
                        setSelectEmail(params.row.email);
                        setSelectedDoc("Dr. " + params.row.username.split(" ").map(item => item[0].toUpperCase() + item.slice(1).toLowerCase()).join(" "));
                        setMeetModal(true);
                        setSelectedDocStatus(params.row.status==="online");
                        setSelectedDocAvailable(params.row.isInMeet);
                        setScheduleMeet(false);
                      }}>
                        BOOK
                      </button>
                    </div>
                );
            },
        },
    ];

    return (
      <>
        <div id="doctors-page">
          <div className="doctor-details">
              <div className="heading">
                <h3>Doctor Details</h3>
                <div className="refresh-btn" onClick={fetchDoctors}>
                  <span className={`${fetchingData? "active" : ""}`}>
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
          open={meetModal}
          onClose={() => setMeetModal(false)}
        >
          <div id="meet-modal" style={{width: `${!selectedDocAvailable && selectedDocStatus? "min(570px, 90vw)" : "min(400px, 90vw)"}`}}>
            <div className="close_btn_div">
              <IoMdClose onClick={() => setMeetModal(false)} />
            </div>
            <div className="meet-details-div">
              <h3>Wanna meet?</h3>
              <div className="meet-details">
                {selectedDocStatus && !selectedDocAvailable && <div className="create-meet" onClick={() => handelmeet()}>Create an Instant meet</div>}
                <div className="create-meet" onClick={() => {
                  const d = new Date();
                  setCurDate(`${d.getFullYear()}-${parseInt(d.getMonth()) < 10? '0' : ''}${d.getMonth()}-${parseInt(d.getDate()) < 10? '0' : ''}${d.getDate()}`);
                  setCurTime(`${parseInt(d.getHours()) < 10? '0' : ''}${d.getHours()}:${parseInt(d.getMinutes()) < 10 ? '0' : ''}${d.getMinutes()}`);
                  setInvDateTime(true);
                  setScheduleMeet(!isScheduleMeet);
                }}>Schedule a meet</div>
                { message && <div className="not-available-note">Oops! {selectedDoc} is currently in another meet, you can wait a few minutes or else schedule your meet. </div>}
                {selectedDocStatus && selectedDocAvailable && <div className="not-available-note">Oops! {selectedDoc} is currently in another meet, you can wait a few minutes or else schedule your meet. </div>}
              </div>
            </div>
            {isScheduleMeet && (
              <div className="schedule-meet-div">
                <h3>Pick a Date and Time</h3>
                {isInvDateTime && <Alert severity="error">Pick a future date and time</Alert>}
                {scheduleAlert!==0 && <Alert severity={`${scheduleAlert===1? "error" : "success"}`}>{scheduleAlert===1? "Doctor isn't available at that time. Please pick up some other time" : "Meet scheduled successfully"}</Alert>}
                <div className="schedule-meet">
                  <input type="date" value={curDate} onChange={(e) => {checkInvDateTime(e.target.value, curTime); setCurDate(e.target.value);}} />
                  <input type="time" value={curTime} onChange={(e) => {checkInvDateTime(curDate, e.target.value); setCurTime(e.target.value);}} />
                </div>
                <div className="schedule-btn">
                  <button onClick={() => {
                      setMeetScheduling(true);
                      setTimeout(() => {
                        setMeetScheduling(false);

                        setScheduleAlert(1);

                        // check doctor availability
                        setTimeout(() => {
                          setScheduleAlert(0);
                          setMeetModal(false);
                        }, 4000);
                      }, 2000);
                    }}
                    disabled={isInvDateTime}
                  >{ meetScheduling? (
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
