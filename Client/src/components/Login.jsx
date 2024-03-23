import axios from "axios";
import React, { useState } from "react";
import io from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";

import "./login.css";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL;
    const path = "/login";

    const apiUrl = apiBaseUrl + path;
    const socket = io(apiBaseUrl);
    axios
      .post(apiUrl, { email, password }, { withCredentials: true })
      .then((res) => {
        // localStorage.setItem("token", token);
        socket.emit("checkUserOnline", res.data.userId);
        navigate("/home");
        console.log("logged in");
      })
      .catch((err) => {
        console.log("incorrect password", err);
      });

    return;
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg p-8 shadow-md w-96">
        <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>

        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-600">
            Email :
          </label>
          <input
            className="login-input-fields rounded-md w-full py-2 px-4 text-lg"
            type="text"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-600">
            Password :
          </label>
          <input
            className="login-input-fields rounded-md w-full py-2 px-4 text-lg"
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center mb-8">
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring text-lg"
            onClick={handleLogin}
          >
            Login
          </button>
          <span className="text-blue-700 text-lg">
            <Link to="/forgot-password">Forgot Password?</Link>
          </span>
        </div>
        <div className="text-center">
          <span className="text-gray-600 text-lg">
            <button
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring text-lg"
              onClick={() => navigate("/register")}
            >
              Create New Account
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
