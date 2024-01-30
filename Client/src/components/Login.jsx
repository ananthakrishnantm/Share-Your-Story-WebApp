import axios from "axios";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    axios
      .post("http://localhost:3000/login", { email, password })
      .then((res) => {
        const token = res.data.token;

        localStorage.setItem("token", token);
        navigate("/home");
        console.log("logged in");
      })
      .catch((err) => {
        console.log("incorrect password", err);
      });

    return;
  };

  return (
    <div>
      {
        <>
          <h1>Login</h1>

          <div>
            <label>Email :</label>
            <input
              type="text"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password :</label>
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleLogin}>Login</button>
          {/* <button onClick={handleSignUp}>SignUp</button> */}
        </>
      }
    </div>
  );
};

export default Login;
