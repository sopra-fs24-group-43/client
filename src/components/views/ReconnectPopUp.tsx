import React from 'react';

import '../../styles/views/game/WordSelection.scss';
import WordSelection from "./WordSelection";

const ReconnPopUp = ({reconnect, setReconnect, Reconfunc, userId, reconRole, reconGameId}) => {
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
            <button onClick={() => {Reconfunc(userId, reconRole, reconGameId)}}>
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