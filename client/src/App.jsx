import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import CreateProject from "./pages/CreateProject";
import UpdateProfile from "./pages/UpdateProfile";
import ProjectDetails from "./pages/ProjectDetails";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createproject" element={<CreateProject />} />
        <Route path="/updateprofile" element={<UpdateProfile />} />
        <Route path="/projectdetails/:id" element={<ProjectDetails />} />
      </Routes>
    </div>
  );
};

export default App;
