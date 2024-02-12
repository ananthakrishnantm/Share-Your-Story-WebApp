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

  const navigate = useNavigate();

  const handleSubmitSignup = () => {
    // const formData = new FormData();
    // formData.append("firstName", firstName);
    // formData.append("middleName", middleName);
    // formData.append("lastName", lastName);
    // formData.append("dateOfBirth", dateOfBirth);
    // formData.append("username", userName);
    // formData.append("email", email);
    // formData.append("password", password);

    axios
      .post(
        `http://localhost:3000/signup`,
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

    // console.log(formData);
  };

  return (
    <div>
      <h1>SignUp</h1>
      <div className="flex-col flex justify-center ">
        <label>First Name : </label>
        <input
          type="text"
          placeholder="Enter first Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label>Middle Name : </label>
        <input
          type="text"
          placeholder="MiddleName"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
        />
        <label>Last Name : </label>
        <input
          type="text"
          placeholder="Enter the Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label>Date Of Birth : </label>
        <input
          type="date"
          placeholder="enter the dob"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
        <label>UserName : </label>
        <input
          type="text"
          placeholder="enter the username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          placeholder="enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* <label>Confirm Passowrd : </label>
        <input
          type="password"
          placeholder="type once more"
          value={confrimPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        /> */}
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900 focus:outline-none focus:ring  mt-5"
          onClick={handleSubmitSignup}
        >
          Submit
        </button>
      </div>
      <h1>BRB</h1>
    </div>
  );
};

export default Registration;
