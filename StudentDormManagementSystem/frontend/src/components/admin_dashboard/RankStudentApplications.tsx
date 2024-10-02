import React, {useCallback, useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import {useNavigate} from 'react-router-dom';
import AdminNavigationBar from './AdminNavigationBar';
import {Application, Record, Student} from "../../types/types";

const RankStudentApplications = () => {
    const [record, setRecord] = useState<Record | null>(null);
    const [newIsActive, setNewIsActive] = useState('');
    const [rankedApplications, setRankedApplications] = useState<Application[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<boolean | null>(false);
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        setLoading(true);

        axios.get(`/records/latest`)
            .then(response => {
                setRecord(response.data);
                setNewIsActive(response.data.isActive);
            })
            .catch(error => {
                console.error('Error fetching record details:', error);
            }).finally(() => {
            setLoading(false);
        })
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setTouched(true);
        setNewIsActive(e.target.value);
    };

    const handleSave = () => {
        setLoading(true);

        axios.put(`/records/${record?.recordId}`, null, {params: {isActive: newIsActive}})
            .then(response => {
                alert('Кандидатстването е обновено успешно!');
                setTouched(false);
                setRecord(response.data)
                setNewIsActive(response.data.isActive);
            })
            .catch(error => {
                console.error('Error updating record details:', error);
                alert('Неуспешно обновяване на данни.');
            }).finally(() => {
            setLoading(false);
        })
    };

    const handleRankingApplications = () => {
        if (record?.isActive) {
            alert("Статусът трябва да е неактивен за извършване на класиране.");
        } else {
            setLoading(true);

            axios.get(`/applications/rank/${record?.recordId}`)
                .then(response => {
                    setRankedApplications(response.data);

                    const facultyNumbers = response.data.map((app: any) => app.studentFacultyNumber);
                    const studentPromises = facultyNumbers.map((facultyNumber: string) =>
                        axios.get(`/students/${facultyNumber}`)
                    );

                    return Promise.all(studentPromises)
                }).then(studentPromises => {
                const allStudents = studentPromises.map(response => response.data);

                setStudents(allStudents);
            })
                .catch(error => {
                    console.error('Error fetching ranked applications:', error);
                }).finally(() => {
                setLoading(false);
            })
        }
    };

    const handleCancel = () => {
        navigate(`/admins`);
    };

    const getRoom = useCallback((facultyNumber: string) => {
        const student = students.find((student) => student.facultyNumber === facultyNumber);

        return student ? `${student.room}, Блок ${student.apartmentBuildingNumber}${student.apartmentBuildingEntrance || ''}` : '-';
    }, [students])

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            {
                record ? (
                    <div className="container">
                        <div>
                            <h1>Кандидатстване</h1>
                            <div className="form-container" style={{maxWidth: "342px"}}>
                                <form>
                                    <div className="form-group">
                                        <label>ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="id"
                                            value={record?.recordId}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Период</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="period"
                                            value={record?.period}
                                            disabled
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Статус</label>
                                        <select
                                            className="form-control"
                                            name="isActive"
                                            value={newIsActive}
                                            onChange={handleChange}
                                        >
                                            <option value="true">АКТИВНО</option>
                                            <option value="false">НЕАКТИВНО</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Дата на създаване</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="createdOn"
                                            value={record?.createdOn}
                                            disabled
                                        />
                                    </div>

                                    <br/>
                                    <button type="button" disabled={loading || !touched} className="btn btn-primary"
                                            style={{marginBottom: "16px", marginRight: "16px"}}
                                            onClick={handleSave}>Запази
                                    </button>
                                    <button type="button" className="btn btn-secondary"
                                            style={{marginBottom: "16px", marginRight: "16px"}}
                                            onClick={handleCancel}>Назад
                                    </button>

                                    <button type="button" disabled={loading} className="btn btn-primary"
                                            style={{marginBottom: "16px"}}
                                            onClick={handleRankingApplications}>
                                        Класирай студенти
                                    </button>
                                </form>
                            </div>

                            {rankedApplications.length > 0 && students.length > 0 &&
                                <div className="applications-container mt-3">
                                    <table className="table table-hover table-bordered">
                                        <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Тип</th>
                                            <th>Дата на подаване</th>
                                            <th>Статус</th>
                                            <th>Факултетен номер</th>
                                            <th>Приятел</th>
                                            <th>Стая #1, Блок</th>
                                            <th>Стая #2, Блок</th>
                                            <th>Стая #3, Блок</th>
                                            <th>Период</th>
                                            <th>Нова стая</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {rankedApplications.map((rankedApplication: Application) => (
                                            <tr key={rankedApplication.applicationId}>
                                                <td>{rankedApplication.applicationId}</td>
                                                <td>{rankedApplication.type}</td>
                                                <td>{rankedApplication.appliedOn}</td>
                                                <td>{rankedApplication.status}</td>
                                                <td>{rankedApplication.studentFacultyNumber}</td>
                                                <td>{rankedApplication.friendFacultyNumber || "-"}</td>
                                                <td>{rankedApplication.desiredRoom1.number != 0 ?
                                                    `${rankedApplication.desiredRoom1.number}, Блок` +
                                                    `${rankedApplication.desiredRoom1.apartmentBuildingNumber}` +
                                                    `${rankedApplication.desiredRoom1.apartmentBuildingEntrance || ""}` : "-"}</td>
                                                <td>{rankedApplication.desiredRoom2.number != 0 ?
                                                    `${rankedApplication.desiredRoom2.number}, Блок` +
                                                    `${rankedApplication.desiredRoom2.apartmentBuildingNumber}` +
                                                    `${rankedApplication.desiredRoom2.apartmentBuildingEntrance || ""}` : "-"}</td>
                                                <td>{rankedApplication.desiredRoom3.number != 0 ?
                                                    `${rankedApplication.desiredRoom3.number}, Блок` +
                                                    `${rankedApplication.desiredRoom3.apartmentBuildingNumber}` +
                                                    `${rankedApplication.desiredRoom3.apartmentBuildingEntrance || ""}` : "-"}</td>
                                                <td>{rankedApplication.recordPeriod || '-'}</td>
                                                <td>{getRoom(rankedApplication.studentFacultyNumber)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    </div>
                ) : (
                    <div className="container">
                        <div className="spinner-border text-primary" style={{marginTop: '50px', marginLeft: '100px'}}
                             role="status">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default RankStudentApplications;