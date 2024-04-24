import React, { useEffect, useState, useRef } from "react";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";

const Game = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPosition, setPrevPosition] = useState<{ x: number; y: number }>(null);
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [isFillToolSelected, setIsFillToolSelected] = useState(false);
  const [isDrawToolSelected, setIsDrawToolSelected] = useState(true);
  const [isEraserToolSelected, setIsEraserToolSelected] = useState(false);

  const logout = (): void => {
    localStorage.removeItem("token");
    navigate("/loginOrRegister");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/loginOrRegister");
    }
  }, [navigate]);

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
      ctx.lineWidth = 3;
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
  }, [isDrawing, prevPosition, selectedColor, isFillToolSelected, isDrawToolSelected, isEraserToolSelected]);

  const handleEraserClick = () => {
    setIsEraserToolSelected(true);
    setIsDrawToolSelected(false);
    setIsFillToolSelected(false);
  };

  const handleEraseAllClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleColorButtonClick = (color: string) => {
    setSelectedColor(color);
  };

  const handleFillToolClick = () => {
    setIsFillToolSelected(true);
    setIsDrawToolSelected(false);
    setIsEraserToolSelected(false);
  };

  const handleDrawToolClick = () => {
    setIsDrawToolSelected(true);
    setIsFillToolSelected(false);
    setIsEraserToolSelected(false);
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
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const matchStartColor = (color: number[], targetColor: number[]) => {
    return (
      color[0] === targetColor[0] &&
      color[1] === targetColor[1] &&
      color[2] === targetColor[2] &&
      color[3] === targetColor[3]
    );
  };

  const drawButtonClassName = isDrawToolSelected ? "selected" : "";
  const fillButtonClassName = isFillToolSelected ? "selected" : "";
  const eraserButtonClassName = isEraserToolSelected ? "selected" : "";

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
              <button
                className="color-button"
                style={{ backgroundColor: "red", width: "25px", height: "25px" }}
                onClick={() => handleColorButtonClick("red")}
              />
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
        <div className="tools-container">
          <Button
            onClick={handleDrawToolClick}
            className={`tool-button ${drawButtonClassName}`}
            style={{ marginRight: "4px", marginTop: "5px"}}
          >
            Draw
          </Button>
          <Button
            onClick={handleFillToolClick}
            className={`tool-button ${fillButtonClassName}`}
            style={{ marginRight: "4px", marginTop: "5px"}}
          >
            Fill
          </Button>
          <Button
            onClick={handleEraserClick}
            className={`tool-button ${eraserButtonClassName}`}
            style={{ marginRight: "4px", marginTop: "5px"}}
          >
            Eraser
          </Button>
          <Button 
          onClick={handleEraseAllClick}
          
          style={{ marginRight: "4px", marginTop: "5px"}}
          >
            Erase All
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Game;
