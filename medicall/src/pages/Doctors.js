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

const Doctors = () => {

    useDocTitle("Doctors");

    const [meetModal, setMeetModal] = useState(false);
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    
    // temporary doctors data
    // const doctors = [
    //     {
    //         id: 1,
    //         username: "Ganesh Utla",
    //         email: "abc@gmail.com",
    //         gender: "male",
    //         specialization: "Cancer Surgeon",
    //         phone: "1234567890",
    //         status: "online",
    //         noOfAppointments: 3,
    //         noOfStars: 13,
    //         isInMeet: false
    //     },
    //     {
    //         id: 2,
    //         username: "Deexith Madas",
    //         email: "def@gmail.com",
    //         gender: "male",
    //         specialization: "Heart Surgeon",
    //         phone: "1234567890",
    //         status: "offline",
    //         noOfAppointments: 5,
    //         noOfStars: 19,
    //         isInMeet: false
    //     },
    //     {
    //         id: 3,
    //         username: "Kunal Agrawal",
    //         email: "ghi@gmail.com",
    //         gender: "male",
    //         specialization: "Brain Surgeon",
    //         phone: "1234567890",
    //         status: "online",
    //         noOfAppointments: 2,
    //         noOfStars: 9,
    //         isInMeet: true
    //     },
    //     {
    //         id: 4,
    //         username: "Aman Tiwari",
    //         email: "jkl@gmail.com",
    //         gender: "male",
    //         specialization: "Penis Surgeon",
    //         phone: "1234567890",
    //         status: "online",
    //         noOfAppointments: 3,
    //         noOfStars: 14,
    //         isInMeet: false
    //     },
    //     {
    //         id: 5,
    //         username: "Loda insaan",
    //         email: "mno@gmail.com",
    //         gender: "male",
    //         specialization: "Chutiyapa",
    //         phone: "1234567890",
    //         status: "offline",
    //         noOfAppointments: 4,
    //         noOfStars: 13,
    //         isInMeet: false
    //     },
    // ];

    useEffect(() => {
      httpClient.get("/get_status").then((res) => {
        setDoctors(res.data.details);
        console.log(doctors)
      }).catch((res) => {
        console.log(res)
      })
      //eslint-disable-next-line
    }, [])

    
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
      }).catch((res) => {
        console.log(res)
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
              <h3>Doctor Details</h3>
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
                <div className="create-meet">Schedule a meet</div>
                { message && <div className="not-available-note">Oops! {selectedDoc} is currently in another meet, you can wait a few minutes or else schedule your meet. </div>}
                {selectedDocStatus && selectedDocAvailable && <div className="not-available-note">Oops! {selectedDoc} is currently in another meet, you can wait a few minutes or else schedule your meet. </div>}
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
};

export default Doctors;
