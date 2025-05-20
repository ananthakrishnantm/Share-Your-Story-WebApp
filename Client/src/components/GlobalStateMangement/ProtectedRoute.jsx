import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UseAuth } from "./UseAuthProvider";

const ProtectedRoute = ({ redirectTo, requiredRole }) => {
  const { loggedIn, loading, isUser, isAdmin } = UseAuth();

  // Log states for debugging
  // console.log("Loading:", loading);
  // console.log("LoggedIn:", loggedIn);
  // console.log("IsUser:", isUser);
  // console.log("IsAdmin:", isAdmin);

  // Redirect to login if still loading or not logged in
  if (loading) {
    return <div>Loading...</div>; // Optionally, show a loading indicator
  }

  if (!loggedIn) {
    return <Navigate to={redirectTo} />;
  }

  // Admins should have access to both admin and user routes
  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to={redirectTo} />;
  }

  if (requiredRole === "user" && !(isUser || isAdmin)) {
    return <Navigate to={redirectTo} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
