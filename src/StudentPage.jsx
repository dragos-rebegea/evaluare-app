import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";


function StudentGrade({ studentId, exercise, exercises, grades, setGrades }) {
    const navigate = useNavigate();

    const [selectedVariant, setSelectedVariant] = useState("");

    const handleAddGrade = async (exercise) => {
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

            const body = {
                student_id: parseInt(studentId),
                exam: exercises[0].exam,
                Exercitiu: exercise.numar,
                Varianta: selectedVariant,
            };

            const response = await api.post(
                "evaluation/addCalificativ",
                body,
                config
            );

            const newGrades = [...grades, response.data.data];
            setGrades(newGrades);
        } catch (error) {
            console.error("Failed to add grade:", error);
        }
    };

    return (
        <tr>
            <td>{exercise.numar}</td>
            <td>
                <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                >
                    <option key={'default'} value={'-'}>
                        -
                    </option>
                    {exercise.variante.map((varianta) => (
                        <option key={varianta} value={varianta}>
                            {varianta}
                        </option>
                    ))}
                </select>
            </td>
            <td contentEditable="true"></td>
            <td>
                <button onClick={() => handleAddGrade(exercise)}>Add</button>
            </td>
        </tr>
    );
}

function StudentPage() {
    const { classId, studentId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [studentIds, setStudentIds] = useState([]);
    const [grades, setGrades] = useState([]);
    const [exercises, setExercises] = useState([]);

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
                const response = await api.get(
                    `evaluation/getStudentsByClass/${classId}`,
                    config
                );
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
                const response = await api.get(
                    `evaluation/getCalificative/${studentId}`,
                    config
                );
                const data = response.data.data ?? [];
                setGrades(data);
            } catch (error) {
                console.error("Failed to fetch grades:", error);
            }
        };

        fetchGrades();
    }, [studentId]);

    useEffect(() => {
        const fetchExercises = async () => {
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
                const response = await api.get(
                    `evaluation/getExercitii/${studentId}`,
                    config
                );
                const data = response.data.data ?? [];
                setExercises(data);
            } catch (error) {
                console.error("Failed to fetch exercises:", error);
            }
        };

        fetchExercises();
    }, [studentId]);

    const handlePrevious = () => {
        const currentIndex = studentIds.findIndex(
            (id) => id === parseInt(studentId)
        );
        if (currentIndex > 0) {
            navigate(`/class/${classId}/student/${studentIds[currentIndex - 1]}`);
        }
    };

    const handleNext = () => {
        const currentIndex = studentIds.findIndex(
            (id) => id === parseInt(studentId)
        );
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
                {`${student?.nume} ${student?.prenume}`} - Test {`${exercises[0]?.exam}`}
            </h1>
            <table>
                {/* Table header */}
                <thead>
                    <tr>
                        <th>Exercitiu</th>
                        <th>Cod</th>
                        <th></th>
                    </tr>
                </thead>
                {/* Table body */}
                <tbody>
                    {exercises.map((exercise) => {
                        const grade = grades.find(
                            (grade) =>
                                grade?.exercitiu === exercise.numar && grade.varianta
                        );

                        if (grade) {
                            return (
                                <tr key={grade.ID}>
                                    <td>{grade.exercitiu}</td>
                                    <td>{grade.varianta}</td>
                                    <td></td>
                                </tr>
                            );
                        } else {
                            return <StudentGrade key={exercise.numar} studentId={studentId} exercise={exercise} exercises={exercises} grades={grades} setGrades={setGrades} />
                        }
                    })}
                </tbody>
            </table>
            <button onClick={handlePrevious}>Previous</button>
            <button onClick={handleNext}>Next</button>
            <button onClick={handleBack}>Back to Class</button>
        </div>
    );


}

export default StudentPage;
