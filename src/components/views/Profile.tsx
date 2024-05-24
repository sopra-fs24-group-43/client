import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "components/ui/Button";
import "../../styles/views/Profile.scss";
import { api, handleError } from "helpers/api";
import { User } from "types";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const [loggedInUserId, setLoggedInUserId] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const isGuest = sessionStorage.getItem("isGuest") === "true";
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const gameUserId = location.state?.key?.id;
  const isOwnProfile = userId === loggedInUserId;

  useEffect(() => {
    sessionStorage.setItem("location", "profile");
    setLoggedInUserId(sessionStorage.getItem("userId"))
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/users/${userId}`);
      setUserProfile(response.data);
    } catch (error) {
      console.error(`Something went wrong while fetching the user profile: \n${handleError(error)}`);
      console.error("Full Error Object:", error);
      alert("Something went wrong while fetching the user profile! See the console for details.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const handleBirthDateChange = (event) => {
    setUserProfile(prevState => ({
      ...prevState,
      dateOfBirth: event.target.value
    }));
  };

  const handleUsernameChange = (event) => {
    setUserProfile(prevState => ({
      ...prevState,
      username: event.target.value
    }));
  };

  const handlePasswordChange = (event) => {
    setUserProfile(prevState => ({
      ...prevState,
      password: event.target.value
    }));
  };

  const saveProfile = async () => {
    try {
      const response = await api.put(`/users/${userId}`, {
        birth_date: userProfile.dateOfBirth,
        username: userProfile.username,
        password: userProfile.password
      });
  
      sessionStorage.setItem("birth_date", userProfile.dateOfBirth);
      sessionStorage.setItem("username", userProfile.username);
      sessionStorage.setItem("password", userProfile.password);
      setEditMode(false);
      fetchUserProfile();
    } catch (error) {
      console.error(`Something went wrong while updating the user profile: \n${handleError(error)}`);
      console.error("Full Error Object:", error);
      alert("This Username is already taken.");
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ProfileContainer">
      <div className="Profile_dark">
        <div className="left-column">
          <img src="/profile.png" alt="Profile" className="profile-image" />
          <div className="profile-info">
            <p>Username: {userProfile.username}</p>
            {isOwnProfile && (
              <div>
                <p>Password: {showPassword ? userProfile.password : userProfile.password.replace(/./g, "•")}</p>
              </div>
            )}
            <p>Name: {userProfile.name}</p>
            <p>Level: {userProfile.level}</p>
            <p>Total XP: {userProfile.xp}</p>
            {isOwnProfile && (
              <div>
                <Button onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide Password" : "Show Password"}
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="right-column">
          <div className="profile-buttons">
            {isOwnProfile && (
              <Button onClick={() => setEditMode(true)} className="edit-profile-button">Edit Profile</Button>
            )}
            
          </div>
          <p>User ID: {userProfile.id}</p>
          <p>Date of Birth: {userProfile.birth_date}</p>
          <p>Account Creation Date: {userProfile.creation_date}</p>
          <p>Status: {userProfile.status}</p>
        </div>
        {editMode && isOwnProfile && (
          <div className="profile-form">
            <label>Edit Date of Birth:</label>
            <input type="date" value={userProfile.dateOfBirth} onChange={handleBirthDateChange} />
            <label>Edit Username:</label>
            <input
              type="text"
              value={userProfile.username}
              onChange={handleUsernameChange}
              maxLength={18}
            />
            {usernameError && <p className="error-message">{usernameError}</p>}
            <label>Change Password:</label>
            <input
              type="password"
              value={userProfile.password}
              onChange={handlePasswordChange}
              maxLength={18}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
            <Button onClick={saveProfile}>Save Profile</Button>
          </div>
        )}
        {!editMode && (
          <div className="profile-buttons">
            <Button onClick={() => navigate("/Globalleaderboard")}>Global Leaderboard</Button>
            <div style={{ marginTop: "8px" }}>
              <Button onClick={() => navigate("/landingPage")}>Back to Main Page</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
