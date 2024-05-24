import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

/**
 *
 * Another way to export directly your functional component is to write 'export const' 
 * instead of 'export default' at the end of the file.
 */
export const LoginGuard = () => {

  const userId = sessionStorage.getItem("userId");
  const username = sessionStorage.getItem("username");

  if (!userId && !username) {

    return <Outlet />;
  }
  
  return <Navigate to="/landingPage" replace />;
};

LoginGuard.propTypes = {
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
}