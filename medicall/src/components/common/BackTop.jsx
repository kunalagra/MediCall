import React, { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { AiFillWechat } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const BackTop = () => {
  // const API_KEY = process.env.REACT_APP_API_KEY;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const systemMessage = {
    role: "system",
    content: "Only answer health related questions and do not mention anything about chatgpt and open ai",
  };
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // const navigate = useNavigate();

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

  const HEALTH_KEYWORDS = ["health", "medicine", "doctor", "hospital", "symptom", "colour blindness","myopia","hypermetropia","bronchitis","cough",
  "cold","tuberculosis","TB","dry eyes","eye","chalization","appendictius","dysepia","food poison","food poisoning","gastritis",
  "ibs","peptic ulcer","ulcer","coitis","allergy","kidney","kidney failure","kidney stone","stone","appendix", "food allergy"];

const handleSend = async (message) => {
  const newMessage = {
    message,
    direction: "outgoing",
    sender: "user",
  };
  
  const containsHealthKeywords = HEALTH_KEYWORDS.some(keyword => message.toLowerCase().includes(keyword));
  
  if (!containsHealthKeywords) {
    setMessages([
      ...messages,
      {
        message: "I'm sorry, I can only answer health-related questions.",
        sender: "ChatGPT",
      },
    ]);
    return;
  }

  const newMessages = [...messages, newMessage];

  setMessages(newMessages);
  setIsTyping(true);
  await processMessageToChatGPT(newMessages);
};


  const [messages, setMessages] = useState([
    {
      message: "Hello, This is MediBot! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // const handleSend = async (message) => {
  //   const newMessage = {
  //     message,
  //     direction: "outgoing",
  //     sender: "user",
  //   };

  //   const newMessages = [...messages, newMessage];

  //   setMessages(newMessages);
  //   setIsTyping(true);
  //   await processMessageToChatGPT(newMessages);
  // };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };
    
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        // console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });
  }


  return (
    <>
      {!open && (
        <div
          className={`back_top ${isVisible ? "popped" : ""}`}
          title="Back to top"
          onClick={handleBackTop}
        >
          <FaChevronUp />
        </div>
      )}
      <div
        onClick={() => setOpen(!open)} 
        className="back_top popped chat_icon"
        title="Wanna Chat?"
      >
        <AiFillWechat />
      </div>
      <div className={`chatbot ${open && "opened"}`}>
        <div className="chat">
          <MainContainer
          style={{border: 0, borderRadius: 10}}
          >
            <ChatContainer>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={
                  isTyping ? (
                    <TypingIndicator content="MediBot is typing" />
                  ) : null
                }
              >
                {messages.map((message, i) => {
                  // console.log(message);
                  return <Message key={i} model={message} />;
                })}
              </MessageList>
              <MessageInput placeholder="Type message here" onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </>
  );
};

export default BackTop;
