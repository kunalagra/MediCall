import { JitsiMeeting } from "@jitsi/react-sdk";
import React, { useRef, useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { TbTrash } from 'react-icons/tb';
import { MdContentCopy } from 'react-icons/md';
import { Alert } from "@mui/material";
import useDocTitle from "../hooks/useDocTitle";
import commonContext from "../contexts/common/commonContext";
import httpClient from "../httpClient";
import PDFGenerator from "../components/pdfgenerator/PDFGenerator";

const MeetPage = () => {

  const navigate = useNavigate(); 
  const userNotExists = localStorage.getItem("usertype")===undefined || localStorage.getItem("usertype")===null;

  useEffect(() => {
      if(userNotExists) {
          navigate("/");
      }
      //eslint-disable-next-line
  }, []);

  const apiRef = useRef();
  //eslint-disable-next-line
  const [logItems, updateLog] = useState([]);
  const [knockingParticipants, updateKnockingParticipants] = useState([]);
  const [searchparams] = useSearchParams();
  const meetId = searchparams.get("meetId");

  const { toggleFeedback } = useContext(commonContext);

  const isDoctor = localStorage.getItem("usertype")==="doctor";
  const email = searchparams.get("pemail");
  const phone = localStorage.getItem("phone");
  const [prescription, setPrescription] = useState([]);
  const [newPrescription, setNewPrescription] = useState({name: "", dosage: "", duration: "", durationUnit: "day(s)", dosageTime: "Before Food"});
  const [copyAlert, setCopyAlert] = useState(false);
  const [isInvDosage, setInvDosage] = useState(false);
  const [isInvDuration, setInvDuration] = useState(false);

  const [sendingMsg, setSendingMsg] = useState("Send");

  useDocTitle("Meet");

  useEffect(() => {
    // console.log(searchparams.get("name"))
      localStorage.setItem("lastMeetWith", searchparams.get("selectedDoc"));
      localStorage.setItem("lastMeetMail", searchparams.get("selectedMail"));
    //eslint-disable-next-line
  }, []);

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
    toggleFeedback(true);
    httpClient.put('/delete_meet', { email: searchparams.get("selectedMail")} )
    .then((res) => {
      navigate("/Home");
    }).catch((err) => {
      console.log(err);
    });
  };

  const handleDocEndMeeting = () => {
    toggleFeedback(true);
    httpClient.put('/delete_meet', { email: searchparams.get("selectedMail")} )

  };

  // const generateRoomName = () => `JitsiMeetRoomNo${Math.random() * 100}-${Date.now()}`;
  // const generateRoomName = () => meetId;

  // const renderButtons = () => (
  //   <div style={{ margin: "15px 0" }}>
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //       }}
  //       className="renderButtons"
  //     >
  //       <button
  //         type="text"
  //         title="Click to execute toggle raise hand command"
  //         style={{
  //           border: 0,
  //           borderRadius: "6px",
  //           fontSize: "14px",
  //           background: "#f8ae1a",
  //           color: "#040404",
  //           padding: "12px 46px",
  //           margin: "2px 2px",
  //         }}
  //         onClick={() => apiRef.current.executeCommand("toggleRaiseHand")}
  //       >
  //         Raise hand
  //       </button>
  //       <button
  //         type="text"
  //         title="Click to approve/reject knocking participant"
  //         style={{
  //           border: 0,
  //           borderRadius: "6px",
  //           fontSize: "14px",
  //           background: "#0056E0",
  //           color: "white",
  //           padding: "12px 46px",
  //           margin: "2px 2px",
  //         }}
  //         onClick={() =>
  //           resolveKnockingParticipants(({ name }) => !name.includes("test"))
  //         }
  //       >
  //         Resolve lobby
  //       </button>
  //       <button
  //         type="text"
  //         title="Click to execute subject command"
  //         style={{
  //           border: 0,
  //           borderRadius: "6px",
  //           fontSize: "14px",
  //           background: "#3D3D3D",
  //           color: "white",
  //           padding: "12px 46px",
  //           margin: "2px 2px",
  //         }}
  //         onClick={() =>
  //           apiRef.current.executeCommand("subject", "New Subject")
  //         }
  //       >
  //         Change subject
  //       </button>
  //       <button
  //         type="text"
  //         title="Click to end the meeting"
  //         style={{
  //           border: 0,
  //           borderRadius: "6px",
  //           fontSize: "14px",
  //           background: "#df486f",
  //           color: "white",
  //           padding: "12px 46px",
  //           margin: "2px 2px",
  //         }}
  //         onClick={handleEndMeeting}
  //         disabled={prescription.length > 0}
  //       >
  //         End Meeting
  //       </button>
  //     </div>
  //   </div>
  // );

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
    const newP = `${newPrescription.name} | ${newPrescription.dosage} (${newPrescription.dosageTime}) | ${newPrescription.duration} ${newPrescription.durationUnit}`;
    setPrescription([...prescription, newP]);
    setNewPrescription({name: "", dosage: "", duration: "", durationUnit: "day(s)", dosageTime: "Before Food"});
  }

  const handleFormSubmit = () => {
    // const pdf = PDFGenerator({...searchparams}, [...prescription]);
    const pdf = PDFGenerator({
      name: searchparams.get("name")? searchparams.get("name") : "Mr. ABC DEF",
      age: searchparams.get("age")? searchparams.get("age") : "NA",
      gender: searchparams.get("gender")? searchparams.get("gender")[0].toUpperCase() + searchparams.get("gender").slice(1).toLowerCase() : "NA",
      selectedDoc: searchparams.get("selectedDoc")? searchparams.get("selectedDoc") : "Doctor_Name"
    }, prescription);
    setSendingMsg("Sending...");
    var file = pdf.output('blob');
    // console.log(file);
    let bodyContent = new FormData();
    bodyContent.append("email", email);
    bodyContent.append("file", file);
    httpClient.post("mail_file", bodyContent , {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      console.log(res);
      setSendingMsg("Sent");
      setTimeout(() => {
        setSendingMsg("Send");
      }, 3000);
      httpClient.put('/delete_meet', { "email": searchparams.get("selectedMail") })
      navigate("/");
    }).catch((err) => {
      console.log(err);
    });
    
    setPrescription([]);
    setNewPrescription({name: "", dosage: "", duration: "", durationUnit: "day(s)", dosageTime: "Before Food"});
    // console.log(email, phone);
    // console.log(prescription);
  };

  const handleDownload = () => {
    const pdf = PDFGenerator({
      name: searchparams.get("name")? searchparams.get("name") : "Mr. ABC DEF",
      age: searchparams.get("age")? searchparams.get("age") : "NA",
      gender: searchparams.get("gender")? searchparams.get("gender")[0].toUpperCase() + searchparams.get("gender").slice(1).toLowerCase() : "NA",
      selectedDoc: searchparams.get("selectedDoc")? searchparams.get("selectedDoc") : "Doctor_Name"
    }, prescription);
    pdf.save("Medicall-Invoice.pdf");

  }

  if(userNotExists) {
    return <></>;
  }
  return (
    <div id="meet-page">
      <h2 className="meet-header">Live Meet  <span className="copy-icon" onClick={() => {
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
            roomName={meetId}
            spinner={renderSpinner}
            configOverwrite={{
              subject: "Video Call",
              hideConferenceSubject: true,
              startWithAudioMuted: true,
              disableModeratorIndicator: true,
              startScreenSharing: false,
              enableEmailInStats: false,
              enableClosePage: false

            }}
            onApiReady={(externalApi) => handleApiReady(externalApi)}
            onReadyToClose={isDoctor ? handleDocEndMeeting : handleEndMeeting}
            getIFrameRef={handleJitsiIFrameRef1}
            interfaceConfigOverwrite = {{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                SHOW_PROMOTIONAL_CLOSE_PAGE: false,
                SHOW_JITSI_WATERMARK: false
            }}
            userInfo = {{
                displayName: isDoctor ? searchparams.get("selectedDoc") : searchparams.get("name")
            }}
        />
      </div>

      {/* {renderButtons()} */}

      {isDoctor && (

        <div className="doctor-prescription">
            <h2 className="prescription-header">Prescription</h2>

            {  prescription.length > 0 && (
                <div className="prescription-items">
                    { prescription.map((item, index) => (
                        <div className="item" key={index}>
                            <div className="prescription">
                                <p>{item}</p>
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
                <div className="input_boxes">
                    <div className="input_box">
                      <input
                          type="text"
                          className="input_field"
                          value={newPrescription.name}
                          onChange={(e) => setNewPrescription({...newPrescription, name: e.target.value})}
                          placeholder="Medicine Name"
                      />
                    </div>
                    <div className="input_box">
                      <div className="box">
                        <input
                            type="text"
                            className="input_field"
                            value={newPrescription.dosage}
                            onChange={(e) => {
                              setInvDosage(!(/^[0-1]-[0-1]-[0-1]$/.test(e.target.value)));
                              setNewPrescription({...newPrescription, dosage: e.target.value});
                            }}
                            placeholder="Dosage i.e. 1-0-0"
                        />
                        <select value={newPrescription.dosageTime} onChange={(e) => setNewPrescription({...newPrescription, dosageTime: e.target.value})}>
                          <option value="Before Food">Before Food</option>
                          <option value="After Food">After Food</option>
                        </select>
                      </div>
                      <div className="box">
                        <input
                            type="text"
                            className="input_field"
                            value={newPrescription.duration}
                            onChange={(e) => {
                              setInvDuration(!(/^[0-9]{1,9}$/.test(e.target.value)));
                              setNewPrescription({...newPrescription, duration: e.target.value});
                            }}
                            placeholder="Duration"
                        />
                        <select value={newPrescription.durationUnit} onChange={(e) => setNewPrescription({...newPrescription, durationUnit: e.target.value})}>
                          <option value="day(s)">day(s)</option>
                          <option value="month(s)">month(s)</option>
                        </select>
                      </div>
                    </div>
                </div>
                <div className="add-btn">
                  <button onClick={addPrescriptionItem} disabled={(newPrescription.name.length===0) || newPrescription.dosage==="" || newPrescription.duration==="" || isInvDosage || isInvDuration}>
                      Add
                  </button>
                  {isInvDosage && <Alert severity="error">Dosage should be in the form of n-n-n</Alert>}
                  {isInvDuration && <Alert severity="error">Invalid Duration</Alert>}
                </div>
            </div>
            <div className="send-prescription">
                <button className="send-btn" onClick={handleFormSubmit}>{sendingMsg}</button>
                <button className="download-btn" onClick={handleDownload}>Download</button>
            </div>
            <div style={{marginTop: "10px"}}>Note: Please ensure that you covered the prescription correctly before clicking the 'send' button.</div>
        </div>

      )}
    </div>
  );
};

export default MeetPage;