import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Edit from "./pages/Edit/Edit.jsx";
import Post from "./pages/Post/Post.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Profile />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/edit" element={<Edit />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
