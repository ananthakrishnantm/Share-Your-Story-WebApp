import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

const UseAuth = () => useContext(AuthContext);

export const UseAuthProvider = ({ children, protectedPaths }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  //useLocation gets the current location.

  useEffect(() => {
    // Check if the current path is in the list of protected paths
    if (protectedPaths.includes(location.pathname)) {
      axios
        .get(`http://localhost:3000/blog`, { withCredentials: true })
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
