import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
        <div>
            <h1>Class {classId}</h1>
            <h2>Students</h2>
            <ul>
                {students.map((student, index) => (
                    <li key={index} onClick={() => navigate(`/class/${classId}/student/${student.ID}`)}>
                        {student.nume} {student.prenume}
                    </li>
                ))}
            </ul>
            <button onClick={handleBack}>Back to Dashboard</button>
        </div>
    );
}

export default ClassPage;
