import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Start from "../Pages/Start";
import Register from "../Components/UserAuth/Register";
import Login from "../Components/UserAuth/Login";
import Home from "../Pages/Home";
import GameContainer from "../websocketlayer/GameContainer/GameContainer";
import Space from "../Pages/Space";
import Game from "../Pages/Game";
import ProfileDetail from "../Components/ProfileDetail";
import ProtectedRoute from "./ProtectedRoute";
import AuthRedirected from "./AuthRedirected";
// import { Route, Routes } from "react-router-dom";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AuthRedirected element={<Start />} />} />

        <Route
          path="/register"
          element={<AuthRedirected element={<Register />} />}
        />
        <Route path="/login" element={<AuthRedirected element={<Login />} />} />

        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/space" element={<ProtectedRoute element={<Space />} />} />
        <Route path="/game" element={<ProtectedRoute element={<Game />} />} />
        <Route
          path="/profile-detail"
          element={<ProtectedRoute element={<ProfileDetail />} />}
        />
      </Routes>
    </div>
  );
}

export default App;
