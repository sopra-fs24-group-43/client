import React, { useEffect, useState, useRef } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { User } from "types";
import "styles/views/Game.scss";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const Game = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPosition, setPrevPosition] = useState<{ x: number; y: number }>(
    null
  );

  const logout = (): void => {
    localStorage.removeItem("token");
    navigate("/loginOrRegister");
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
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
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDrawing) return;
      const { x, y } = prevPosition;
      const newX = event.offsetX;
      const newY = event.offsetY;

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
