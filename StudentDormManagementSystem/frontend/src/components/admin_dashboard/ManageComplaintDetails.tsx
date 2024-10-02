import React, {useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import {useNavigate, useParams} from 'react-router-dom';
import AdminNavigationBar from './AdminNavigationBar';
import {Complaint} from "../../types/types";
import useUpdateData from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";
import Spinner from "../shared/Spinner";

const ManageComplaintDetails = () => {
    const {id} = useParams();
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [newStatus, setNewStatus] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<boolean | null>(false);

    useEffect(() => {
        axios.get(`/complaints/${id}`)
            .then(response => {
                setComplaint(response.data);
                setNewStatus(response.data.isSolved);
            })
            .catch(error => {
                console.error('Error fetching complaint details:', error);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTouched(true);

        if (e.target.value === 'ПРИЕТО') {
            setNewStatus("ПРИЕТО");
        } else if (e.target.value === 'ЗА_ПРЕГЛЕД') {
            setNewStatus("ЗА_ПРЕГЛЕД");
        } else if (e.target.value === 'ОТХВЪРЛЕНО') {
            setNewStatus("ОТХВЪРЛЕНО");
        }
    };

    const {handleUpdate, error: updateError} = useUpdateData({
        updateUrl: `/complaints/${id}`,
        postData: null,
        initialData: complaint?.status,
        newData: newStatus,
        params: {status: newStatus},
        setLoading,
        onSuccess: (response) => {
            setComplaint(response.data);
            setNewStatus(response.data.status);
        },
        onError: (error) => {
            console.error('Error updating complaint details:', error);
        }
    });

    const {handleDelete, error: deleteError} = useDeleteData({
        deleteUrl: `/complaints/delete/${id}`,
        setLoading,
        onSuccess: () => {
            navigate('/manage-complaints');
        },
        onError: (error) => {
            console.error('Error deleting complaint:', error);
        }
    });

    const handleDeleteConfirmation = () => {
        const userConfirmed = window.confirm('Сигурни ли сте, че желаете да изтриете оплакването?');

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
                complaint ? (
                    <div className="container">
                        <h1>Оплакване</h1>
                        <div className="form-container" style={{maxWidth:"650px"}}>
                            <form>
                                <div className="form-group">
                                    <label>ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="id"
                                        value={complaint.complaintId}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Заглавие</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={complaint.title}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Описание</label>
                                    <textarea
                                        className="form-control"
                                        name="content"
                                        rows={5}
                                        value={complaint.content}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Дата на подаване</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="madeOn"
                                        value={complaint.madeOn}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Факултетен номер на подал студент</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="facultyNumber"
                                        value={complaint.facultyNumber}
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Статус</label>
                                    <select
                                        className="form-control"
                                        name="status"
                                        value={newStatus}
                                        onChange={handleChange}
                                    >
                                        <option value="ПРИЕТО">ПРИЕТО</option>
                                        <option value="ЗА_ПРЕГЛЕД">ЗА_ПРЕГЛЕД</option>
                                        <option value="ОТХВЪРЛЕНО">ОТХВЪРЛЕНО</option>
                                    </select>
                                </div>
                                <br/>
                                <button disabled={loading || !touched} type="button" className="btn btn-primary"
                                        style={{marginRight: "16px", marginBottom: "16px"}} onClick={handleUpdate}>Запази
                                </button>
                                <button disabled={loading} type="button" className="btn btn-danger"
                                        style={{marginRight: "16px", marginBottom: "16px"}} onClick={handleDeleteConfirmation}>Изтрий
                                </button>
                                <button type="button" className="btn btn-secondary"
                                        style={{marginBottom: "16px"}} onClick={handleCancel}>Назад
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

export default ManageComplaintDetails;
