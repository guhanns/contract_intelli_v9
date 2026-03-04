import React, { useState } from "react";
import "./login.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import nexus from "../../../images/Logo/NexusLabs-Logo.png";
import srm_white_logo from "../../../images/Logo/logo_srm_white.png";
import loginimg from "../../../images/Logo/login-img.jpg";
import SRM from '../../../images/Logo/SRM_login_logo.svg'

function Login() {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
    isRememberMe: false,
  });

  const handleChange = (name, value) => {
    setUser({ ...user, [name]: value });
  };

  const handleSubmitLogin = () => {
    const { username, password, isRememberMe } = user;

    // if(username.length<0){
    //   return toast.error("Username Required")
    // }

    // if(password.length<=0){
    //   return toast.error("Password required")
    // }

    // navigate('/dashboard')
  };

  const login = () => {
    // instance.loginRedirect({ scopes: ["user.read"] });
    navigate('/contract')
  };
  return (
    <div className="container-fluid login-bg">
      <div className="row">
        <div className="col-6 p-0">
          <div className="login-left">
            <div className="login-part">
              <div className="login-head">
                <div>
                  <img src={SRM} className="login-srm"/>
                </div>
                <h4>IntelliContract</h4>
                <h6>Welcome back! Please enter your details.</h6>
              </div>
              <div className="login-form">
                <div className="login-email">
                  <label className="">Email</label>
                  <div>
                    <input className="login-input" />
                  </div>
                </div>
                <div className="login-password">
                  <label className="">Password</label>
                  <div>
                    <input className="login-input" type="password" />
                  </div>
                </div>
                <div className="login-opt">
                  <div>
                    <label class="checkbox-container">
                      <input type="checkbox" />
                      <span class="custom-checkbox"></span>
                      Remember me
                    </label>
                  </div>
                  <div>
                    <span>Forgot Password?</span>
                  </div>
                </div>
                <div className="login-sign">
                  <button>Sign in</button>
                </div>
                <div className="login-sso">
                  <button onClick={()=>login()}>Sign in with SSO</button>
                </div>
              </div>
            </div>
             <div className="login-footer text-center">
                © SRM Technologies Private Limited {new Date()?.getFullYear()}
            </div>
          </div>
        </div>
        <div className="col-6 p-0">
          <div className="login-right">
            <img src={loginimg} className="login-rht-img" />
            <div className="login-grad"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
