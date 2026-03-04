import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./topbar.css";
import Breadcrumbs from "../../Breadcrumbs/Breadcrumbs";
import profile from "../../../images/icons/profile-1.jpg";
import { useMsal } from "@azure/msal-react";
import bell from "../../../images/icons/bell-02.svg";

import srm_white_logo from "../../../images/Logo/logo_srm_white.png";

import nexus from "../../../images/Logo/NexusLabs-Logo.png";
import darkActive from "../../../images/topbar-icons/dark-active.svg";
import lightActive from "../../../images/topbar-icons/light-active.svg";
import darkInactive from "../../../images/topbar-icons/dark-inactive.svg";
import lightInactive from "../../../images/topbar-icons/light-inactive.svg";
import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "../../../Themecontext";
import { useDispatch } from "react-redux";
import { logUserLogout } from "../../redux/features/auditLogs";

function Topbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation();
  const { instance, accounts } = useMsal();
  const { theme, toogleTheme } = useTheme();

  console.log(accounts)

  const [active, setActive] = useState(theme === "Light" ? "Light" : "Dark");

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "https://app.intellicontract.ai.srm-tech.com/", // 🔁 Back to login page or home
    });
    const username = accounts[0]?.name;
    if (username) {
      dispatch(logUserLogout(username));
    }
  };

  return (
    <nav className="header" role="navigation">
      <div className="header-left">
        <h6 className="nav-title">
          {/* <img src={nexus}/> */}
          {/* <img src={srm_white_logo} className="sidebar-logo" /> */}
          IntelliContract
        </h6>
      </div>
      <div className="header-right">
        {/* <div className="header-icon">
           <button onClick={() => i18n.changeLanguage('en')}>English</button>
      </div> 
      <div className="header-icon">
        <button onClick={() => i18n.changeLanguage('ja')}>日本語</button>
     
      </div> */}

        <span></span>
        <div className="toggle-button-group-mt ms-2">
          <button
            className={`toggle-button-mt ${theme === "Light" ? "active" : ""}`}
            onClick={() => theme !== "Dark" && toogleTheme()}
          >
            <span className="icon">
              <img
                src={theme === "Dark" ? darkActive : darkInactive}
                alt="Dark Mode"
              />
            </span>
          </button>

          <button
            className={`toggle-button-mt ${theme === "Dark" ? "active" : ""}`}
            onClick={() => theme !== "Light" && toogleTheme()}
          >
            <span className="icon">
              <img
                src={theme === "Light" ? lightActive : lightInactive}
                alt="Light Mode"
              />
            </span>
          </button>
        </div>

        {/* <div>
          <label class="switch">
            <input type="checkbox"
              onChange={toogleTheme}
              checked={theme==='Light'}
                    />
              <span class="slider"></span>
          </label>
        </div> */}
        <div className="header-profile">
          <div className="d-flex align-items-center gap-2">
            {/* <img src={bell} className="header-notifi" /> */}
            <Avatar
              className="profile-img"
              style={{
                backgroundColor: "#8c8c8c",
                color: "#1f1f1f",
                fontWeight: 550,
              }}
            >
              {accounts[0]?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            {/* <img
                src={profile}
                className="profile-img"
                alt="Profile"
                title={`${accounts[0]?.name}`}
              /> */}
            {/* <img src={dropdown} alt="Dropdown" /> */}
          </div>
          <ul className="header-profile-dropdown">
            {/* <Link to={"/profile"}>
                <li>My Profile</li>
              </Link> */}
            {/* <li>Manage Address</li> */}
            <li className="logout" onClick={() => handleLogout()}>
              Logout
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Topbar;
