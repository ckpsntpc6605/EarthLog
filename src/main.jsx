import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Edit from "./pages/Edit/Edit.jsx";
import Post from "./pages/Post/Post.jsx";
import SinglePost from "./pages/SinglePost/SinglePost.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Profile />} />
        <Route path="/post" element={<Post />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
