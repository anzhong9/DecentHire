import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import CreateJob from "./pages/createJob";
import UpdateProfile from "./pages/UpdateProfile";
import JobDetails from "./pages/JobDetails";
import MyJob from "./pages/MyJob";
import JobOwner from "./pages/JobOwner";

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createjob" element={<CreateJob />} />
        <Route path="/updateprofile" element={<UpdateProfile />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="myjob/:id" element={<MyJob />} />
        <Route path="/owner/job/:id" element={<JobOwner />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
};

export default App;
