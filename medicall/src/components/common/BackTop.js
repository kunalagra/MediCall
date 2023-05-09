import React, { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { AiFillWechat } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const BackTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

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
    <>
      <div
        className={`back_top ${isVisible ? "popped" : ""}`}
        title="Back to top"
        onClick={handleBackTop}
      >
        <FaChevronUp />
      </div>
      <div
        onClick={() => navigate("/chatbot")}
        className="back_top popped chat_icon"
        title="Wanna Chat?"
      >
        <AiFillWechat />
      </div>
    </>
  );
};

export default BackTop;
