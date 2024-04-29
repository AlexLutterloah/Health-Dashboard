import React from 'react';
import './MainHeader.css';
import { Link } from "react-router-dom";

// Function to check if the user is logged in. If user is logged in, display name and logout option.
function DisplayUserLogoutBar({ isLoggedIn }) {
  if (isLoggedIn) {
    return <div className="user-logout"><Link to="/">Logout</Link></div>;
  }
  return null;
}

const MainHeader = ({ titleText, userLoggedIn = true, children }) => {
  return (
    <div className="mainheader-container">
      <header className="App-header">
        <div className="logout">
          <DisplayUserLogoutBar isLoggedIn={userLoggedIn} />
        </div>
        <div className="header-container">
          <img src="/images/capitalonelogo.png" alt="capital one logo" className="main-logo" />
          
          <h1 className="header-title">Health Dashboard</h1>
        </div>
      </header>
      <div className="title-bar">
          <div className="title-contents">
            <h1>{titleText}</h1>
            {children}
        </div>
      </div>
    </div>
  );
};

export default MainHeader;