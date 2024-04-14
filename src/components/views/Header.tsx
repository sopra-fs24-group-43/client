import React from "react";
import {ReactLogo} from "../ui/ReactLogo";
import PropTypes from "prop-types";
import "../../styles/views/Header.scss";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://react.dev/learn/your-first-component and https://react.dev/learn/passing-props-to-a-component 
 * @FunctionalComponent
 */
const Header = props => (
  <div className="header container" style={{height: props.height}}>
    <div className="header title">
      <h1 className="header logo">Freitagsmaler - Group 43</h1>
      <ReactLogo/>
    </div>
    <div className="header navigation">
      <a href="/leaderboard">
        <img src="leaderboard.png" alt="Leaderboard Icon" className="header img"/>
      </a>
      <a href="/friends">
        <img src="friends.png" alt="Friends Icon" className="header img"/>
      </a>
      <a href="/settings">
        <img src="settings.png" alt="Settings Icon" className="header img"/>
      </a>
      <a href="/profile">
        <img src="profile.png" alt="Profile Icon" className="header img"/>
      </a>
    </div>
  </div>
);

Header.propTypes = {
  height: PropTypes.string,
};

/**
 * Don't forget to export your component!
 */
export default Header;
