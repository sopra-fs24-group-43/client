import React, { useEffect, useState, useRef, useContext} from "react";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import "styles/views/game/Game.scss";
import "styles/views/game/Tracker.scss";
import "styles/views/game/Canvas.scss";
import { Context } from "../../context/Context";
import Chat from "./Chat";
import LeaderboardInGame from "./LeaderboardInGame";
import WordSelection from "./WordSelection";
import ReconnectPopUp from "../views/ReconnectPopUp";
import Podium from "components/elements/game/Podium";


const Game = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPosition, setPrevPosition] = useState<{ x: number; y: number }>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [isFillToolSelected, setIsFillToolSelected] = useState(false);
  const [isDrawToolSelected, setIsDrawToolSelected] = useState(true);
  const [isEraserToolSelected, setIsEraserToolSelected] = useState(false);
  const [strokeSize, setStrokeSize] = useState(3);
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  const context = useContext(Context);
  const {stompApi, reload, setReload} = context;  //or const stompApi = context.stompApi
  let role //"admin", "player"
  let gameId
  let userId
  let subscribed

  let gamePhase = "started" //if drawing{ drawing} else { if choosing {choosing } else {leaderboard}
  const [gamePhase2, setGamePhase2] = useState("started")
  let endGame
  const [endGame2, setEndGame2] = useState()
  let connectedPlayers
  const [connectedPlayers2, setConnectedPlayers2] = useState()
  let playersOriginally
  const [playersOriginally2, setPlayersOriginally] = useState()
  let maxRounds
  const [maxRounds2, setMaxRounds2] = useState()
  let currentRound
  const [currentRound2, setCurrentRound2] = useState()
  const [currentTurn2, setCurrentTurn2] = useState()
  let currentTurn
  let threeWords //the three words to choose from
  const [threeWords2, setThreeWords2] = useState()
  let isDrawer //true, false
  let Drawer //index in drawingOrder
  let chosenWord
  let wordIndex //0,1 or 2
  let drawingOrder //List of userIds is correct order
  const [isDrawer2, setIsDrawer2] = useState<boolean>()
  const [time, setTime] = useState()
  role = sessionStorage.getItem("role")
  gameId = sessionStorage.getItem("gameId")
  userId = parseInt(sessionStorage.getItem("userId"))

  const [reconnect, setReconnect] = useState(false)
  const [reconRole, setReconRole] = useState()
  const [reconGameId, setReconGameId] = useState()

  const logout = (): void => { //remove this?
    sessionStorage.removeItem("token");
    navigate("/loginOrRegister");
  };

  const handleWordSelectionClick = () => {
    setIsSelectionOpen(true);
  };

  const handleCloseSelection = () => {
    setIsSelectionOpen(false); //false
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isDrawer2 && !isChatting) {
        switch (event.key) {
          case "e":
            handleEraserClick();
            break;
          case "c":
            handleEraseAllClick();
            break;
          case "f":
            handleFillToolClick();
            break;
          case "d":
            handleDrawToolClick();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isDrawer2, isChatting]);

  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  };
  const connect = async ()  => {
    await stompApi.connect(() => {
      stompApi.send("/app/landing/alertreconnect/"+userId, "") //added
      stompApi.subscribe("/topic/landing/alertreconnect/"+userId, onHandleGeneralResponse, "Game") //added
      stompApi.subscribe(`/topic/games/${gameId}/general/${userId}`, onHandleGeneraluserIdResponse, "Game")
      stompApi.subscribe(`/topic/games/${gameId}/coordinates`, onHandleResponse, "Game");
      stompApi.subscribe(`/topic/games/${gameId}/fill`, onHandleFillResponse, "Game");
      stompApi.subscribe(`/topic/games/${gameId}/eraseAll`, onHandleEraseAllResponse, "Game");
      stompApi.subscribe(`/topic/games/${gameId}/eraser`, onHandleEraserResponse, "Game");
      stompApi.subscribe(`/topic/games/${gameId}/draw`, onHandleDrawResponse, "Game");
      stompApi.subscribe(`/topic/games/${gameId}/fillTool`, onHandleFillToolResponse, "Game");
      stompApi.subscribe(`/topic/games/${gameId}/general`, onHandleGeneralResponse, "Game")
      subscribed = true
      stompApi.connected = true //important!!! needs to be set during the onConnectedCallback, otherwise it might happen that it connected gets set true before the ws
                                //is fully setup
      stompApi.send(`/app/games/${gameId}/getgamestate/${userId}`, "")
      setReload(!reload) //makes so it subscribes in Chat
      /*
      if (role === "admin") {
        timeout(1000);
        stompApi.send(`/app/games/${gameId}/nextturn`, "")
      }

       */
    });
  }
  useEffect(() => {
    const handleBeforeUnload = (event) => {  //this gets executed when reloading the page
      console.log("disconnecting before reloading page!")
      const sessionAttributeDTO2 = {
        userId: null,
        reload: true
      }
      stompApi.send("/app/games/sendreload", JSON.stringify(sessionAttributeDTO2))

      stompApi.disconnect()
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    if (!stompApi.isConnected()) {    //need to be registerd and not connected already to connect
      console.log("connecting to ws!")
      connect();
    }
    const token = sessionStorage.getItem("token");
    if (!token) { //remove this?
      navigate("/loginOrRegister");
    }
    if (stompApi.isConnected()) { // && !subscribed
      stompApi.subscribe(`/topic/games/${gameId}/general/${userId}`, onHandleGeneraluserIdResponse, "Game")
      stompApi.subscribe(`/topic/games/${gameId}/general`, onHandleGeneralResponse, "Game")
      stompApi.subscribe(`/topic/games/${gameId}/coordinates`, onHandleResponse, "Game");
      stompApi.subscribe(`/topic/games/${gameId}/fill`, onHandleFillResponse, "Game");
      stompApi.subscribe(`/topic/games/${gameId}/eraseAll`, onHandleEraseAllResponse, "Game");
      stompApi.subscribe(`/topic/games/${gameId}/eraser`, onHandleEraserResponse, "Game");
      stompApi.subscribe(`/topic/games/${gameId}/draw`, onHandleDrawResponse, "Game");
      stompApi.subscribe(`/topic/games/${gameId}/fillTool`, onHandleFillToolResponse, "Game");
      subscribed = true
      stompApi.send(`/app/games/${gameId}/getgamestate/${userId}`, "")
      /*
      if (stompApi.isConnected() && role === "admin") {
        stompApi.send(`/app/games/${gameId}/nextturn`, "")
      }
       */
    }
    return () => {
      console.log("unsubscribing and cleaning up when navigating to different view from Game!")
      window.removeEventListener('beforeunload', handleBeforeUnload);

    }
  }, [navigate]);
  const sendWordChoice = (wordIndex, threeWords) => {
    
    let chosenWord = threeWords[wordIndex]
    const ChooseWordDTO =  {
      type: "chooseword",
      wordIndex: wordIndex,
      word: chosenWord
    }
    console.log("sending word v1")
    stompApi.send(`/app/games/${gameId}/sendchosenword`, JSON.stringify(ChooseWordDTO))
    handleEraseAllClick();
  
  }
  const getRandomInt = (max) => {
    return Math.floor(Math.random()*3)
  }
  const Reconfunc = (userId, reconRole, reconGameId) => {
    sessionStorage.setItem("role", reconRole)
    sessionStorage.setItem("gameId", reconGameId)
    stompApi.send(`/app/landing/reconnect/${userId}`, "") //added
    setReconnect(false)
    navigate(`/game/${reconGameId}`)
  }
  const onHandleGeneraluserIdResponse = (payload) => {
    const body = JSON.parse(payload.body);
    if (body.type === "GameStateDTO") {
      //sets everything except for role, gameId, userId, subscribed
      //chosenWord, wordIndex
      maxRounds = body.maxRounds
      setMaxRounds2(body.maxRounds)
      playersOriginally = body.playersOriginally
      setPlayersOriginally(body.playersOriginally)
      endGame = body.endGame
      setEndGame2(body.end)
      connectedPlayers = body.connectedPlayers
      setConnectedPlayers2(body.connectedPlayers)
      currentRound = body.currentRound
      setCurrentRound2(body.currentRound)
      currentTurn = body.currentTurn
      setCurrentTurn2(body.currentTurn)
      threeWords = body.threeWords
      setThreeWords2(body.threeWords)
      drawingOrder = body.drawingOrder
      Drawer = body.drawer
      setIsDrawer2(userId === drawingOrder[Drawer])
      isDrawer = userId === drawingOrder[Drawer]
      gamePhase = body.gamePhase
      setGamePhase2(body.gamePhase)
      chosenWord = body.actualCurrentWord
      console.log("gamePhase: ",gamePhase)
      //body.actualCurrentWord is null if no choosing took place already,
      //if choosing is taking place right now, it is a old word and will be updated with the choosing,
      //if the choosing just happend it is up to date
      console.log("Drawer, drawingOrder, userIdofDrawer, userId, isDrawer: ", Drawer, drawingOrder, drawingOrder[Drawer], userId, isDrawer)
      console.log("isDrawer: ", isDrawer)
      //setIsSelectionOpen(true);
      if (body.gamePhase === "started" && role === "admin" && gamePhase === "started") { //depends on whether we demote a reconnecting admin to a player and promote a random player
        stompApi.send(`/app/games/${gameId}/nextturn`, "")
      }
    }
  }
  const onHandleGeneralResponse = (payload) => {
    const body = JSON.parse(payload.body);
    if (body.type === "sendcanvasforrecon") {
      if (isDrawer) {
        /*send to this the whole canvas
      @MessageMapping("/games/{gameId}/sendcanvasforrecon/{userId}")
        public void sendcanvasforrecon(@DestinationVariable int gameId, @DestinationVariable int userId, FillCoordinates fillCoordinates) {
        this.webSocketService.sendMessageToClients("/topic/games/" + gameId + "/fill/" + userId, fillCoordinates);  //has userId in mapping!
      }

         */
      }
    }
    if (body.type === "ReconnectionDTO") {
      console.log("reconRole: "+body.role)
      console.log("reconGameId: "+body.gameId)
      setReconRole(body.role)
      setReconGameId(body.gameId)
      console.log("settings recon")
      setReconnect(true)
    }
    if (body.type === "TimerOut"  && role === "admin" && body.gamePhase === "leaderboard" && body.time === 0 && !endGame) {
      stompApi.send(`/app/games/${gameId}/nextturn`, "")
    }
    if (body.type === "leaderboard") {
      gamePhase = "leaderboard"
      endGame = body.endGame
      setEndGame2(body.endGame)
      setGamePhase2("leaderboard")
    }
    if (body.type === "GameStateDTO") {
      //sets everything except for role, gameId, userId, subscribed
      //chosenWord, wordIndex
      maxRounds = body.maxRounds
      setMaxRounds2(body.maxRounds)
      playersOriginally = body.playersOriginally
      setPlayersOriginally(body.playersOriginally)
      endGame = body.endGame
      setEndGame2(body.endGame)
      connectedPlayers = body.connectedPlayers
      setConnectedPlayers2(body.connectedPlayers)
      currentRound = body.currentRound
      setCurrentRound2(body.currentRound)
      currentTurn = body.currentTurn
      setCurrentTurn2(body.currentTurn)
      threeWords = body.threeWords
      setThreeWords2(body.threeWords)
      drawingOrder = body.drawingOrder
      Drawer = body.drawer
      setIsDrawer2(userId === drawingOrder[Drawer])
      isDrawer = userId === drawingOrder[Drawer]
      gamePhase = body.gamePhase
      setGamePhase2(body.gamePhase)
      chosenWord = body.actualCurrentWord
      console.log("gamePhase: ",gamePhase)
      //body.actualCurrentWord is null if no choosing took place already,
      //if choosing is taking place right now, it is a old word and will be updated with the choosing,
      //if the choosing just happend it is up to date
      console.log("Drawer, drawingOrder, userIdofDrawer, userId, isDrawer: ", Drawer, drawingOrder, drawingOrder[Drawer], userId, isDrawer)
      console.log("isDrawer: ", isDrawer)
      //setIsSelectionOpen(true);
      if (body.gamePhase === "started" && role === "admin" && gamePhase === "started" && !body.endGame) {
        stompApi.send(`/app/games/${gameId}/nextturn`, "")
      }

    }
    if (body.type === "startdrawing") {
      setGamePhase2("drawing")
      wordIndex = body.wordIndex
      chosenWord = body.word
      gamePhase = "drawing"

    }
    if (body.type === "TimerOut" && body.gamePhase === "drawing") {
      gamePhase = "drawing"
      setGamePhase2("drawing")
      setTime(body.time)
    }
    if (body.type === "TimerOut" && body.gamePhase === "choosing") {
      gamePhase = "choosing"
      setGamePhase2("choosing")
      setTime(body.time)

      if (body.time === 0 && isDrawer && gamePhase === "choosing") { //do this in back-end
        wordIndex = getRandomInt(3)
        chosenWord = threeWords[wordIndex]
        const ChooseWordDTO =  {
          type: "chooseword",
          wordIndex: wordIndex,
          word: chosenWord
        }
        console.log("sending word v2")
        stompApi.send(`/app/games/${gameId}/sendchosenword`, JSON.stringify(ChooseWordDTO))
      }
    }
  }
  const showtimer = (time, gamePhase2, wantedgamePhase) => {
    if (time === undefined) {
      return ""
    }
    if (time !== undefined && gamePhase2 === wantedgamePhase) {
      return ( <div> Timer: { time } </div>)
    }
  }
  const onHandleResponse = (payload) => {
    const renderCanvas = canvasRef.current;
    if (!renderCanvas) return;
    const ctx = renderCanvas.getContext("2d");
    
    const payloadData = JSON.parse(payload.body);
    console.log("payload::::", payloadData);

    const { x, y, newX, newY, selectedColor, strokeSize, eraserSelected } = payloadData;
    console.log("isEraserToolSelected::::::", isEraserToolSelected);
    console.log("selected color:::::", selectedColor);
    if (eraserSelected) {
      ctx.lineWidth = 15;
    }
    if (!eraserSelected) {
      ctx.lineWidth = strokeSize;
    }
    ctx.strokeStyle = selectedColor;
    
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
      ctx.lineWidth = 15; 
    } 
    if (!isEraserToolSelected) {
      ctx.lineWidth = strokeSize;
      ctx.globalCompositeOperation = "source-over"; 
      ctx.strokeStyle = selectedColor;
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const handleMouseDown = (event: MouseEvent) => {
      
      if (isFillToolSelected && isDrawer2) {
        fillArea(event.offsetX, event.offsetY, ctx);
        
      } else if (isDrawToolSelected || isEraserToolSelected) {
        setIsDrawing(true);
        setPrevPosition({ x: event.offsetX, y: event.offsetY });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDrawing || !isDrawer2 ||isFillToolSelected || (!isDrawToolSelected && !isEraserToolSelected)) return;
      const { x, y } = prevPosition;
      const newX = event.offsetX;
      const newY = event.offsetY;
      var eraserSelected = false;
      if (isEraserToolSelected) {
        eraserSelected = true;
        ctx.lineWidth = 15;
      }
      if (!isEraserToolSelected) {
        eraserSelected = false;
        ctx.lineWidth = strokeSize;
      }
     
      stompApi.send(`/app/games/${gameId}/coordinates`, JSON.stringify({ x, y, newX, newY, selectedColor, strokeSize, eraserSelected}));
     
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
    ctx.lineWidth = 15; 
    
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

  const onHandleFillToolResponse = (payload) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const payloadData = JSON.parse(payload.body);
    const { fillSelected } = payloadData;
    console.log(fillSelected);
    setIsFillToolSelected(true);
    setIsDrawToolSelected(false);
    setIsEraserToolSelected(false);
    
  };

  const handleFillToolClick = () => {
    setIsFillToolSelected(true);
    setIsDrawToolSelected(false);
    setIsEraserToolSelected(false);
    const fillSelected = true;
    stompApi.send(`/app/games/${gameId}/fillTool`, JSON.stringify({fillSelected}));
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
    const visitedPixels = new Set();
  
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
  
      if (visitedPixels.has(`${x},${y}`)) {
        continue; 
      }
  
      visitedPixels.add(`${x},${y}`);
  
      while (y-- >= 0 && matchStartColor(getColorAtPixel(x, y), targetColor)) {}
      y++;
  
      let reachLeft = false;
      let reachRight = false;
  
      while (y < ctx.canvas.height && matchStartColor(getColorAtPixel(x, y), targetColor)) {
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
  
        y++;
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
  
 // <Button onClick={logout}>Logout</Button>
  
  return (
    <div className="Game container">

      <div className={`Tracker${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} container`}>
        <div className={`Tracker${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} timer`}>

          {showtimer(time, gamePhase2, "drawing")}
        </div>
        <div className={`Tracker${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} rounds`}>
           <div> Round {currentRound2}/{maxRounds2} </div>
        </div>
        <div className={`Tracker${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} word`}>
          {chosenWord}
        </div>
      </div>
      <div className="Game form">
        <LeaderboardInGame/>
        <div className={`Canvas${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} container`}>
          <div className="Canvas canvas">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              style={{ border: "1px solid black", background: "white" }}
            />
            <WordSelection gamePhase={gamePhase2} onClose={handleCloseSelection} time={time} isDrawer={isDrawer2} sendWordChoice={sendWordChoice} threeWords = {threeWords2}/>
            <Podium/>
          </div>
          {isDrawer2 && (
          <div className="Canvas toolbar">
            <div className="Canvas color-buttons">
              <div className="Canvas main-color-button">
                <button
                  style={{ backgroundColor: selectedColor, width: "50px", height: "50px" }}
                  onClick={() => handleColorButtonClick(selectedColor)}
                />
              </div>
              <div className="Canvas color-buttons-group">
                <div className="Canvas color-button-row">
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#FFFFFF", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#FFFFFF")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#d3d3d3", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#d3d3d3")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#6E95FB", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#6E95FB")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#FF0000", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#FF0000")}
                  /> 
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#66DA3D", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#66DA3D")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#E9ED20", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#E9ED20")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#FA8633", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#FA8633")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#B149F1", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#B149F1")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#EE49F1", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#EE49F1")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#A44E1E", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#A44E1E")}
                  />
                </div>
                <div className="Canvas color-button-row">
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#000000", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#000000")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#A9A9A9", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#A9A9A9")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#0A53E1", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#0A53E1")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#CF0808", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#CF0808")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#0CAA09", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#0CAA09")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#C9CD03", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#C9CD03")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#EF6A0A", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#EF6A0A")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#82109E", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#82109E")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#9E106E", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#9E106E")}
                  />
                  <button
                    className="Canvas color-button"
                    style={{ backgroundColor: "#703717", width: "25px", height: "25px" }}
                    onClick={() => handleColorButtonClick("#703717")}
                  />
                </div>
              </div>
            </div>
            <div className="Canvas stroke-size-buttons">
              <button
                className={`Canvas stroke-size-button ${strokeSize === 3 ? "active" : ""}`}
                onClick={() => setStrokeSize(3)}
                style={{ width: "50px", height: "50px", marginRight: "3px", outline: strokeSize === 3 ? "3px solid black" : "none", position: "relative" }}
              >
                <div className="Canvas stroke-circle" style={{ width: "10px", height: "10px", backgroundColor: "black", borderRadius: "50%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
              </button>
              <button
                className={`Canvas stroke-size-button ${strokeSize === 5 ? "active" : ""}`}
                onClick={() => setStrokeSize(5)}
                style={{ width: "50px", height: "50px", outline: strokeSize === 5 ? "3px solid black" : "none", position: "relative" }}
              >
                <div className="Canvas stroke-circle" style={{ width: "15px", height: "15px", backgroundColor: "black", borderRadius: "50%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
              </button>
              <button
                className={`Canvas stroke-size-button ${strokeSize === 8 ? "active" : ""}`}
                onClick={() => setStrokeSize(8)}
                style={{ width: "50px", height: "50px", outline: strokeSize === 8 ? "3px solid black" : "none", position: "relative" }}
              >
                <div className="Canvas stroke-circle" style={{ width: "20px", height: "20px", backgroundColor: "black", borderRadius: "50%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
              </button>
              <button
                className={`Canvas stroke-size-button ${strokeSize === 12 ? "active" : ""}`}
                onClick={() => setStrokeSize(12)}
                style={{ width: "50px", height: "50px", outline: strokeSize === 12 ? "3px solid black" : "none", position: "relative" }}
              >
                <div className="Canvas stroke-circle" style={{ width: "28px", height: "28px", backgroundColor: "black", borderRadius: "50%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
              </button>
            </div>
            <div className="Canvas actions">
              <Button
                onClick={handleDrawToolClick}
                className={`Canvas action ${isDrawToolSelected ? "game selected" : ""}`}
                style={{
                  outline: isDrawToolSelected ? "3px solid black" : "none",   
                }}
              >
                Draw
              </Button>
              <Button
                onClick={handleFillToolClick}
                className={`Canvas action ${isFillToolSelected ? "game selected" : ""}`}
                style={{
                  outline: isFillToolSelected ? "3px solid black" : "none",   
                }}
              >
                Fill
              </Button>
              <Button
                onClick={handleEraserClick}
                className={`Canvas action ${isEraserToolSelected ? "game selected" : ""}`}
                style={{
                  outline: isEraserToolSelected ? "3px solid black" : "none",   
                }}
              >
                Eraser
              </Button>
              <Button 
                onClick={handleEraseAllClick}
              >
                Clear
              </Button>
            </div>
          </div>
          )}
        </div>
        <Chat isChatting={isChatting} setIsChatting={setIsChatting} />
      </div>
      <ReconnectPopUp reconnect={reconnect} setReconnect={setReconnect} Reconfunc={Reconfunc} userId={userId} reconRole={reconRole} reconGameId={reconGameId}/>
    </div>
  );
};

export default Game;
