import React, { useEffect, useState, useRef, useContext} from "react";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
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
  }, [navigate]);

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      const newMessage = localStorage.username +": "+ `${currentMessage}`;
      setChatMessages([...chatMessages, newMessage]);
      setCurrentMessage("");
    }
  };

  const onHandleMessage = (payload) =>{
    console.log("CHATMESSAGES ARRAY BEFORE ADD NEW MESSAGE" + chatMessages);

    const payloadData = JSON.parse(payload.body);
    const {username, answerString} = payloadData;
    console.log("PAYLOAD::::::::" + username + answerString);
    console.log("Message From " + username + " to " + localStorage.username);
    if(username === localStorage.username) {
      console.log("Message to Self");
    } else {
      console.log("Message from Other");
      const newMessage = `${username}: ${answerString}`;
      console.log("NEW MESSAGE:  " + newMessage);
      setChatMessages([...chatMessages, newMessage]);
      console.log(chatMessages);
    }
  }

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
