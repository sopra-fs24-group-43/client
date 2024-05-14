import React, { useEffect, useState, useRef, useContext} from "react";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Chat.scss";
import ButtonComponent from "components/elements/game/ButtonComponent";
import { Context } from "../../context/Context";

const Chat = () => {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const chatMessagesRef = useRef(null);
  const context = useContext(Context);
  const {stompApi} = context;  //or const stompApi = context.stompApi

  const gameId = 1;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/loginOrRegister");
    }

    stompApi.subscribe(`/topic/games/${gameId}/sendguess`, onHandleMessage)
    return () => {
      stompApi.unsubscribe(); 
    };
  }, [navigate, context]);

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      const newMessage = localStorage.username +": "+ `${currentMessage}`;
      const username = localStorage.username;
      const answerString = currentMessage;
      setChatMessages([...chatMessages, newMessage]);
      
 
      stompApi.send(`/topic/games/${gameId}/sendguess`, JSON.stringify({username, answerString}));
      setCurrentMessage("");
    }
  };

 const onHandleMessage = (payload) => {
  const payloadData = JSON.parse(payload.body);
  const { username, answerString } = payloadData;

  
  if (username !== localStorage.username) {
    const newMessage = `${username}: ${answerString}`;

    
    setChatMessages((currentMessage) => [...currentMessage, newMessage]);
  }
};

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
      <div className="chat-container">
        <div className="chat-title">Chat</div>
        <div className="chat-messages" ref={chatMessagesRef}>
          {chatMessages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyPress} 
            placeholder="Your Guess"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
  );
};

export default Chat;
