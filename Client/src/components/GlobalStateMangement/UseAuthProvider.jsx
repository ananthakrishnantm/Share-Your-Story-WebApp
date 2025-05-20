import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const UseAuth = () => useContext(AuthContext);

export const UseAuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [emailError, setEmailError] = useState("");
  const [otherError, setOtherError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginerror, setloginerror] = useState(null); // New state for error handling
  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const checkAuthStatus = async () => {
    const path = `/login/status`;
    const apiUrl = apiBaseUrl + path;

    try {
      const res = await axios.get(apiUrl, { withCredentials: true });
      setLoggedIn(true);
      setUserData(res.data.data);
    } catch {
      setLoggedIn(false);
    } finally {
      setLoading(false); // Ensure loading is set to false in all cases
    }
  };
  console.log("this is the user data", userData);

  const authlogin = async (email, password) => {
    try {
      const path = "/login";
      const apiUrl = apiBaseUrl + path;
      const response = await axios.post(
        apiUrl,
        { email, password },
        { withCredentials: true }
      );
      setLoggedIn(true);
      setEmailError(""); // Clear previous email error
      setPasswordError(""); // Clear previous password error
      setOtherError(""); // Clear previous other error
      setloginerror(null); // Clear any previous general login error
    } catch (error) {
      setLoggedIn(false);
      if (error) {
        const { data, status } = error.response;
        console.log("status", status);
        if (status === 401) {
          setPasswordError("Incorrect Password.");
        } else if (status === 404) {
          setEmailError("Incorrect Email.");
        } else if (status === 403) {
          setOtherError(data.message); // Verification or ban error from the backend
        } else {
          setEmailError("Enter valid credentials.");
          setPasswordError("Enter valid credentials.");
        }
      }
    }
  };
  console.log("this ithe data", userData);
  const authlogout = async () => {
    const path = "/logout";
    const apiUrl = apiBaseUrl + path;

    axios.post(apiUrl, {}, { withCredentials: true });
    navigate("/login");
    setLoggedIn(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const { id: loggedInUserId, userRole: role = [] } = userData;

  const isAdmin = role.includes("admin");
  const isUser = role.includes("user");
  console.log("this is role", isUser);
  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        loading,
        loggedInUserId,
        role,
        isAdmin,
        isUser,
        authlogin,
        authlogout,
        loginerror,
        emailError,
        otherError,
        passwordError,
        setEmailError,
        setPasswordError,
        setOtherError,
        setloginerror,
      }} // Provide error state
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
