import { useContext, useRef } from "react";
import "./login.css"
import { loginCall } from "../../apiCalls";
import {AuthContext} from "../../context/AuthContext"
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const {isFetching, dispatch} = useContext(AuthContext);

  const handleClick = (e)=>{
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
    navigate('/')


  }
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">NerdSocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on NerdSocial
          </span>
        </div>
        <div className="loginRight">
          <form onSubmit={handleClick} className="loginBox">
            <input
              type="email"
              placeholder="Email"
              className="loginInput"
              required
              ref={email}
            />
            <input
              type="password"
              placeholder="Password"
              className="loginInput"
              minLength="6"
              required
              ref={password}
            />
            <button className="loginButton" type="submit">
              {isFetching?
                <CircularProgress style={{color:'white'}} size="20px"/>
                :"Login"}
            </button>
            <span className="loginForgot">Forgot password?</span>
            <button className="loginRegisterButton">
              Create a New Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login