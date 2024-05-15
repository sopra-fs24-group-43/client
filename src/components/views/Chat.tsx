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
  const {stompApi, reload, setReload} = context;  //or const stompApi = context.stompApi

  let gameId;
  gameId = sessionStorage.getItem("gameId")

  let subscribed
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/loginOrRegister");
    }
    if (stompApi.isConnected() && !subscribed) {
      console.log("subscribed in Chat")
      stompApi.subscribe(`/topic/games/${gameId}/sendguess`, onHandleMessage)
      subscribed = true;
    }
    return () => {
      stompApi.unsubscribe();
      subscribed = false;
    };
  }, [navigate, context, reload]); //add reload so that Chat subscribes

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      const newMessage = sessionStorage.username +": "+ `${currentMessage}`;
      const username = sessionStorage.username;
      const answerString = currentMessage;
      setChatMessages([...chatMessages, newMessage]);
      
 
      stompApi.send(`/topic/games/${gameId}/sendguess`, JSON.stringify({username, answerString}));
      setCurrentMessage("");
    }
  };

 const onHandleMessage = (payload) => {
  const payloadData = JSON.parse(payload.body);
  const { username, answerString } = payloadData;

  
  if (username !== sessionStorage.username) {
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
