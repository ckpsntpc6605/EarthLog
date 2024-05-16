import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Edit from "./pages/Edit/Edit.jsx";
import ReEdit from "./pages/ReEdit/ReEdit.jsx";
import SinglePost from "./pages/SinglePost/SinglePost.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import SignIn from "./pages/Sign_in/SignIn.jsx";
import Forum from "./pages/Forum/Forum.jsx";
import OtherUserProfile from "./pages/OtherUserProfile/OtherUserProfile.jsx";
import TravelProject from "./pages/TravelProject/TravelProject.jsx";
import EditTravelProject from "./pages/EditTravelProject/EditTravelProject.jsx";
import Landing from "./pages/Landing/Landing.jsx";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Profile />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/profile/:id" element={<OtherUserProfile />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/edit/:id" element={<ReEdit />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/project" element={<TravelProject />} />
        <Route path="/project/:id" element={<EditTravelProject />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="/landing" element={<Landing />} />
    </Routes>
  </BrowserRouter>
);
