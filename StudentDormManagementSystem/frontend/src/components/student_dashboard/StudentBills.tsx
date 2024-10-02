import React, {useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import {Bill} from "../../types/types";
import StudentNavigationBar from "./StudentNavigationBar";
import useSearch from "../hooks/useSearch";
import Spinner from "../shared/Spinner";

const StudentBills: React.FC = () => {
    const [facultyNumber, setFacultyNumber] = useState<string | null>(null);
    const [bills, setBills] = useState<Bill[]>([]);

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

        axios.get(`/bills/student/${facultyNumber}`)
            .then(response => {
                setBills(response.data);
            })
            .catch(error => {
                console.error('Error fetching student bills:', error);
            });
    }, [facultyNumber]);

    const {params, handleSearchChange} = useSearch({
        searchParams: {
            id: '',
            type: '',
            issuedOn: '',
            isPaid: ''
        },
        searchUrl: `/bills/search/${facultyNumber}`,
        handleResponse: setBills
    });

    return (
        <div className="d-flex">
            <StudentNavigationBar/>

            {bills.length > 0 ? (
                <div className="container">
                    <h1>Сметки</h1>
                    <h5>Търси по:</h5>
                    <div className="bills-container">
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
                                <th>Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bills.map((bill: Bill) => (
                                <tr key={bill.billId}>
                                    <td>{bill.billId}</td>
                                    <td>{bill.type}</td>
                                    <td>{bill.amount.toFixed(2)} лв.</td>
                                    <td>{bill.issuedOn}</td>
                                    <td>{bill.isPaid ? 'ПЛАТЕНО' : 'НЕПЛАТЕНО'}</td>
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

export default StudentBills;