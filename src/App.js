import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import ClassPage from "./ClassPage";
import StudentPage from "./StudentPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/class/:classId" element={<ClassPage />} />
                <Route path="/class/:classId/student/:studentId" element={<StudentPage />} />
            </Routes>
        </Router>
    );
}

export default App;
