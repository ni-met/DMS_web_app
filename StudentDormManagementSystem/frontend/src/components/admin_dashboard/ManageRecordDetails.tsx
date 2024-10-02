import React, {useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import {useNavigate, useParams} from 'react-router-dom';
import AdminNavigationBar from './AdminNavigationBar';
import {Record} from "../../types/types";
import useUpdateData from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";
import Spinner from "../shared/Spinner";

const ManageRecordDetails = () => {
    const {id} = useParams<{ id: string }>();
    const [record, setRecord] = useState<Record | null>(null);
    const [newIsActive, setNewIsActive] = useState<boolean | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<boolean | null>(false);

    useEffect(() => {
        setLoading(true);

        axios.get(`/records/${id}`)
            .then(response => {
                setRecord(response.data);
                setNewIsActive(response.data.isActive);
            })
            .catch(error => {
                console.error('Error fetching record details:', error);
            }).finally(() => {
            setLoading(false);
        })
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTouched(true);

        if (e.target.value === 'true') {
            setNewIsActive(true);
        } else {
            setNewIsActive(false);
        }
    };

    const {handleUpdate, error: updateError} = useUpdateData({
        updateUrl: `/records/${id}`,
        postData: null,
        initialData: record?.isActive,
        newData: newIsActive,
        params: {isActive: newIsActive},
        setLoading,
        onSuccess: (response) => {
            setRecord(response.data);
            setNewIsActive(response.data.isActive);
        },
        onError: (error) => {
            console.error('Error updating record details:', error);
        }
    });

    const {handleDelete, error: deleteError} = useDeleteData({
        deleteUrl: `/records/delete/${id}`,
        setLoading,
        onSuccess: () => {
            navigate('/manage-records');
        },
        onError: (error) => {
            console.error('Error deleting record:', error);
        }
    });

    const handleDeleteConfirmation = () => {
        const userConfirmed = window.confirm('Сигурни ли сте, че желаете да изтриете кандидатстването?');

        if (userConfirmed) {
            handleDelete();
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    console.log(record);

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            {
                record ? (
                    <div className="container">
                        <h1>Кандидатстване</h1>
                        <div className="form-container" style={{display: 'flex', justifyContent: 'space-between'}}>
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
                                        value={String(newIsActive)}
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
                )}
        </div>
    );
};

export default ManageRecordDetails;