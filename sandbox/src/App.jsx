// import { useEffect, useState } from "react";
// const KEY = "31dd5f19";
// import axios from "axios";
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Page from "./pages/Page";
import CheckCall from "./pages/CheckCall";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="bg-blue-100 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/page" element={<Page />} />
        <Route path="/checkCall" element={<CheckCall />} />
      </Routes>
    </div>
  );
}

export default App;
