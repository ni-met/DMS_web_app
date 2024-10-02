import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AdminNavigationBar from './AdminNavigationBar';
import {Student} from "../../types/types";
import useSearch from "../hooks/useSearch";

const ManageStudents: React.FC = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);

    const {params, handleSearchChange} = useSearch({
        searchParams: {
            email: '',
            fullName: '',
            facultyNumber: '',
            faculty: '',
            specialty: '',
            semester: '',
            phoneNumber: '',
            apartmentBuilding: '',
            room: '',
            city: '',
            gpa: ''
        },
        searchUrl: `/students/search`,
        handleResponse: setStudents
    });

    const handleManageProfile = (facultyNumber: string) => {
        navigate(`/manage-student/${encodeURIComponent(facultyNumber)}`);
    };

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            <div className="container mb-4">
                <h1>Управление на студенти</h1>
                <h5>Търси по:</h5>
                <div className="mb-3">
                    <input
                        type="text"
                        name="facultyNumber"
                        placeholder="Факултетен номер"
                        className="form-control mb-2"
                        value={params.facultyNumber}
                        onChange={handleSearchChange}
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="Имейл"
                        className="form-control mb-2"
                        value={params.email}
                        onChange={handleSearchChange}
                    />
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Име"
                        className="form-control mb-2"
                        value={params.fullName}
                        onChange={handleSearchChange}
                    />
                    <input
                        type="text"
                        name="faculty"
                        placeholder="Факултет"
                        className="form-control mb-2"
                        value={params.faculty}
                        onChange={handleSearchChange}
                    />
                    <input
                        type="text"
                        name="specialty"
                        placeholder="Специалност"
                        className="form-control mb-2"
                        value={params.specialty}
                        onChange={handleSearchChange}
                    />
                    <input
                        type="text"
                        name="semester"
                        placeholder="Семестър (число)"
                        className="form-control mb-2"
                        value={params.semester}
                        onChange={handleSearchChange}
                    />
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Телефонен номер"
                        className="form-control mb-2"
                        value={params.phoneNumber}
                        onChange={handleSearchChange}
                    />
                    <input
                        type="text"
                        name="apartmentBuilding"
                        placeholder="Блок"
                        className="form-control mb-2"
                        value={params.apartmentBuilding}
                        onChange={handleSearchChange}
                    />
                    <input
                        type="text"
                        name="room"
                        placeholder="Стая (число)"
                        className="form-control mb-2"
                        value={params.room}
                        onChange={handleSearchChange}
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="Град"
                        className="form-control mb-2"
                        value={params.city}
                        onChange={handleSearchChange}
                    />
                    <input
                        type="text"
                        name="gpa"
                        placeholder="Среден успех"
                        className="form-control mb-2"
                        value={params.gpa}
                        onChange={handleSearchChange}
                    />
                </div>

                <table className="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>Факултетен номер</th>
                        <th>Име</th>
                        <th>Имейл</th>
                        <th>Факултет</th>
                        <th>Специалност</th>
                        <th>Семестър</th>
                        <th>Телефонен номер</th>
                        <th>Блок</th>
                        <th>Стая</th>
                        <th>Град</th>
                        <th>Среден успех</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student: Student) => (
                        <tr key={student.facultyNumber}>
                            <td>{student.facultyNumber}</td>
                            <td>{student.firstName} {student.lastName}</td>
                            <td>{student.email}</td>
                            <td>{student.faculty}</td>
                            <td>{student.specialty}</td>
                            <td>{student.semester}</td>
                            <td>{student.phoneNumber}</td>
                            <td>{student.apartmentBuildingNumber
                                ? `${student.apartmentBuildingNumber}${student.apartmentBuildingEntrance || ''}`
                                : '-'}</td>
                            <td>{student.room || '-'}</td>
                            <td>{student.city}</td>
                            <td>{student.gpa}</td>
                            <td>
                                <button className="btn btn-primary"
                                        onClick={() => handleManageProfile(student.facultyNumber)}>
                                    Редактирай профил
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageStudents;