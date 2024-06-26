import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = (props) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.length >= 18) {
      setErrorMessage(`${props.label} cannot exceed 18 characters`);
    } else {
      setErrorMessage("");
    }
    props.onChange(value);
  };

  return (
    <div className={`login${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} field`}>
      <label className={`login${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} label`}>{props.label}</label>
      <input
        type={props.type}
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={handleChange}
        maxLength={18}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {props.errorMessage && <p className="error-message">{props.errorMessage}</p>}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  errorMessage: PropTypes.string,
};

const Login = () => {
  const navigate = useNavigate();
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [name, setName] = useState("");
  const [username2, setUsername2] = useState("");
  const [password, setPassword] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    sessionStorage.setItem("location", "login");
  }, []);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username: username2, name, password });
      const response = await api.post("/users", requestBody);

      const user = new User(response.data);

      sessionStorage.setItem("token", user.token);
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("name", user.name);
      sessionStorage.setItem("userId", user.id);
      sessionStorage.setItem("friends", user.friends);
      sessionStorage.setItem("creation_date", user.creation_date);
      sessionStorage.setItem("isGuest", "false");

      navigate("/LandingPage");
    } catch (error) {
      setRegistrationError("The username provided is already taken.");
    }
  };

  const fetchAndSaveUserSettings = async (userId) => {
    try {
      const settingsResponse = await api.get(`/users/${userId}`);
      const userSettings = new User(settingsResponse.data);
      console.log("HOTKEYS::" + userSettings.hotkeyInputDraw);
      sessionStorage.setItem("hotkeyInputDraw", userSettings.hotkeyInputDraw);
      sessionStorage.setItem("hotkeyInputFill", userSettings.hotkeyInputFill);
      sessionStorage.setItem("hotkeyInputEraser", userSettings.hotkeyInputEraser);
      sessionStorage.setItem("hotkeyInputClear", userSettings.hotkeyInputClear);
    } catch (error) {
      handleError(error);
    }
  };

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username: loginUsername, password: loginPassword });
      const response = await api.put("/users", requestBody);

      const user = new User(response.data);

      sessionStorage.setItem("token", user.token);
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("name", user.name);
      sessionStorage.setItem("userId", user.id);
      sessionStorage.setItem("friends", user.friends);
      sessionStorage.setItem("birth_date", user.birth_date);
      sessionStorage.setItem("isGuest", "false");

      await fetchAndSaveUserSettings(user.id);

      navigate("/LandingPage");
    } catch (error) {
      setLoginError("Invalid Credentials");
    }
  };

  return (
    <BaseContainer>
      <div className={`login${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} container`}>
        <div className={`login${sessionStorage.getItem("isDarkMode") ? "_dark" : ""} form`}>
          <div className="login-column">
            <h2>Login</h2>
            <FormField
              label="Username"
              value={loginUsername}
              onChange={(un) => setLoginUsername(un)}
              
            />
            <FormField
              label="Password"
              type="password"
              value={loginPassword}
              onChange={(pw) => setLoginPassword(pw)}
              errorMessage={loginError}
            />
            <div className="login button-container">
              <Button
                width="100%"
                onClick={() => doLogin()}
              >
                <div>Login</div>
              </Button>
            </div>
          </div>
          <div className="login-column">
            <h2>Register</h2>
            <FormField
              label="Username"
              value={username2}
              onChange={(un) => setUsername2(un)}
            />
            <FormField
              label="Name"
              value={name}
              onChange={(n) => setName(n)}
            />
            <FormField
              label="Password"
              type="password"
              value={password}
              onChange={(pw) => setPassword(pw)}
              errorMessage={registrationError}
            />
            <div className="login button-container">
              <Button
                width="100%"
                onClick={() => doRegister()}
              >
                <div>Register</div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Login;
