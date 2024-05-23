import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import LoginOrRegister from "../../views/LoginOrRegister";
import LandingPage from "../../views/LandingPage";
import Lobby from "../../views/Lobby";
import Profile from "../../views/Profile";
import { LocationProvider } from "./LocationContext";
import Header from "../../views/Header";
import GlobalLeaderboard from "../../views/GlobalLeaderboard";

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
      <LocationProvider>
        <Header height="100" />
        <Routes>
          <Route path="/game/:gameId" element={<GameGuard />}>
            <Route path="/game/:gameId" element={<GameRouter base="/game" />} />
          </Route>

          <Route path="/loginOrRegister" element={<LoginGuard />}>
            <Route path="/loginOrRegister" element={<LoginOrRegister />} />
          </Route>

          <Route path="/" element={<Navigate to="LandingPage" replace />} />
          <Route path="/LandingPage" element={<LandingPage />} />
          <Route path="/lobby/:gameId" element={<Lobby />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/GlobalLeaderboard" element={<GlobalLeaderboard/>} />
        </Routes>
      </LocationProvider>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
