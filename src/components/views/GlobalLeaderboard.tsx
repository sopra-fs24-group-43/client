import React, { useState, useRef, useEffect } from "react";
import { api, handleError } from "../../helpers/api.js"
import "../../styles/views/GlobalLeaderboard.scss";
import User from "models/User";

const GlobalLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  const getLeaderboardData = async () => {
    try {
      const response = await api.get("/globalLeaderboard");
      setLeaderboardData(Object.values(response.data.leaderboardEntries));
    } catch (error) {
      alert(`Something went wrong while fetching the leaderboard data: \n${handleError(error)}`);
    }
  };

  useEffect(() => {
    getLeaderboardData();
  }, []);

  return (
    <div className={`GlobalLeaderboard container${sessionStorage.getItem("isDarkMode") ? "_dark" : ""}`}>
      <div className="GlobalLeaderboard header">All Time Leaderboard</div>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User ID</th>
            <th>Username</th>
            <th>XP</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map(entry => (
            <tr key={entry.userID}>
              <td>{entry.rank}</td>
              <td>{entry.userID}</td>
              <td>{entry.username}</td>
              <td>{entry.XP}</td>
              <td>{entry.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GlobalLeaderboard;
