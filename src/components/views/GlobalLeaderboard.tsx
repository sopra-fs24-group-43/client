import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, handleError } from "../../helpers/api.js"
import "../../styles/views/GlobalLeaderboard.scss";
import User from "models/User";

const GlobalLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const navigate = useNavigate();

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
    <div className={`GlobalLeaderboard${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} container`}>
      <div className={`GlobalLeaderboard${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} header${sessionStorage.getItem("isDarkMode") ? "_dark" : ""}`}>All Time Leaderboard</div>
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
              <td>
                <span 
                  className="GlobalLeaderboard username-link"
                  onClick={() => navigate(`/profile/${entry.userID}`)}
                >
                  {entry.username}
                </span>
              </td>
              <td>{entry.xp}</td>
              <td>{entry.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GlobalLeaderboard;
