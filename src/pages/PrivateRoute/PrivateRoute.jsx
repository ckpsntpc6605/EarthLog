import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const currentUser = localStorage.getItem("currentUser");
  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
}
