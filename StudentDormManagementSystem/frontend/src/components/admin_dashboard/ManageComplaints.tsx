import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AdminNavigationBar from './AdminNavigationBar';
import {Complaint} from "../../types/types";
import useSearch from "../hooks/useSearch";

const ManageComplaints: React.FC = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState<Complaint[]>([]);

    const {params, handleSearchChange} = useSearch({
        searchParams: {
            id: '',
            title: '',
            madeOn: '',
            facultyNumber: '',
            status: ''
        },
        searchUrl: `/complaints/search`,
        handleResponse: setComplaints
    });

    const handleManageComplaint = (id: number) => {
        navigate(`/manage-complaint/${encodeURIComponent(id)}`);
    };

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            <div className="container mb-4">
                <h1>Управление на оплаквания</h1>
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
                    <input
                        type="text"
                        name="facultyNumber"
                        placeholder="Факултетен номер"
                        className="form-control mb-2"
                        value={params.facultyNumber}
                        onChange={handleSearchChange}
                    />

                    <select
                        name="status"
                        value={params.status}
                        onChange={handleSearchChange}
                        className="form-control mb-2"
                    >
                        <option value="">Избери статус</option>
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
                        <th></th>
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
                            <td>
                                <button className="btn btn-primary"
                                        onClick={() => handleManageComplaint(complaint.complaintId)}>
                                    Редактирай оплакване
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

export default ManageComplaints;