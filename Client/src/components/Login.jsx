import axios from "axios";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./login.css";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    axios
      .post(
        "http://localhost:3000/login",
        { email, password },
        { withCredentials: true }
      )
      .then((res) => {
        // localStorage.setItem("token", token);
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
          <div className="flex items-center justify-center h-screen">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h1 className="text-2xl font-bold mb-5">Login</h1>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-600">
                  Email :
                </label>
                <input
                  className="login-input-fields rounded-sm"
                  type="text"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Password :
                </label>
                <input
                  className="login-input-fields rounded-sm"
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900 focus:outline-none focus:ring  mt-5"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
              {/* <button onClick={handleSignUp}>SignUp</button> */}
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default Login;
