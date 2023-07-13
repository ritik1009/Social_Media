import { useRef } from "react";
import "./register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();

  const handleClick = async(e) => {
    e.preventDefault();
    if(passwordAgain.current.value!==password.current.value){
      password.current.setCustomValidity("Passwords don't match")
    }else{
      const user ={
        username:username.current.value,
        email:email.current.value,
        password:password.current.value
      }
      try{
        await axios.post("http://localhost:8800/api/auth/register",user);
        navigate("/login");
      }catch(err){
        console.log("Error:-",err);
      }
    }
    
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Nerdsocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              className="loginInput"
              ref={username}
            />
            <input placeholder="Email" className="loginInput" ref={email} />
            <input
              placeholder="Password"
              className="loginInput"
              type="password"
              ref={password}
              minLength="6"
            />
            <input
              placeholder="Password Again"
              className="loginInput"
              ref={passwordAgain}
              type="password"
              minLength="6"
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <button className="loginRegisterButton">Log into Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}
