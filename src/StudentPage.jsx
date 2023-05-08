import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";


function AddStudentGrade({ studentId, exercise, exercises, grades, setGrades }) {
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
                    className="custom-select"
                    style={{ width: "100px" }}
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
                <button className="btn btn-primary btn-sm ml-2" onClick={() => handleAddGrade(exercise)}>Salveaza</button>
            </td>
        </tr>
    );
}

function EditStudentGrade({ studentId, grade, exercise, exercises, grades, setGrades }) {
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(grade.varianta);

    const handleEditGrade = async () => {
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
                "evaluation/updateCalificativ",
                body,
                config
            );

            const newGrades = [...grades.filter((g) => g.exercitiu !== grade.exercitiu), response.data.data];
            setGrades(newGrades);
            setEditMode(false)
        } catch (error) {
            console.error("Failed to update grade:", error);
        }
    }

    if (!editMode) {
        return (
            <tr key={grade.ID}>
                <td>{grade.exercitiu}</td>
                <td>{grade.varianta}  <button className="btn btn-sm btn-secondary ml-2" onClick={() => setEditMode(true)}>Edit</button></td>
            </tr>
        );
    }

    return (
        <tr key={grade.ID}>
            <td>{grade.exercitiu}</td>
            <td>
                <select
                    className="custom-select"
                    style={{ width: "100px" }}
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                >
                    {exercise.variante.map((varianta) => (
                        <option key={varianta} value={varianta}>
                            {varianta}
                        </option>
                    ))}
                </select>
                <button className="btn btn-primary btn-sm ml-2" onClick={() => handleEditGrade()}>Save</button>
                <button className="btn btn-danger btn-sm ml-2" onClick={() => setEditMode(false)}>Close</button>
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
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h1>
                        {`${student?.nume} ${student?.prenume}`} - Test {`${exercises[0]?.exam}`}
                    </h1>
                    <button className="btn btn-secondary mr-2" onClick={handleBack}>Back to Class</button>
                    <table className="table table-striped my-4">
                        {/* Table header */}
                        <thead>
                            <tr>
                                <th style={{ width: "300px" }}>Exercitiu</th>
                                <th>Cod</th>
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
                                    return <EditStudentGrade key={exercise.numar} grade={grade} studentId={studentId} exercise={exercise} exercises={exercises} grades={grades} setGrades={setGrades} />
                                } else {
                                    return <AddStudentGrade key={exercise.numar} studentId={studentId} exercise={exercise} exercises={exercises} grades={grades} setGrades={setGrades} />
                                }
                            })}
                        </tbody>
                    </table>
                    <button className="btn btn-primary mr-2" onClick={handlePrevious}>{"<"} Previous</button>
                    <button className="btn btn-primary mr-2" onClick={handleNext}>Next {">"}</button>
                </div>
            </div>
        </div>
    );


}

export default StudentPage;
