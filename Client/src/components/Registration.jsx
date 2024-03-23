import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmitSignup = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL;
    const path = `/signup`;
    const apiUrl = apiBaseUrl + path;
    axios
      .post(
        apiUrl,
        {
          firstName,
          middleName,
          lastName,
          dateOfBirth,
          username,
          email,
          password,
        },
        { withCredentials: true }
      )
      .then(() => {
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded-md p-8 w-120">
        <h1 className="text-2xl font-bold mb-6 text-center">SignUp</h1>
        <div className="flex flex-col mb-8">
          <div className="flex mb-4">
            <label className="w-full mb-2">First Name:</label>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="flex mb-4">
            <label className="w-full mb-2">Last Name:</label>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="flex mb-4">
            <label className="w-full mb-2">Middle Name:</label>
            <input
              type="text"
              placeholder="Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="flex mb-4">
            <label className="w-full mb-2">Date of Birth:</label>
            <input
              type="date"
              placeholder="Date of Birth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="flex mb-4">
            <label className="w-full mb-2">Username:</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="flex mb-4">
            <label className="w-full mb-2">Email:</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="flex mb-4">
            <label className="w-full mb-2">Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="flex mb-4">
            <label className="w-full mb-2">Confirm Password:</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
        </div>
        <button
          className="bg-green-600 text-white text-2xl px-6 py-3 rounded-md hover:bg-green-400 focus:outline-none focus:ring w-full mt-auto"
          onClick={handleSubmitSignup}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Registration;
