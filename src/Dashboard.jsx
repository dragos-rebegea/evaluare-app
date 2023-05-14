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
            await api.get("evaluation/ping", config);
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
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h1>Clase</h1>
                    <ul className="list-group">
                        {classes.map((classItem, index) => (
                            <Link key={index} to={`/class/${classItem}`}>
                                <li className="list-group-item">{classItem}</li>
                            </Link>
                        ))}
                    </ul>
                    <button className="btn btn-danger mt-4" onClick={handleLogout}>Logout</button>
                </div>
            </div>

        </div >
    );
}

export default Dashboard;
