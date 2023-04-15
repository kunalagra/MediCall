import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi"
import Modal from '@mui/material/Modal';
import { IoMdClose } from "react-icons/io";
import useDocTitle from "../hooks/useDocTitle";


const Doctors = () => {

    useDocTitle("Doctors");

    const [meetModal, setMeetModal] = useState(false);
    
    // temporary doctors data
    const doctors = [
        {
            id: 1,
            username: "Ganesh Utla",
            email: "abc@gmail.com",
            gender: "male",
            specialization: "Cancer Surgeon",
            phone: "1234567890"
        },
        {
            id: 2,
            username: "Deexith Madas",
            email: "def@gmail.com",
            gender: "male",
            specialization: "Heart Surgeon",
            phone: "1234567890"
        },
        {
            id: 3,
            username: "Kunal Agrawal",
            email: "ghi@gmail.com",
            gender: "male",
            specialization: "Brain Surgeon",
            phone: "1234567890"
        },
        {
            id: 4,
            username: "Aman Tiwari",
            email: "jkl@gmail.com",
            gender: "male",
            specialization: "Penis Surgeon",
            phone: "1234567890"
        },
        {
            id: 5,
            username: "Loda insaan",
            email: "mno@gmail.com",
            gender: "male",
            specialization: "Chutiyapa",
            phone: "1234567890"
        },
    ];

    const doctorNames = doctors.map(item => "Dr. " + item.username.split(" ").map(item => item[0].toUpperCase() + item.slice(1).toLowerCase()).join(" "));
    const [selectedDoc, setSelectedDoc] = useState(doctorNames[0]);
    
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
                    <BsWhatsapp className="social-icon" />
                  </IconButton>
                  <IconButton onClick={() => {
                    window.open(`mailto:${params.row.email}`, "_blank");
                  }}>
                    <HiOutlineMail className="social-icon" />
                  </IconButton>
              </div>
            )
          },
        },
        {
            field: "appointments", 
            headerName: "Book an Appointment", headerAlign: "center", align: "center", width: 150,
            renderCell: (params) => {
                return (
                    <div className="appointment-column--cell">
                      <button>
                        BOOK NOW
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
              <h3>Want to meet?</h3>
              <div className="meet-details">
                <div className="create-meet" onClick={() => {setMeetModal(true)}}>Create an Instant meet</div>
                <div className="create-meet">Schedule a meet</div>
              </div>
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
          <div id="meet-modal">
            <div className="close_btn_div">
              <IoMdClose onClick={() => setMeetModal(false)} />
            </div>
            <div className="meet_details">
              <div className="input_box">
                <label className="select_input_label">Select the Doctor</label>
                <select value={selectedDoc} onChange={(e) => setSelectedDoc(e.target.value)}>
                  { doctorNames.map((docName, index) => (
                    <option key={index} value={docName}>{docName}</option>
                  ))}
                </select>
              </div>
              <div className="start_btn_div">
                <Link className="btn start_btn" to={`/instant-meet?meetId=abc&selectedDoc=${selectedDoc}`}>Start now</Link>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
};

export default Doctors;
