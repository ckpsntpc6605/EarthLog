import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const currentUserToken = localStorage.getItem("currentUser");
  return currentUserToken ? <Outlet /> : <Navigate to="/signin" />;
}
