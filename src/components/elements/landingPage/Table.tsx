import React, { useState, useEffect } from "react";
import "styles/views/Table.scss"
import { stompApi } from "components/views/LandingPage";

const Table = () => {
  useEffect(() => {
    const subscribeWithTimeout = () => {
      setTimeout(() => {
        stompApi.subscribe('/topic/landing/getallgames', onMessageReceived);
      }, 1000); 
    };

    stompApi.connect();
    subscribeWithTimeout();
  }, []);

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    console.log(":", payloadData);
  };

  return (
    <div className="Table container">
      <h2>User Table</h2>
      <table>
        <thead>
          <tr>
            <th>Lobby</th>
            <th>User Name</th>
          </tr>
        </thead>
        <tbody>
          {/* {users.map((user, index) => (
            <tr key={index}>
              <td>{user.lobbyName}</td>
              <td>{user.username}</td>
            </tr>
          ))} */}
          <tr>
            <td>Simon&apos;s lobby</td>
            <td>Simon2004</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
