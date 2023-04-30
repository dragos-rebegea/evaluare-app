import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";
import ClassPage from "./ClassPage";

function Dashboard() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);

    const checkTokenValidity = async () => {
        const token = localStorage.getItem("token");
        if (token === null) {
            navigate("/");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await api.get("admin/ping", config);
        } catch (error) {
            if (error.response && error.response.status !== 200) {
                localStorage.removeItem("token");
                navigate("/");
            }
        }
    };

    useEffect(() => {
        checkTokenValidity();
    }, []);

    useEffect(() => {
        const fetchClasses = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    };
                    const response = await api.get("/evaluation/getAllClasses", config);
                    setClasses(response.data.data);
                } catch (error) {
                    console.error("Error fetching classes:", error);
                }
            }
        };

        fetchClasses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Classes</h2>
            <ul>
                {classes.map((classItem, index) => (
                    <li key={index}>
                        <Link to={`/class/${classItem}`}>{classItem}</Link>
                    </li>
                ))}
            </ul>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;
