import React from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import PropTypes from "prop-types";

/**
 *
 * Another way to export directly your functional component is to write 'export const' 
 * instead of 'export default' at the end of the file.
 */

export const LobbyGuard = () => {
  const location = useLocation();

  const gameId = sessionStorage.getItem("gameId");
  const role = sessionStorage.getItem("role");

  if (gameId && role) {
    return <Outlet />;
  }

  return <Navigate to="/landingPage" replace />;
};

LobbyGuard.propTypes = {
  gameId: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired
};