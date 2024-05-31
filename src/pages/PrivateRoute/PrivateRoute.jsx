import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthListener from "../../utils/hooks/useAuthListener";

export default function PrivateRoute() {
  const currentUserToken = localStorage.getItem("currentUser");
  const currentUser = useAuthListener();
  return currentUserToken ? <Outlet /> : <Navigate to="/signin" />;
}
