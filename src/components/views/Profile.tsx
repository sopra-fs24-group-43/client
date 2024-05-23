import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "../../styles/views/Profile.scss";
import { api, handleError } from "helpers/api";

const Profile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [birthDate, setBirthDate] = useState(sessionStorage.getItem("birth_date") || "");
  const [newUsername, setNewUsername] = useState(sessionStorage.getItem("username") || "");
  const isGuest = sessionStorage.getItem("isGuest") === "true";

  const handleBirthDateChange = (event) => {
    setBirthDate(event.target.value);
  };
  
  const handleUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };

  useEffect (() => {
    // adding location to the session storage
    sessionStorage.setItem("location", "profile");
  }, [])

  const saveProfile = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      const response = await api.put(`/users/${userId}`, {
        birth_date: birthDate,
        username: newUsername,
      });

      sessionStorage.setItem("birth_date", birthDate);
      sessionStorage.setItem("username", newUsername);
      setEditMode(false);
    } catch (error) {
      console.error(
        `Something went wrong while updating the user profile: \n${handleError(error)}`
      );
      console.error("Full Error Object:", error);
      alert("This Username is already taken.");
    }
  };

  return (
    <div className="ProfileContainer">
      <div className="Profile">
        <div className="profile-info">
          <p>Username: {sessionStorage.getItem("username")}</p>
          <p>Name: {sessionStorage.getItem("name")}</p>
          <p>User ID: {sessionStorage.getItem("userId")}</p>
          <p>Date of Birth: {sessionStorage.getItem("birth_date")}</p>
          <p>Accoun Creation Date: {sessionStorage.getItem("creation_date")}</p>
        </div>
        {editMode ? (
          <div className="profile-form">
            <label>Edit Date of Birth:</label>
            <input type="date" value={birthDate} onChange={handleBirthDateChange} />
            <label>Edit Username:</label>
            <input type="text" value={newUsername} onChange={handleUsernameChange} />
            <Button onClick={saveProfile}>Save Profile</Button>
          </div>
        ) : (
          <div className="profile-buttons">
            {!isGuest && (
              <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
            )}
            <div style={{ marginTop: "15px" }}>
              <Button onClick={() => navigate("/landingPage")}>Back to Main Page</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
