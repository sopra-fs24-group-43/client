import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "../../styles/views/Profile.scss";
import { api, handleError } from "helpers/api";
import { User } from "types";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [editMode, setEditMode] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/users/${sessionStorage.getItem("userId")}`);
    } catch (error) {
      console.error(
        `Something went wrong while fetching the user profile: \n${handleError(
          error
        )}`
      );
      console.error("Full Error Object:", error);
      alert(
        "Something went wrong while fetching the user profile! See the console for details."
      );
    }
  };

  return (
    <div className="ProfileContainer">
      <div className="Profile">
        <div className="profile-info">
          <p>Username: {sessionStorage.getItem("username")}</p>
          <p>Name: {sessionStorage.getItem("name")}</p>
          <p>ID:{sessionStorage.getItem("userId")}</p>
          
          <p>Date of Birth: </p>
        </div>
        {editMode ? (
          <div className="profile-form">
            <label>Edit Date of Birth:</label>
            <input type="date" value={dateOfBirth} onChange={() => {}} />
            <label>Edit Username:</label>
            <input type="text" value={newUsername} onChange={() => {}} />
            <Button>Save Profile</Button>
          </div>
        ) : (
          <div className="profile-buttons">
            <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
            <div style={{ marginTop: "15px" }}>
              <Button onClick={() => navigate("/landingPage")}>
                Back to Main Page
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
