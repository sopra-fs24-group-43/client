import React from 'react';

import '../../styles/views/game/WordSelection.scss';
import WordSelection from "./WordSelection";

const ReconnPopUp = ({reconnect, setReconnect, Reconfunc, userId, reconRole, reconGameId}) => {
  let userId2 = userId
  let reconRole2 = reconRole
  let reconGameId2 = reconGameId
  if (!reconnect) {
    console.log("not showing recon")
    return null;
  }
  if(reconnect) {
    console.log("showing recon")
    return (
      <div className={`wordSelection container ${reconnect ? 'open' : ''}`}>
        <div className="wordSelection modal-content">
          <div className="wordSelection title">
            Would You like to Rejoin The Game You Just Left?
          </div>
        </div>
        <div className="wordSelection words-container">
          <div className="wordSelection words">
            <button onClick={() => Reconfunc(userId2, reconRole2, reconGameId2)}>
              Yes
            </button>
          </div>
          <div className="wordSelection words">
            <button onClick={() => {setReconnect(false)}}>
              No
            </button>
          </div>
        </div>
      </div>
    )
  }
}
export default ReconnPopUp;