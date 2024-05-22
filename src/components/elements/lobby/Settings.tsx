import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import "../../../styles/views/lobby/Settings.scss"

import { Context } from "../../../context/Context";

const Settings = ({ setIsGenreSelectionValid }) => {
  console.log("I'm in the Settings");
  // setting up the gameSettings
  const [maxPlayers, setMaxPlayers] = useState(5);
  const [maxRounds, setMaxRounds] = useState(5);
  const [turnLength, setTurnLength] = useState(60); // seconds
  const [genres, setGenres] = useState([
    { value: 'Science', label: 'Science' },
    { value: 'Sport', label: 'Sport' },
    { value: 'Animal', label: 'Animal' },
    { value: 'Plant', label: 'Plant' },
    { value: 'Life', label: 'Life' },
    { value: 'Human', label: 'Human' }
  ]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreWordCount] = useState({
    Science: 79,
    Sport: 38,
    Animal: 88,
    Plant: 90,
    Life: 64,
    Human: 76,
    Work: 75
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [playersInLobby, setPlayersInLobby] = useState();

  // for disabling genres selection for non admin users
  const userInteractionRef = useRef(false);

  // getting the gameId from the url
  const { gameId } = useParams();
  const lobbyId = parseInt(gameId);
  
  // getting contex
  const context = useContext(Context)
  const {stompApi} = context  //or const stompApi = context.stompApi

  // websocket connection establishing
  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  };

  // subscribe if !stompApi.isConnected()
  const subscribe = async () => { // needed for delaying the send function, so the connection is established
    await timeout(600);
    console.log("Subscribing from the settings");
    stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "Settings");
  };
  
  useEffect(() => {
    // subscribing
    if (stompApi.isConnected()){
      stompApi.subscribe(`/topic/games/${lobbyId}/general`, handleResponse, "Settings");
      console.log("subscribed when was connected to the websocket in Settings");
    } else if (!stompApi.isConnected()){
      subscribe()
    }
    
    // unsub
    return () => {  //this gets executed when navigating another page
      console.log("unsubscribing and cleaning up when navigating to different view from Settings!");
      // window.removeEventListener('beforeunload', handleBeforeUnload)
      stompApi.unsubscribe(`/topic/games/${lobbyId}/general`, "Settings");
    };
  }, []);

  useEffect(() => {
    // sending the data to the server only if user is a creator of a lobby
    if (sessionStorage.getItem("role") === "admin" && userInteractionRef.current){
      const settings = {
        type: "gameSettings",
        maxPlayers: maxPlayers,
        maxRounds: maxRounds,
        turnLength: turnLength,
        genres: selectedGenres.map(genre => genre.value)
      };
      if (stompApi.isConnected()){
        sendData(settings);
      };
      userInteractionRef.current = false;
    };

    validateGenres();
  }, [maxPlayers, maxRounds, turnLength, selectedGenres]); // maxPlayers, maxRounds, turnLength, genres

  const sendData = async (settings) => { // needed for delaying the send function, so the connection is established
    await timeout(400);
    console.log("sending the message from the settings");
    stompApi.send(`/app/games/${lobbyId}/updategamesettings`, JSON.stringify(settings));
  };

  // handling the response
  const handleResponse = (payload) => {
    const responseData = JSON.parse(payload.body); // response data from the server
    console.log("Settings' payload: ", responseData);
    if (responseData.type === "gameSettings"){
      console.log("response data in gameSettings", responseData);
      setMaxPlayers(responseData.maxPlayers);
      setMaxRounds(responseData.maxRounds);
      setTurnLength(responseData.turnLength);
      setSelectedGenres(responseData.genres.map(genre => ({ value: genre, label: genre })));
    } else if (responseData.type === "getlobbyinfo") {
      console.log("response data in getlobbyinfo", responseData);
      setMaxPlayers(responseData.gameSettingsDTO.maxPlayers);
      setMaxRounds(responseData.gameSettingsDTO.maxRounds);
      setTurnLength(responseData.gameSettingsDTO.turnLength);
      setSelectedGenres(responseData.gameSettingsDTO.genres.map(genre => ({ value: genre, label: genre })));
      setPlayersInLobby(Object.keys(responseData.players).length);
    }
  };

  // handling the changes of the settings on the page
  const handleSettingsChange = (event) => {
    userInteractionRef.current = true;
    const { name, value } = event.target;
    console.log("event: ", event, "name: ", name, "value: ", value);

    switch (name) {
      case "maxPlayers":
        setMaxPlayers(parseInt(value));
        break;
      case "maxRounds":
        setMaxRounds(parseInt(value));
        break;
      case "turnLength":
        setTurnLength(parseInt(value));
        break;
      default:
        break;
    };
  };

  const handleGenresChange = (selectedList) => {
    userInteractionRef.current = true;
    setSelectedGenres(selectedList);
  };

  const validateGenres = () => {
    const totalWordsNeeded = maxRounds * playersInLobby * 3; // minimum words needed 
    const selectedWordCount = selectedGenres.reduce((acc, genre) => acc + genreWordCount[genre.value], 0); // how many words have been selected 
    console.log("totalWordsNeeded = ", totalWordsNeeded, "selectedWordCount = ", selectedWordCount);
    if (selectedWordCount < totalWordsNeeded) {
      setErrorMessage(`More genres have to be selected!`);
      // will pass the value to the lobby, then startgame will take it and disable the startgame button
      setIsGenreSelectionValid(false);
    } else {
      setErrorMessage("");
      // will pass the value to the lobby, then startgame will take it and enable the startgame button
      setIsGenreSelectionValid(true);
    }
  };

  // disabling the select element if user is not the creator of a lobby ("admin")
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role !== "admin") {
      const selects = document.querySelectorAll(".Settings.slide-down-menu");
      selects.forEach((select) => {
        (select as HTMLSelectElement).disabled = true;
      });
    }
  }, []);

  return (
    <div className={`Settings${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} container`}>
      <div className="Settings menu-form">
        <div className={`Settings${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} menu-label`}>Players</div>
        <select className="Settings slide-down-menu" name="maxPlayers" value={maxPlayers} onChange={handleSettingsChange}>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
        </select>
      </div>
      <div className="Settings menu-form">
        <div className={`Settings${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} menu-label`}>Rounds</div>
        <select className="Settings slide-down-menu" name="maxRounds" value={maxRounds} onChange={handleSettingsChange}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
      </div>
      <div className="Settings menu-form">
        <div className={`Settings${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} menu-label`}>Drawtime</div>
        <select className="Settings slide-down-menu" name="turnLength" value={turnLength} onChange={handleSettingsChange}>
          <option value={5}>5s</option>
          <option value={15}>15s</option>
          <option value={30}>30s</option>
          <option value={45}>45s</option>
          <option value={60}>60s</option>
          <option value={75}>75s</option>
          <option value={90}>90s</option>
          <option value={120}>120s</option>
          <option value={150}>150s</option>
        </select>
      </div>
      <div className="Settings menu-form">
        <div className={`Settings${sessionStorage.getItem("isDarkMode") ? '_dark' : ''} menu-label`}>Genre</div>
        <div className="Settings multi-select-warn-group">
          {errorMessage && <div className="Settings warn">{errorMessage}</div>}
          <div className="Settings multi-select">
            <Multiselect
              options={genres}
              selectedValues={selectedGenres}
              onSelect={handleGenresChange}
              onRemove={handleGenresChange}
              displayValue="label"
              disable={sessionStorage.getItem("role") !== "admin"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;