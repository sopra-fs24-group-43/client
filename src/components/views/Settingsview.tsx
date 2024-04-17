import React, { useEffect, useState } from 'react'
import StompJs, {over} from 'stompjs';
import SockJS from "sockjs-client";

var stompClient =null;

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
    const connect =()=>{
        //const stompClient = StompJs.client('ws://localhost:8080/ws')
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }
    const onConnected = () => {     //connectCallback
        setUserConnected(true);
        stompClient.subscribe('/settings', onMessageReceived);
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);

        setSettings(
            {...Settings,
                "TotalRounds": payloadData.totalRounds,
                "TotalPlayers": payloadData.totalPlayers,
                "RoundLength": payloadData.roundLength
            });
        alert("Settings: " + JSON.stringify(Settings))
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

    const onError = (err) => {      //errorcallback
        console.log(err);

    }

    const sendValue = () => {

        if (stompClient) {
            var Messagetosend = {
                totalRounds: InTotalRounds,
                totalPlayers: InTotalPlayers,
                roundLength: InRoundLength
            }
            alert("Messagetosend: "+JSON.stringify(Messagetosend))
            stompClient.send("/app/message", {}, JSON.stringify(Messagetosend));
        }
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
                    <button onClick={sendValue}>save</button>
                    <div>saved settings:</div>
                    <div>
                        <li> TotalRounds: {Settings.TotalRounds} </li>
                        <li> TotalPlayers: {Settings.TotalPlayers}</li>
                        <li> RoundLength: {Settings.RoundLength}</li>
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