import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";

function StudentPage() {
    const { classId, studentId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [studentIds, setStudentIds] = useState([]);
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        const isAuthenticated = !!localStorage.getItem("token");
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchStudents = async () => {
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
                const response = await api.get(`evaluation/getStudentsByClass/${classId}`, config);
                const data = response.data.data;
                setStudentIds(data.map((student) => student.ID));
                setStudents(data);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            }
        };

        fetchStudents();
    }, [classId]);

    useEffect(() => {
        const fetchGrades = async () => {
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
                const response = await api.get(`evaluation/getCalificative/${studentId}`, config);
                const data = response.data.data ?? [];
                setGrades(data);
            } catch (error) {
                console.error("Failed to fetch grades:", error);
            }
        };

        fetchGrades();
    }, [studentId]);

    const handlePrevious = () => {
        const currentIndex = studentIds.findIndex((id) => id === parseInt(studentId));
        if (currentIndex > 0) {
            navigate(`/class/${classId}/student/${studentIds[currentIndex - 1]}`);
        }
    };

    const handleNext = () => {
        const currentIndex = studentIds.findIndex((id) => id === parseInt(studentId));
        if (currentIndex < studentIds.length - 1) {
            navigate(`/class/${classId}/student/${studentIds[currentIndex + 1]}`);
        }
    };

    const student = students.find((student) => student.ID === parseInt(studentId));

    const handleBack = () => {
        navigate(`/class/${classId}`);
    };

    return (
        <div>
            <h1>
                {`${student?.nume} ${student?.prenume}`} - {`${grades[0]?.exam}`}
            </h1>
            <table>
                {/* Table header */}
                <thead>
                <tr>
                    <th>Exercitiu</th>
                    <th>Varianta</th>
                    <th>Nota</th>
                </tr>
                </thead>
                {/* Table body */}
                <tbody>
                {grades.map((grade) => (
                    <tr key={grade.ID}>
                        <td>{grade.exercitiu}</td>
                        <td>{grade.varianta}</td>
                        <td>{grade.nota}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={handlePrevious}>Previous</button>
            <button onClick={handleNext}>Next</button>
            <button onClick={handleBack}>Back to Class</button>
        </div>
    );

}

export default StudentPage;
