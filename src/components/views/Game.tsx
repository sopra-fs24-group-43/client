import React, { useEffect, useState, useRef } from "react";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import ButtonComponent from "components/elements/game/ButtonComponent";

import { stompApi } from "./LandingPage";

const Game = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPosition, setPrevPosition] = useState<{ x: number; y: number }>(null);
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [isFillToolSelected, setIsFillToolSelected] = useState(false);
  const [isDrawToolSelected, setIsDrawToolSelected] = useState(true);
  const [isEraserToolSelected, setIsEraserToolSelected] = useState(false);
  const [strokeSize, setStrokeSize] = useState(3);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const chatMessagesRef = useRef(null);

  const logout = (): void => {
    localStorage.removeItem("token");
    navigate("/loginOrRegister");
  };

  const gameId = 1;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/loginOrRegister");
    }

    stompApi.subscribe(`/topic/games/${gameId}/coordinates`, onHandleResponse);
    stompApi.subscribe(`/topic/games/${gameId}/fill`, onHandleFillResponse);
    stompApi.subscribe(`/topic/games/${gameId}/eraseAll`, onHandleEraseAllResponse);
    stompApi.subscribe(`/topic/games/${gameId}/eraser`, onHandleEraserResponse);
    stompApi.subscribe(`/topic/games/${gameId}/draw`, onHandleDrawResponse);
  }, [navigate]);

  const onHandleResponse = (payload) => {
    const renderCanvas = canvasRef.current;
    if (!renderCanvas) return;
    const ctx = renderCanvas.getContext("2d");
    
    const payloadData = JSON.parse(payload.body);
    console.log("payload::::", payloadData);

    const { x, y, newX, newY, selectedColor, strokeSize } = payloadData;

    console.log("selected color:::::", selectedColor);
    
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = strokeSize;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(newX, newY);
    ctx.stroke();
    
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (isEraserToolSelected) {
      ctx.globalCompositeOperation = "destination-out"; 
      ctx.lineWidth = 10; 
    } else {
      ctx.globalCompositeOperation = "source-over"; 
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = strokeSize;
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const handleMouseDown = (event: MouseEvent) => {
      if (isFillToolSelected) {
        fillArea(event.offsetX, event.offsetY, ctx);

        
      } else if (isDrawToolSelected || isEraserToolSelected) {
        setIsDrawing(true);
        setPrevPosition({ x: event.offsetX, y: event.offsetY });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDrawing || isFillToolSelected || (!isDrawToolSelected && !isEraserToolSelected)) return;
      const { x, y } = prevPosition;
      const newX = event.offsetX;
      const newY = event.offsetY;
      var eraserSelected = false;
      console.log("isEraserToolSelected::::::", isEraserToolSelected);
      if (isEraserToolSelected) {
        eraserSelected = true;
      }
      if (!isEraserToolSelected) {
        eraserSelected = false;
      }
      stompApi.send(`/app/games/${gameId}/coordinates`, JSON.stringify({ x, y, newX, newY, selectedColor, strokeSize}));

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
  }, [isDrawing, prevPosition, selectedColor, isFillToolSelected, isDrawToolSelected, isEraserToolSelected, strokeSize]);

  const onHandleEraserResponse = (payload) => {
    const renderCanvas = canvasRef.current;
    if (!renderCanvas) return;
    const ctx = renderCanvas.getContext("2d");

    const payloadData = JSON.parse(payload.body);
    console.log("payload::::", payloadData);

    const { x, y, newX, newY, selectedColor, eraserSelected } = payloadData;

    console.log("selected color:::::", selectedColor);
    console.log("isEraserSelected:", eraserSelected);

    setIsEraserToolSelected(eraserSelected);
    setIsDrawToolSelected(false);
    setIsFillToolSelected(false);
    ctx.globalCompositeOperation = "destination-out"; 
    ctx.lineWidth = 10; 
    
  }

  const handleEraserClick = () => {
    setIsEraserToolSelected(true);
    setIsDrawToolSelected(false);
    setIsFillToolSelected(false);
    const eraserSelected = true;
    stompApi.send(`/app/games/${gameId}/eraser`, JSON.stringify({eraserSelected}));
  };

  const onHandleEraseAllResponse = (payload) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const payloadData = JSON.parse(payload.body);
    const { eraseAllVar } = payloadData;
    console.log("THE VAR IS:", eraseAllVar);
    if (eraseAllVar === "EraseAll")
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  
  const handleEraseAllClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const eraseAllVar = "EraseAll";
    stompApi.send(`/app/games/${gameId}/eraseAll`, JSON.stringify(eraseAllVar));
  };

  const handleColorButtonClick = (color: string) => {
    console.log("IN Button", color, "    and ", selectedColor);
    setSelectedColor(color);
  };

  const handleFillToolClick = () => {
    setIsFillToolSelected(true);
    setIsDrawToolSelected(false);
    setIsEraserToolSelected(false);
  };

  const onHandleDrawResponse = (payload) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const payloadData = JSON.parse(payload.body);
    const { drawSelected } = payloadData;
    console.log(drawSelected);
    setIsFillToolSelected(false);
    setIsDrawToolSelected(true);
    setIsEraserToolSelected(false);
    
  };

  const handleDrawToolClick = () => {
    setIsDrawToolSelected(true);
    setIsFillToolSelected(false);
    setIsEraserToolSelected(false);
    const drawSelected = true;
    stompApi.send(`/app/games/${gameId}/draw`, JSON.stringify({drawSelected}));
  };

  const onHandleFillResponse = (payload) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
  
    const payloadData = JSON.parse(payload.body);
    const { imageDataBuffer } = payloadData;
  
    const img = new Image();
    
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0); 
    };
  
    img.src = imageDataBuffer;
  };
   
  const fillArea = (startX: number, startY: number, ctx: CanvasRenderingContext2D) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const pixelStack = [[startX, startY]];
    
    const getColorAtPixel = (x: number, y: number) => {
      const position = (y * ctx.canvas.width + x) * 4;

      return [
        imageData.data[position],
        imageData.data[position + 1],
        imageData.data[position + 2],
        imageData.data[position + 3]
      ];
    };

    const setColorAtPixel = (x: number, y: number) => {
      const position = (y * ctx.canvas.width + x) * 4;
      imageData.data[position] = parseInt(selectedColor.substr(1, 2), 16);
      imageData.data[position + 1] = parseInt(selectedColor.substr(3, 2), 16);
      imageData.data[position + 2] = parseInt(selectedColor.substr(5, 2), 16);
      imageData.data[position + 3] = 255;
    };

    const targetColor = getColorAtPixel(startX, startY);
    if (targetColor.toString() === selectedColor) return;

    while (pixelStack.length) {
      const newPos = pixelStack.pop();
      const x = newPos[0];
      let y = newPos[1];

      while (y-- >= 0 && matchStartColor(getColorAtPixel(x, y), targetColor)) {}
      y++;
      let reachLeft = false;
      let reachRight = false;

      while (y++ < ctx.canvas.height - 1 && matchStartColor(getColorAtPixel(x, y), targetColor)) {
        setColorAtPixel(x, y);

        if (x < ctx.canvas.width - 1) {
          if (matchStartColor(getColorAtPixel(x + 1, y), targetColor)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        if (x > 0) {
          if (matchStartColor(getColorAtPixel(x - 1, y), targetColor)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const dataURL = ctx.canvas.toDataURL();
    stompApi.send(`/app/games/${gameId}/fill`, JSON.stringify(dataURL));
  };

  const matchStartColor = (color: number[], targetColor: number[]) => {
    return (
      color[0] === targetColor[0] &&
      color[1] === targetColor[1] &&
      color[2] === targetColor[2] &&
      color[3] === targetColor[3]
    );
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      const newMessage = localStorage.username +": "+ `${currentMessage}`;
      setChatMessages([...chatMessages, newMessage]);
      setCurrentMessage("");
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
    <BaseContainer className="game container">
      <div className="game-container">
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ border: "1px solid black", background: "white" }}
          />
          <Button onClick={logout}>Logout</Button>
        </div>
        <div className="color-buttons-container">
          <div className="color-buttons">
            <div className="color-button" style={{ width: "50px", height: "50px" }}>
              <button
                style={{ backgroundColor: selectedColor, width: "50px", height: "50px" }}
                onClick={() => handleColorButtonClick(selectedColor)}
              />
            </div>
            <div className="color-button-row">
              <button
                className="color-button"
                style={{ backgroundColor: "white", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("white")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#d3d3d3", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#d3d3d3")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#6E95FB", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#6E95FB")}
              />
              <ButtonComponent color={"red"} changeColor={handleColorButtonClick}/> 
              <button
                className="color-button"
                style={{ backgroundColor: "#66DA3D", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#66DA3D")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#E9ED20", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#E9ED20")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#FA8633", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#FA8633")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#B149F1", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#B149F1")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#EE49F1", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#EE49F1")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#A44E1E", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#A44E1E")}
              />
            </div>
            <div className="color-button-row">
              <button
                className="color-button"
                style={{ backgroundColor: "black", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("black")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#A9A9A9", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#A9A9A9")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#0A53E1", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#0A53E1")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#CF0808", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#CF0808")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#0CAA09", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#0CAA09")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#C9CD03", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#C9CD03")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#EF6A0A", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#EF6A0A")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#82109E", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#82109E")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#9E106E", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#9E106E")}
              />
              <button
                className="color-button"
                style={{ backgroundColor: "#703717", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("#703717")}
              />
            </div>
          </div>
        </div>
        <div className="stroke-size-buttons">
          <button
            className={`stroke-size-button ${strokeSize === 3 ? "active" : ""}`}
            onClick={() => setStrokeSize(3)}
            style={{ width: "50px", height: "50px", marginTop: "7px", marginRight: "3px", outline: strokeSize === 3 ? "3px solid black" : "none", position: "relative" }}
          >
            <div className="stroke-circle" style={{ width: "10px", height: "10px", backgroundColor: "black", borderRadius: "50%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          </button>
          <button
            className={`stroke-size-button ${strokeSize === 5 ? "active" : ""}`}
            onClick={() => setStrokeSize(5)}
            style={{ width: "50px", height: "50px", marginTop: "7px", marginRight: "3px", outline: strokeSize === 5 ? "3px solid black" : "none", position: "relative" }}
          >
            <div className="stroke-circle" style={{ width: "15px", height: "15px", backgroundColor: "black", borderRadius: "50%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          </button>
          <button
            className={`stroke-size-button ${strokeSize === 8 ? "active" : ""}`}
            onClick={() => setStrokeSize(8)}
            style={{ width: "50px", height: "50px", marginTop: "7px", marginRight: "3px", outline: strokeSize === 8 ? "3px solid black" : "none", position: "relative" }}
          >
            <div className="stroke-circle" style={{ width: "20px", height: "20px", backgroundColor: "black", borderRadius: "50%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          </button>
          <button
            className={`stroke-size-button ${strokeSize === 12 ? "active" : ""}`}
            onClick={() => setStrokeSize(12)}
            style={{ width: "50px", height: "50px", marginTop: "7px", outline: strokeSize === 12 ? "3px solid black" : "none", position: "relative" }}
          >
            <div className="stroke-circle" style={{ width: "28px", height: "28px", backgroundColor: "black", borderRadius: "50%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          </button>
        </div>
        <div className="tools-container">
          <Button
            onClick={handleDrawToolClick}
            className={`tool-button ${isDrawToolSelected ? "game selected" : ""}`}
            style={{ marginRight: "4px", marginTop: "7px"}}
          >
            Draw
          </Button>
          <Button
            onClick={handleFillToolClick}
            className={`tool-button ${isFillToolSelected ? "game selected" : ""}`}
            style={{ marginRight: "4px", marginTop: "7px"}}
          >
            Fill
          </Button>
          <Button
            onClick={handleEraserClick}
            className={`tool-button ${isEraserToolSelected ? "game selected" : ""}`}
            style={{ marginRight: "4px", marginTop: "7px"}}
          >
            Eraser
          </Button>
          <Button 
            onClick={handleEraseAllClick}
            style={{ marginRight: "4px", marginTop: "7px"}}
          >
            Erase All
          </Button>
        </div>
        <div className="chat-container">
          <div className="chat-title">Guessing Chat</div> 

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
      </div>
    </BaseContainer>
  );
};

export default Game;
