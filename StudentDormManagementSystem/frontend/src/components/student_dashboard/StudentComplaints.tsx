import React, {useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import {Complaint} from "../../types/types";
import StudentNavigationBar from "./StudentNavigationBar";
import useSearch from "../hooks/useSearch";
import Spinner from "../shared/Spinner";

const StudentComplaints: React.FC = () => {
    const [facultyNumber, setFacultyNumber] = useState<string | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);

    useEffect(() => {
        axios.get(`/students/profile`)
            .then(response => {
                setFacultyNumber(response.data.facultyNumber);
            })
            .catch(error => {
                console.error('Error fetching student profile:', error);
            });
    }, []);

    useEffect(() => {
        if (facultyNumber == null) return;

        axios.get(`/complaints/student/${facultyNumber}`)
            .then(response => {
                setComplaints(response.data);
            })
            .catch(error => {
                console.error('Error fetching student complaints:', error);
            });
    }, [facultyNumber]);

    const {params, handleSearchChange} = useSearch({
        searchParams: {
            id: '',
            title: '',
            madeOn: '',
            status: ''
        },
        searchUrl: `/complaints/search/${facultyNumber}`,
        handleResponse: setComplaints
    });

    return (
        <div className="d-flex">
            <StudentNavigationBar/>

            {complaints.length > 0 ? (
                <div className="container">
                    <h1>Оплаквания</h1>
                    <h5>Търси по:</h5>
                    <div className="mb-3">
                        <div className="complaints-container">
                            <input
                                type="text"
                                name="id"
                                placeholder="ID"
                                className="form-control mb-2"
                                value={params.id}
                                onChange={handleSearchChange}
                            />
                            <input
                                type="text"
                                name="title"
                                placeholder="Заглавие"
                                className="form-control mb-2"
                                value={params.title}
                                onChange={handleSearchChange}
                            />
                            <input
                                type="text"
                                name="madeOn"
                                placeholder="Дата на подаване"
                                className="form-control mb-2"
                                value={params.madeOn}
                                onChange={handleSearchChange}
                            />

                            <select
                                name="status"
                                value={params.status}
                                onChange={handleSearchChange}
                                className="form-control mb-2"
                            >
                                <option value="">Статус</option>
                                <option value="ПРИЕТО">ПРИЕТО</option>
                                <option value="ЗА_ПРЕГЛЕД">ЗА_ПРЕГЛЕД</option>
                                <option value="ОТХВЪРЛЕНО">ОТХВЪРЛЕНО</option>
                            </select>
                        </div>

                        <table className="table table-hover table-bordered">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Заглавие</th>
                                <th>Дата на подаване</th>
                                <th>Факултетен номер</th>
                                <th>Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {complaints.map((complaint: Complaint) => (
                                <tr key={complaint.complaintId}>
                                    <td>{complaint.complaintId}</td>
                                    <td>{complaint.title}</td>
                                    <td>{complaint.madeOn}</td>
                                    <td>{complaint.facultyNumber}</td>
                                    <td>{complaint.status}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="container">
                    <Spinner delay={2000}/>
                </div>
            )}
        </div>
    );
};

export default StudentComplaints;
