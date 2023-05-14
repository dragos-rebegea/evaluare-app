import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "./api";

function ClassPage() {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);

    const fetchStudents = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await api.get(`/evaluation/getStudentsByClass/${classId}`, config);
                setStudents(response.data.data); // Use response.data.data instead of response.data
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }
    };


    useEffect(() => {
        fetchStudents();
    }, [classId]);

    const handleBack = () => {
        navigate("/dashboard");
    };

    return (
        <div className="container">
            <div className="row mb-4">
                <div className="col-12">
                    <h1>Clasa {classId}</h1>
                    <button className="btn btn-secondary my-2" onClick={handleBack}>Inapoi la clase</button>
                    <h2>Elevi</h2>
                    <ul className="list-group">
                        {students.map((student, index) => (
                            <li key={index} className="list-group-item">
                                <Link to={`/class/${classId}/student/${student.ID}`}>
                                    {student.nume} {student.prenume}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ClassPage;
