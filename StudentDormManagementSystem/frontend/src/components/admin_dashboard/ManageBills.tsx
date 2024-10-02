import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AdminNavigationBar from './AdminNavigationBar';
import {Bill} from "../../types/types";
import useSearch from "../hooks/useSearch";

const ManageBills: React.FC = () => {
    const navigate = useNavigate();
    const [bills, setBills] = useState<Bill[]>([]);

    const {params, handleSearchChange} = useSearch({
        searchParams: {
            id: '',
            type: '',
            issuedOn: '',
            facultyNumber: '',
            isPaid: ''
        },
        searchUrl: `/bills/search`,
        handleResponse: setBills
    });

    const handleManageBill = (id: number) => {
        navigate(`/manage-bill/${encodeURIComponent(id)}`);
    };

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            <div className="container mb-4">
                <h1>Управление на сметки</h1>
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
                        <option value="НАЕМ">НАЕМ</option>
                        <option value="ВОДА">ВОДА</option>
                        <option value="ТОК">ТОК</option>
                        <option value="ПАРНО">ПАРНО</option>
                        <option value="НОЩУВКА">НОЩУВКА</option>
                    </select>
                    <input
                        type="text"
                        name="issuedOn"
                        placeholder="Дата на издаване"
                        className="form-control mb-2"
                        value={params.issuedOn}
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
                        name="isPaid"
                        value={params.isPaid}
                        onChange={handleSearchChange}
                        className="form-control mb-2"
                    >
                        <option value="">Избери статус</option>
                        <option value="true">Платено</option>
                        <option value="false">Неплатено</option>
                    </select>
                </div>

                <table className="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Тип</th>
                        <th>Сума</th>
                        <th>Дата на издаване</th>
                        <th>Факултетен номер</th>
                        <th>Статус</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {bills.map((bill: Bill) => (
                        <tr key={bill.billId}>
                            <td>{bill.billId}</td>
                            <td>{bill.type}</td>
                            <td>{bill.amount.toFixed(2)} лв.</td>
                            <td>{bill.issuedOn}</td>
                            <td>{bill.studentFacultyNumber}</td>
                            <td>{bill.isPaid ? 'ПЛАТЕНО' : 'НЕПЛАТЕНО'}</td>
                            <td>
                                <button className="btn btn-primary"
                                        onClick={() => handleManageBill(bill.billId)}>
                                    Редактирай сметка
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
export default ManageBills;