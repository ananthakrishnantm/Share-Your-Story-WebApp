import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

const UseAuth = () => useContext(AuthContext);

export const UseAuthProvider = ({ children, protectedPaths }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  //useLocation gets the current location.

  useEffect(() => {
    const path = `/blog`;
    const apiUrl = apiBaseUrl + path;
    // Check if the current path is in the list of protected paths
    if (protectedPaths.includes(location.pathname)) {
      axios
        .get(apiUrl, { withCredentials: true })
        .then((res) => {
          setLoggedIn(true);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            navigate("/login");
          }
          console.log(error);
        });
    }
  }, [location.pathname, navigate, protectedPaths]);

  return (
    <AuthContext.Provider value={{ loggedIn }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
