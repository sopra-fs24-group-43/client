import React, { useEffect, useState, useRef } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { User } from "types";
import "styles/views/Game.scss";

import WebSocketService from "../../helpers/WebSocketService";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

export const webSocketService = new WebSocketService();

const Game = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPosition, setPrevPosition] = useState<{ x: number; y: number }>(
    null
  ); // problem in use state?
  // const [renderPrevPosition, setRenderPrevPosition] = useState<{ x: number; y: number }>(
  //   null
  // );

  const logout = (): void => {
    localStorage.removeItem("token");
    navigate("/loginOrRegister");
  };

  // const connect =()=>{
  //   //const stompClient = StompJs.client('ws://localhost:8080/ws')
  //   let Sock = new SockJS('http://localhost:8080/ws');
  //   stompClient = over(Sock);
  //   stompClient.connect({}, onConnected, onError);
  // }

  const onConnectedCallback = () => {     //connectCallback
    // stompClient.subscribe('/settings', onMessageReceived);
    webSocketService.subscribe('/settings', onMessageReceived);
  };

  const onErrorCallback = (err) => {      //errorcallback
    console.log("Error: ", err);
  };
  
  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    console.log("PayLoad:", payloadData);

    // rendering of canvas
    rendering(payloadData);
  };

  // const sendCoordinates = (coordinates) => {
  //   stompClient.send("/app/message", {}, JSON.stringify(coordinates));
  // };

  const rendering = (payloadData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const { x, y } = payloadData;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      
      // connection
      webSocketService.connect(
        'http://localhost:8080/ws',
        onConnectedCallback,
        onErrorCallback
      );
  
    } else {
      navigate("/loginOrRegister");
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const handleMouseDown = (event: MouseEvent) => {
      setIsDrawing(true);
      setPrevPosition({ x: event.offsetX, y: event.offsetY });
      // sendCoordinates({ x: event.offsetX, y: event.offsetY });
      // stompClient.send("/app/message", {}, JSON.stringify({ x: event.offsetX, y: event.offsetY }));
      webSocketService.send("/app/message", {}, JSON.stringify({ x: event.offsetX, y: event.offsetY }));
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDrawing) return;
      const { x, y } = prevPosition;
      
      // send coordinated
      // sendCoordinates({ x, y });
      console.log("REAL X: ", x, " REAL Y: ", y)
      // stompClient.send("/app/message", {}, JSON.stringify({ x, y }));
      webSocketService.send("/app/message", {}, JSON.stringify({ x, y }));

      const newX = event.offsetX;
      const newY = event.offsetY;

      // stompClient.send("/app/message", {}, JSON.stringify({ newX, newY }));

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(newX, newY);
      ctx.stroke();

      setPrevPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      // webSocketService.disconnect();
    };
  }, [isLoggedIn, isDrawing, prevPosition]);

  const handleEraserClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  let content = <Spinner />;

  if (isLoggedIn) {
    content = (
      <div className="game-container">
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ border: "1px solid black" }}
          />
          <Button onClick={logout}>Logout</Button>
        </div>
        <div className="eraser-container">
          <Button onClick={handleEraserClick}>Eraser</Button>
        </div>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      {content}
    </BaseContainer>
  );
};

export default Game;
