import React, {useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import {useNavigate, useParams} from 'react-router-dom';
import AdminNavigationBar from './AdminNavigationBar';
import {Bill} from "../../types/types";
import useDeleteData from "../hooks/useDeleteData";
import useUpdateData from "../hooks/useUpdateData";
import Spinner from "../shared/Spinner";

const ManageBillDetails = () => {
    const {id} = useParams();
    const [bill, setBill] = useState<Bill | null>(null);
    const [newStatus, setNewStatus] = useState<boolean | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<boolean | null>(false);

    useEffect(() => {
        axios.get(`/bills/${id}`)
            .then(response => {
                setBill(response.data);
                setNewStatus(response.data.isPaid);
            })
            .catch(error => {
                console.error('Error fetching bill details:', error);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTouched(true);

        if (e.target.value === 'true') {
            setNewStatus(true);
        } else {
            setNewStatus(false);
        }
    };

    const {handleUpdate, error: updateError} = useUpdateData({
        updateUrl: `/bills/${id}`,
        postData: null,
        initialData: bill?.isPaid,
        newData: newStatus,
        params: {isPaid: newStatus},
        setLoading,
        onSuccess: (response) => {
            setBill(response.data);
            setNewStatus(response.data.isPaid);
        },
        onError: (error) => {
            console.error('Error updating bill details:', error);
        }
    });

    const {handleDelete, error: deleteError} = useDeleteData({
        deleteUrl: `/bills/delete/${id}`,
        setLoading,
        onSuccess: () => {
            navigate('/manage-bills');
        },
        onError: (error) => {
            console.error('Error deleting bill:', error);
        }
    });

    const handleDeleteConfirmation = () => {
        const userConfirmed = window.confirm('Сигурни ли сте, че желаете да изтриете сметката?');

        if (userConfirmed) {
            handleDelete();
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            {
                bill ? (
                    <div className="container">
                        <h1>Сметка</h1>
                        <div className="form-container" style={{maxWidth: "258px"}}>
                            <form>
                                <div className="form-group">
                                    <label>ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="id"
                                        value={bill?.billId}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Тип</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="type"
                                        value={bill?.type}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Сума</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="amount"
                                        value={`${bill?.amount} лв.`}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Дата на издаване</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="issuedOn"
                                        value={bill?.issuedOn}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Факултетен номер</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="studentFacultyNumber"
                                        value={bill?.studentFacultyNumber}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Статус</label>
                                    <select
                                        className="form-control"
                                        name="isPaid"
                                        value={String(newStatus)}
                                        onChange={handleChange}
                                    >
                                        <option value="true">ПЛАТЕНО</option>
                                        <option value="false">НЕПЛАТЕНО</option>
                                    </select>
                                </div>
                                <br/>
                                <button disabled={loading || !touched} type="button" className="btn btn-primary"
                                        style={{marginRight: "16px"}} onClick={handleUpdate}>Запази
                                </button>
                                <button disabled={loading} type="button" className="btn btn-danger"
                                        style={{marginRight: "16px"}} onClick={handleDeleteConfirmation}>Изтрий
                                </button>
                                <button type="button" className="btn btn-secondary"
                                        onClick={handleCancel}>Назад
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <Spinner delay={2000} />
                )
            }
        </div>
    );
};

export default ManageBillDetails;