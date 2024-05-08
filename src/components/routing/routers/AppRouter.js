import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {GameGuard} from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import LoginOrRegister from "../../views/LoginOrRegister";
import LandingPage from "../../views/LandingPage"
import Lobby from "../../views/Lobby";

import {SettingsviewGuard} from "../routeProtectors/SettingsviewGuard";
import Settingsview from "../../views/Settingsview";
import Lobby from "../../views/Lobby";
/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial 
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/game/*" element={<GameGuard />}>
          <Route path="/game/*" element={<GameRouter base="/game"/>} />
        </Route>

        <Route path="/loginOrRegister" element={<LoginGuard />}>
          <Route path="/loginOrRegister" element={<LoginOrRegister/>} />
        </Route>

        <Route path="/" element={<Navigate to="LandingPage" replace />}/>

        <Route path="/LandingPage" element={<LandingPage/>} />

        <Route path="/lobby" element={<Lobby/>} />

      </Routes>

    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
