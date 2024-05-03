import React, { useState} from 'react'

import StompApi from "../../helpers/StompApi";


const stompApi = new StompApi();
const Settingsview = () => {



    const [Settings, setSettings] = useState({
        TotalRounds: "",
        TotalPlayers: "",
        RoundLength: ""
    });
    const [InTotalRounds, setInTotalRounds] = useState("");
    const [InTotalPlayers, setInTotalPlayers] = useState("");
    const [InRoundLength, setInRoundLength] = useState("");
    const [UserConnected, setUserConnected] = useState(false);
    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }
    const handleResponse1 = (payload) => {
        alert("yoyo");
        return payload;
    }
    const  connect = async ()=>{
        stompApi.connect();
        await timeout(500);
        stompApi.subscribe("/topic/landing", handleResponse1)
        setUserConnected(true);
    }
    const handleResponse = (payload) => {
        //const body = payload.body;
        alert("hoeboe")
        return payload
    }
    const connect2 = () => {
        stompApi.subscribe("/topic/games/1/general", handleResponse);
    }




    const handleRounds=(event)=>{
        const {value}=event.target;
        setInTotalRounds(value);

    }
    const handlePlayers=(event)=>{
        const {value}=event.target;
        setInTotalPlayers(value);
    }
    const handleLength=(event)=>{
        const {value}=event.target;
        setInRoundLength(value);
    }


    const sendValue = () => {


        var Messagetosend = {
            type: "inboundPlayer",
            username: "Florian",
            userId: 678,
            gameId: 1001,
            friends: [111,500,600],
            role: "admin"
        }

        stompApi.send("/app/landing/creategame", JSON.stringify(Messagetosend));
        //alert("Callbacks: "+ JSON.stringify(stompApi.settingsCallbacks))
    }

    const sendValue1 = () => {
        var Messagetosend = {
            type: "settingsforme",
            username: "Frido",
            userId: 111,
            gameId: 1001,
            friends: [500,600,678],
            role: "player"
        }
        stompApi.send("/app/games/1/joingame",JSON.stringify(Messagetosend));

    }
    const sendValue2 = () => {
        var settings2 = {
            type: "gamesettings",
            maxPlayers: 7,
            maxRounds: 3,
            turnLength: 90,
            gamePassword: "SoPrasLigma",
            lobbyName: "hoodlife"
        }
        stompApi.send("/app/games/1/updategamesettings",JSON.stringify(settings2));

    }


    return (
      <div>
          {UserConnected?
            <div>
                <div><input placeholder="enter Amount of Total Rounds" value={InTotalRounds}
                            onChange={handleRounds}></input></div>
                <div><input placeholder="enter Amount of Total Rounds" value={InTotalPlayers}
                            onChange={handlePlayers}></input></div>
                <input placeholder="enter Amount of Total Rounds" value={InRoundLength}
                       onChange={handleLength}></input>
                <button onClick={sendValue}>creategame</button>
                <div>saved settings:</div>
                <div>
                    <li> TotalRounds: {Settings.TotalRounds} </li>
                    <li> TotalPlayers: {Settings.TotalPlayers}</li>
                    <li> RoundLength: {Settings.RoundLength}</li>
                </div>
                <div>
                    <button onClick={sendValue1}>joingame</button>
                    <button onClick={sendValue2}>updateGameSettings</button>
                    <button onClick={connect2}>connect again</button>
                </div>
            </div>

            :
            <div>

                <button onClick={connect}>
                    connect
                </button>

            </div>}
      </div>
    )
}

export default Settingsview