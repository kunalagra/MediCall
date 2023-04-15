import { JitsiMeeting } from "@jitsi/react-sdk";
import React, { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { TbTrash } from 'react-icons/tb';
import { MdContentCopy } from 'react-icons/md';
import { Alert } from "@mui/material";
import useDocTitle from "../hooks/useDocTitle";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { imageData } from "../data/logoDataURL";
import { signImageData } from "../data/signDataURL";

const MeetPage = () => {
  const apiRef = useRef();
  //eslint-disable-next-line
  const [logItems, updateLog] = useState([]);
  const [knockingParticipants, updateKnockingParticipants] = useState([]);
  const [searchparams] = useSearchParams();
  const meetId = searchparams.get("meetId");
//   const navigate = useNavigate();

    const isDoctor = localStorage.getItem("usertype")==="doctor";
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phone");
    const [prescription, setPrescription] = useState([]);
    const [newPrescription, setNewPrescription] = useState([]);
    const [copyAlert, setCopyAlert] = useState(false);

    useDocTitle("Meet");

  const printEventOutput = (payload) => {
    updateLog((items) => [...items, JSON.stringify(payload)]);
  };

  const handleAudioStatusChange = (payload, feature) => {
    if (payload.muted) {
      updateLog((items) => [...items, `${feature} off`]);
    } else {
      updateLog((items) => [...items, `${feature} on`]);
    }
  };

  const handleChatUpdates = (payload) => {
    if (payload.isOpen || !payload.unreadCount) {
      return;
    }
    apiRef.current.executeCommand("toggleChat");
    updateLog((items) => [
      ...items,
      `you have ${payload.unreadCount} unread messages`,
    ]);
  };

  const handleKnockingParticipant = (payload) => {
    updateLog((items) => [...items, JSON.stringify(payload)]);
    updateKnockingParticipants((participants) => [
      ...participants,
      payload?.participant,
    ]);
  };

  const resolveKnockingParticipants = (condition) => {
    knockingParticipants.forEach((participant) => {
      apiRef.current.executeCommand(
        "answerKnockingParticipant",
        participant?.id,
        condition(participant)
      );
      updateKnockingParticipants((participants) =>
        participants.filter((item) => item.id === participant.id)
      );
    });
  };

  const handleJitsiIFrameRef1 = (iframeRef) => {
    iframeRef.style.border = "10px solid #3d3d3d";
    iframeRef.style.background = "#3d3d3d";
    iframeRef.style.height = "400px";
    iframeRef.style.marginBottom = "20px";
  };

  const handleApiReady = (apiObj) => {
    apiRef.current = apiObj;
    apiRef.current.on("knockingParticipant", handleKnockingParticipant);
    apiRef.current.on("audioMuteStatusChanged", (payload) =>
      handleAudioStatusChange(payload, "audio")
    );
    apiRef.current.on("videoMuteStatusChanged", (payload) =>
      handleAudioStatusChange(payload, "video")
    );
    apiRef.current.on("raiseHandUpdated", printEventOutput);
    apiRef.current.on("titleViewChanged", printEventOutput);
    apiRef.current.on("chatUpdated", handleChatUpdates);
    apiRef.current.on("knockingParticipant", handleKnockingParticipant);
  };

  const handleReadyToClose = () => {
    console.log("Ready to close...");
  };

  const handleEndMeeting = () => {
    if (isDoctor === "doctor") {
    //   httpClint
    //     .get("/del-meet")
    //     .then((response) => {
    //       navigate("/");
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // } else {
    //   navigate("/invoice");
    }
  };

  // const generateRoomName = () => `JitsiMeetRoomNo${Math.random() * 100}-${Date.now()}`;
  const generateRoomName = () => meetId;

  const renderButtons = () => (
    <div style={{ margin: "15px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          type="text"
          title="Click to execute toggle raise hand command"
          style={{
            border: 0,
            borderRadius: "6px",
            fontSize: "14px",
            background: "#f8ae1a",
            color: "#040404",
            padding: "12px 46px",
            margin: "2px 2px",
          }}
          onClick={() => apiRef.current.executeCommand("toggleRaiseHand")}
        >
          Raise hand
        </button>
        <button
          type="text"
          title="Click to approve/reject knocking participant"
          style={{
            border: 0,
            borderRadius: "6px",
            fontSize: "14px",
            background: "#0056E0",
            color: "white",
            padding: "12px 46px",
            margin: "2px 2px",
          }}
          onClick={() =>
            resolveKnockingParticipants(({ name }) => !name.includes("test"))
          }
        >
          Resolve lobby
        </button>
        <button
          type="text"
          title="Click to execute subject command"
          style={{
            border: 0,
            borderRadius: "6px",
            fontSize: "14px",
            background: "#3D3D3D",
            color: "white",
            padding: "12px 46px",
            margin: "2px 2px",
          }}
          onClick={() =>
            apiRef.current.executeCommand("subject", "New Subject")
          }
        >
          Change subject
        </button>
        <button
          type="text"
          title="Click to end the meeting"
          style={{
            border: 0,
            borderRadius: "6px",
            fontSize: "14px",
            background: "#df486f",
            color: "white",
            padding: "12px 46px",
            margin: "2px 2px",
          }}
          onClick={() => handleEndMeeting()}
        >
          End Meeting
        </button>
      </div>
    </div>
  );

  const renderSpinner = () => (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      Loading..
    </div>
  );

  const deletePrescriptionItem = (ind) => {
    setPrescription(prescription.filter(( _ ,index) => index!==ind));
  }

  const addPrescriptionItem = () => {
    setPrescription([...prescription, newPrescription]);
    setNewPrescription("");
  }

  const handleFormSubmit = () => {
    console.log(email, phone);
    console.log(prescription);
  };

  const handleDownload = () => {
    const pdf = new jsPDF("p", "pt", "a4");
    let y = 50;

    pdf.addImage(imageData, 'PNG', 40, 0, 140, 140);

    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(25);
    pdf.setTextColor(74, 76, 178);
    
    pdf.text("MEDICALL", (pdf.internal.pageSize.width - 40 - (pdf.getStringUnitWidth("MEDICALL") * pdf.internal.getFontSize())), y);
    y += 30;
    
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(15);
    pdf.setTextColor(0, 0, 0);

    pdf.text("Mumbai, India", (pdf.internal.pageSize.width - 40 - (pdf.getStringUnitWidth("Mumbai, India") * pdf.internal.getFontSize())), y);
    y += 20;
    pdf.text("+91 12345 67890", (pdf.internal.pageSize.width - 40 - (pdf.getStringUnitWidth("+91 12345 67890") * pdf.internal.getFontSize())), y);
    y += 20;
    pdf.text("medicall@gmail.com", (pdf.internal.pageSize.width - 40 - (pdf.getStringUnitWidth("medicall@gmail.com") * pdf.internal.getFontSize())), y);
    y += 25;

    pdf.setFillColor(74, 76, 178);
    pdf.setDrawColor(74, 76, 178);
    pdf.rect(40, y, 515, 5, "FD");

    y += 50;
    pdf.setFontSize(15);
    const name = localStorage.getItem("username")? localStorage.getItem("username") : "Mr. ABC DEF";
    const age = localStorage.getItem("age")? localStorage.getItem("age") : "NA";
    const gender = localStorage.getItem("gender")? localStorage.getItem("gender") : "NA";
    const d = new Date();
    const date = (d.getDate() < 10? '0' + d.getDate() : d.getDate()) + '/' + (d.getMonth() < 10? '0' + d.getMonth() : d.getMonth()) + '/' + d.getFullYear();
    const selectedDoc = searchparams.get("selectedDoc");
    
    pdf.setFont("Times New Roman", "bold");
    pdf.text("Name: ", 40, y);
    pdf.setFont("Times New Roman", "normal");
    pdf.text(name, 45 + pdf.getStringUnitWidth("Name: ") * pdf.internal.getFontSize(), y);

    pdf.setFont("Times New Roman", "bold");
    pdf.text("Age: ", 275, y);
    pdf.setFont("Times New Roman", "normal");
    pdf.text(age, 280 + pdf.getStringUnitWidth("Age: ") * pdf.internal.getFontSize(), y);
    
    pdf.setFont("Times New Roman", "bold");
    pdf.text("Gender: ", pdf.internal.pageSize.width - 45 - pdf.getStringUnitWidth(`Gender: ${gender}`) * pdf.internal.getFontSize(), y);
    pdf.setFont("Times New Roman", "normal");
    pdf.text(gender, pdf.internal.pageSize.width - 40 - pdf.getStringUnitWidth(gender) * pdf.internal.getFontSize(), y);

    y += 30
    pdf.setFont("Times New Roman", "bold");
    pdf.text("Consulted By: ", 40, y);
    pdf.setFont("Times New Roman", "normal");
    pdf.text(selectedDoc, 45 + pdf.getStringUnitWidth("Consulted By: ") * pdf.internal.getFontSize(), y);

    pdf.setFont("Times New Roman", "bold");
    pdf.text("Date: ", pdf.internal.pageSize.width - 45 - pdf.getStringUnitWidth(`Date: ${date}`) * pdf.internal.getFontSize(), y);
    pdf.setFont("Times New Roman", "normal");
    pdf.text(date, pdf.internal.pageSize.width - 40 - pdf.getStringUnitWidth(date) * pdf.internal.getFontSize(), y);

    y += 50

    // const pre = ["Metodyl", "Cough Syrup", "Lokinozol", "Hexagoanl", "Qaudagozone", "Lipaipo"];
    const l1 = [[1,"Consultation Fee", 200], [2,"Doctor Fee", 150], ...prescription.map((item, index) => [index+3, item, 0])];
    const totalCost = 350;

    pdf.autoTable({
      head: [["SrNo", "Item", "Cost (in Rs.)"]],
      body: l1,
      startY: y,
      headStyles: {
        valign: "middle",
        halign: "center",
        fontSize: 13
      },
      bodyStyles: {
        valign: "middle",
        halign: "center",
        fontSize: 12
      }
    });

    y += (30 * l1.length) + 10;

    pdf.setFont("Times New Roman", "bold");
    pdf.text("Total Cost: ", pdf.internal.pageSize.width - 45 - pdf.getStringUnitWidth(`Total Cost: Rs. ${totalCost}`) * pdf.internal.getFontSize(), y);
    pdf.setFont("Times New Roman", "normal");
    pdf.text(`Rs. ${totalCost}`, pdf.internal.pageSize.width - 40 - pdf.getStringUnitWidth(`Rs. ${totalCost}`) * pdf.internal.getFontSize(), y);
    y += 50;
    
    pdf.setFont("Times New Roman", "bold");
    pdf.setFontSize(13);
    pdf.text("NOTE: ", 40, y);
    pdf.setFont("Times New Roman", "italic");
    pdf.text('The cost for the medicines in the prescription are given 0 as the patient have to buy these', 45 + pdf.getStringUnitWidth("NOTE: ") * pdf.internal.getFontSize(), y);
    y += 18;
    pdf.text("medicines from the medical store. You can purchase these medicines from the given link: ", 40, y);
    y += 18;
    pdf.text("https://medicall.com/buy-medicines.", 40, y);

    y += 100;
    pdf.setFont("Times New Roman", "bold");
    pdf.setFontSize(15);
    pdf.text("Signature: ", 40, y);

    pdf.addImage(signImageData, 50 + pdf.getStringUnitWidth("Signature: ") * pdf.internal.getFontSize(), y - 33, 150, 47);

    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(150);
    pdf.text("2023 @MediCall | All Rights Reserved", pdf.internal.pageSize.width - 40 - pdf.getStringUnitWidth("2023 @MediCall | All Rights Reserved") * pdf.internal.getFontSize(), pdf.internal.pageSize.height - 30);


    pdf.save("Medicall-Invoice.pdf");

  }

  return (
    <div id="meet-page">
      <h2 className="meet-header">Video Meet {`(Meet ID: ${meetId})`} <span className="copy-icon" onClick={() => {
        setCopyAlert(true);
        navigator.clipboard.writeText(`https://meet.jit.si/${meetId}`);
        setTimeout(() => setCopyAlert(false), 2000);
      }}>
        <MdContentCopy />
        { copyAlert && (
          <div className="copy-alert">
            <Alert severity="success">Copied</Alert>
          </div>
        )}
        </span>
      </h2>
      <div className="jitsi-component-div">
        <JitsiMeeting
            // domain="http://localhost:8000/"
            roomName={generateRoomName()}
            spinner={renderSpinner}
            configOverwrite={{
              subject: "XYZ",
              hideConferenceSubject: false,
              startWithAudioMuted: true,
              disableModeratorIndicator: true,
              startScreenSharing: true,
              enableEmailInStats: false
            }}
            onApiReady={(externalApi) => handleApiReady(externalApi)}
            onReadyToClose={handleReadyToClose}
            getIFrameRef={handleJitsiIFrameRef1}
            interfaceConfigOverwrite = {{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
            }}
            userInfo = {{
                displayName: 'ABCD'
            }}
        />
      </div>

      {renderButtons()}

      {isDoctor && (

        <div className="doctor-prescription">
            <h2 className="prescription-header">Prescription</h2>

            {  prescription.length > 0 && (
                <div className="prescription-items">
                    { prescription.map((item, index) => (
                        <div className="item" key={index}>
                            <div className="prescription">
                                <p>{item}</p>
                                <div className="tooltip">{item}</div>
                            </div>
                            <div className="delete-item">
                                <span onClick={() => {deletePrescriptionItem(index)}}>
                                    <TbTrash />
                                </span>
                                <div className="tooltip">Remove Item</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="new_prescription">
                <div className="input_box">
                    <input
                        type="text"
                        className="input_field"
                        value={newPrescription}
                        onChange={(e) => setNewPrescription(e.target.value)}
                        placeholder="Add Something..."
                        required
                    />
                </div>
                <button onClick={addPrescriptionItem} disabled={newPrescription.length===0}>
                    Add
                </button>
            </div>
            <div className="send-prescription">
                <button className="send-btn" onClick={handleFormSubmit}>Send</button>
                <button className="download-btn" onClick={handleDownload}>Download</button>
            </div>
        </div>

      )}
    </div>
  );
};

export default MeetPage;