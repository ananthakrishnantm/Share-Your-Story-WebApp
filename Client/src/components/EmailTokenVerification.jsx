import axios from "axios";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";

const EmailTokenVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [renderCount, setRenderCount] = useState(0);
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  console.log(token);

  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const apiUrl = `${apiBaseUrl}/verify-email?token=${token}`;
  const socket = io(apiBaseUrl);

  useEffect(() => {
    setRenderCount((prevCount) => prevCount + 1);

    axios
      .get(apiUrl, { withCredentials: true })
      .then((response) => {
        console.log("this is the response data", response.data);
        // Check if response is successful (status 200)
        if (response.status === 200) {
          // Reset error state
          setSuccess(true);
          // Handle any additional logic if needed
        } else {
          // Set error state if response status is not 200
          setError("Something went wrong with the request.");
        }
      })
      .catch((err) => {
        // Handle specific errors (status 401)
        if (err.response && err.response.status === 401) {
          setError("Verification failed. Incorrect token.");
        } else {
          // Set generic error for other types of errors
          setError("Something went wrong. Please try again.");
        }
      });
  }, []);

  console.log("Component rendered. Render count:", renderCount);

  return (
    <div className="min-h-screen flex items-stretch text-white">
      <div
        className="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      >
        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        <div className="w-full px-24 z-10">
          <h1 className="text-5xl font-bold text-left tracking-wide">
            Keep it special
          </h1>
          <p className="text-3xl my-4">
            Share your journey uniquely, wherever you roam.
          </p>
        </div>
        <div className="bottom-0 absolute p-4 text-center right-0 left-0 flex justify-center space-x-4">
          {/* Social media icons */}
        </div>
      </div>
      <div
        className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0"
        style={{ backgroundColor: "#161616" }}
      >
        <div
          className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80)",
          }}
        >
          <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        </div>

        <div className="w-full py-6 z-20">
          <h1 className="my-6"></h1>
          <div>
            {success ? (
              <React.Fragment>
                <h1 className="text-5xl font-bold mb-16">
                  Account has been verified
                </h1>
                <div className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto m-4">
                  {/* <!-- this is google link --> */}
                </div>
                <p>
                  Your account has been verified successfully, you can now{" "}
                  <a
                    href="/login"
                    style={{ color: "lightblue", textDecoration: "underline" }}
                  >
                    login
                  </a>
                  .
                </p>
              </React.Fragment>
            ) : (
              <p>Your account has not been verified. Try again</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTokenVerification;
