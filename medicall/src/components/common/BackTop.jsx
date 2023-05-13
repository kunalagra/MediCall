import React, { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { AiFillWechat } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Chatbot from "./Chatbot";
// import useScrollDisable from "../../hooks/useScrollDisable";

const BackTop = () => {

  const [isVisible, setIsVisible] = useState(false);
  const [chatModal, setChatModal] = useState(false);
  const navigate = useNavigate();

  // useScrollDisable(!chatModal);

  // back-to-top visibility toggling
  useEffect(() => {
    const handleScroll = () =>
      window.scrollY >= 100 ? setIsVisible(true) : setIsVisible(false);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // back-to-top functionality
  const handleBackTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div id="back-top-div">
      {
        chatModal? (
          <div id="chatbot-modal">
            <Chatbot />
          </div>
        ) : (
          <div
            className={`back_top ${isVisible ? "popped" : ""}`}
            title="Back to top"
            onClick={handleBackTop}
          >
            <FaChevronUp />
          </div>
        )
      }
      <div
        onClick={() => setChatModal(!chatModal)}
        className="back_top popped chat_icon"
        title="Wanna Chat?"
      >
        <AiFillWechat />
      </div>
    </div>
  );
};

export default BackTop;
