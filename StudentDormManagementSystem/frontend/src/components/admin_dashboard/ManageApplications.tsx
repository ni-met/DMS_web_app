import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AdminNavigationBar from './AdminNavigationBar';
import {Application, Record} from "../../types/types";
import useSearch from "../hooks/useSearch";
import axios from "../../axiosConfig";

const ManageApplications: React.FC = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);
    const [recordPeriods, setRecordPeriods] = useState<Record[]>([]);

    const {params, handleSearchChange} = useSearch({
        searchParams: {
            id: '',
            type: '',
            appliedOn: '',
            status: '',
            facultyNumber: '',
            period: ''
        },
        searchUrl: `/applications/search`,
        handleResponse: setApplications
    });

    useEffect(() => {
        axios.get(`/records/all`)
            .then(response => {
                setRecordPeriods(response.data);
            })
            .catch(error => {
                console.error('Error fetching records:', error);
            });
    }, []);

    const handleManageApplication = (id: number) => {
        navigate(`/manage-application/${encodeURIComponent(id)}`);
    };

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            <div className="container mb-4">
                <h1>Управление на заявления</h1>
                <h5>Търси по:</h5>
                <div className="mb-3">
                    <input
                        type="text"
                        name="id"
                        placeholder="ID"
                        className="form-control mb-2"
                        value={params.id}
                        onChange={handleSearchChange}
                    />
                    <select
                        className="form-control mb-2"
                        name="type"
                        value={params.type}
                        onChange={handleSearchChange}
                    >
                        <option value="">Избери тип</option>
                        <option value="НАСТАНЯВАНЕ">НАСТАНЯВАНЕ</option>
                        <option value="СМЯНА">СМЯНА</option>
                        <option value="НАПУСКАНЕ">НАПУСКАНЕ</option>
                    </select>
                    <input
                        type="text"
                        name="appliedOn"
                        placeholder="Дата на подаване"
                        className="form-control mb-2"
                        value={params.appliedOn}
                        onChange={handleSearchChange}
                    />
                    <select
                        className="form-control mb-2"
                        name="status"
                        value={params.status}
                        onChange={handleSearchChange}
                    >
                        <option value="">Избери статус</option>
                        <option value="ОДОБРЕНО">ОДОБРЕНО</option>
                        <option value="ЗА_ПРЕГЛЕД">ЗА_ПРЕГЛЕД</option>
                        <option value="ОТХВЪРЛЕНО">ОТХВЪРЛЕНО</option>
                    </select>
                    <input
                        type="text"
                        name="facultyNumber"
                        placeholder="Факултетен номер"
                        className="form-control mb-2"
                        value={params.facultyNumber}
                        onChange={handleSearchChange}
                    />

                    <select
                        className="form-control mb-2"
                        name="period"
                        value={params.period}
                        onChange={handleSearchChange}
                        required
                    >
                        <option value="">Избери период</option>
                        {recordPeriods.map(period => (
                            <option key={period.period} value={period.period}>
                                {period.period}
                            </option>
                        ))}
                    </select>
                </div>

                <table className="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Тип</th>
                        <th>Дата на подаване</th>
                        <th>Статус</th>
                        <th>Факултетен номер</th>
                        <th>Период</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.map((application: Application) => (
                        <tr key={application.applicationId}>
                            <td>{application.applicationId}</td>
                            <td>{application.type}</td>
                            <td>{application.appliedOn}</td>
                            <td>{application.status}</td>
                            <td>{application.studentFacultyNumber}</td>
                            <td>{application.recordPeriod || '-'}</td>
                            <td>
                                <button className="btn btn-primary"
                                        onClick={() => handleManageApplication(application.applicationId)}>
                                    Редактирай заявление
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

export default ManageApplications;
