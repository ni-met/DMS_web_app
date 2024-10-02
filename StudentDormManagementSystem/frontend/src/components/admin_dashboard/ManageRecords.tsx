import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AdminNavigationBar from './AdminNavigationBar';
import {Record} from "../../types/types";
import useSearch from "../hooks/useSearch";
import axios from "../../axiosConfig";

const ManageRecords: React.FC = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState<Record[]>([]);
    const [recordPeriods, setRecordPeriods] = useState<Record[]>([]);

    const {params, handleSearchChange} = useSearch({
        searchParams: {
            id: '',
            period: '',
            isActive: ''
        },
        searchUrl: `/records/search`,
        handleResponse: setRecords
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

    const handleManageRecord = (id: number) => {
        navigate(`/manage-record/${encodeURIComponent(id)}`);
    };

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            <div className="container mb-4">
                <h1>Управление на кандидатствания</h1>
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
                    <select
                        name="isActive"
                        value={params.isActive}
                        onChange={handleSearchChange}
                        className="form-control mb-2"
                    >
                        <option value="">Избери статус</option>
                        <option value="true">АКТИВНО</option>
                        <option value="false">НЕАКТИВНО</option>
                    </select>

                </div>

                <table className="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Период</th>
                        <th>Статус</th>
                        <th>Дата на създаване</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {records.map((record: Record) => (
                        <tr key={record.recordId}>
                            <td>{record.recordId}</td>
                            <td>{record.period}</td>
                            <td>{record.isActive ? 'АКТИВНО' : 'НЕАКТИВНО'}</td>
                            <td>{record.createdOn}</td>
                            <td>
                                <button className="btn btn-primary"
                                        onClick={() => handleManageRecord(record.recordId)}>
                                    Редактирай кандидатстване
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


export default ManageRecords;