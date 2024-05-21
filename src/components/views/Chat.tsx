import React, { useEffect, useState, useRef, useContext} from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/Chat.scss";
import { Context } from "../../context/Context";

const Chat = ({isChatting, setIsChatting}) => {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const chatMessagesRef = useRef(null);
  const context = useContext(Context);
  const {stompApi, reload, setReload} = context;  //or const stompApi = context.stompApi
  // const [isChatting, setIsChatting] = useState(false);

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

  const handleFocus = () => {
    setIsChatting(true);
  };

  const handleClose = () => {
    setIsChatting(false); 
  };
  
  return (
    <div className={`Chat${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} container`}>
      <div className={`Chat${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} title`}>Chat</div>
        <div className={`Chat${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} messages`} ref={chatMessagesRef}>
          {chatMessages.map((message, index) => (
            <div className={`Chat${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} message`} key={index}>{message}</div>
          ))}
        </div>
      <div className={`Chat${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} input-form`}>
        <input
          className={`Chat${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} input`}
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleClose}
          onKeyDown={handleKeyPress} 
          placeholder="Type your guess here..."
        />
      </div>
    </div>
  );
};

export default Chat;
