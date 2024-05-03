import React from "react";
import PropTypes from "prop-types";
import "../../../styles/views/Game.scss";

const ButtonComponent = ({ color, changeColor }) => {

  return (
    <button
      className="color-button"
      style={{ backgroundColor: color, width: "25px", height: "25px" }}
      onClick={() => changeColor(color)}
    />
  );
};

ButtonComponent.propTypes = {
  color: PropTypes.string.isRequired,
  changeColor: PropTypes.func.isRequired,
};

export default ButtonComponent;