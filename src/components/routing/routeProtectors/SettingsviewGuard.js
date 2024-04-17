import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";
import Settingsview from "../../views/Settingsview";

/**
 *
 * Another way to export directly your functional component is to write 'export const'
 * instead of 'export default' at the end of the file.
 */
export const SettingsviewGuard = () => {
    if (!localStorage.getItem("token")) {

        return <Outlet />;
    }

    return <Navigate to="/login" replace />;
};

SettingsviewGuard.propTypes = {
    children: PropTypes.node
}