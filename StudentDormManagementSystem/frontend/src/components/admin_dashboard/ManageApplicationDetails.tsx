import React, {useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import {useNavigate, useParams} from 'react-router-dom';
import AdminNavigationBar from './AdminNavigationBar';
import {Application} from "../../types/types";
import useUpdateData from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";
import Spinner from "../shared/Spinner";

const ManageApplicationDetails = () => {
    const {id} = useParams();
    const [application, setApplication] = useState<Application | null>(null);
    const [newStatus, setNewStatus] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<boolean | null>(false);

    useEffect(() => {
        setLoading(true);

        axios.get(`/applications/${id}`)
            .then(response => {
                setApplication(response.data);
                setNewStatus(response.data.status);
            })
            .catch(error => {
                console.error('Error fetching application details:', error);
            }).finally(() => {
            setLoading(false);
        });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTouched(true);

        setNewStatus(e.target.value);
    };

    const {handleUpdate, error: updateError} = useUpdateData({
        updateUrl: `/applications/${id}`,
        postData: null,
        initialData: application?.status,
        newData: newStatus,
        params: {status: newStatus},
        setLoading,
        onSuccess: (response) => {
            setApplication(response.data);
            setNewStatus(response.data.status);
        },
        onError: (error) => {
            console.error('Error updating application details:', error);
        }
    });

    const {handleDelete, error: deleteError} = useDeleteData({
        deleteUrl: `/applications/delete/${id}`,
        setLoading,
        onSuccess: () => {
            navigate('/manage-applications');
        },
        onError: (error) => {
            console.error('Error deleting application:', error);
        }
    });

    const handleDeleteConfirmation = () => {
        const userConfirmed = window.confirm('Сигурни ли сте, че желаете да изтриете заявлението?');

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
                application ? (
                    <div className="container">
                        <h1>Заявление</h1>
                        <div className="form-container" style={{display: 'flex', justifyContent: 'space-between'}}>
                            <form>
                                <div className="form-group">
                                    <label>ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="id"
                                        value={application.applicationId}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Тип</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="type"
                                        value={application.type}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Дата на подаване</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="appliedOn"
                                        value={application.appliedOn}
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
                                        <option value="ОДОБРЕНО">ОДОБРЕНО</option>
                                        <option value="ОТХВЪРЛЕНО">ОТХВЪРЛЕНО</option>
                                        <option value="ЗА_ПРЕГЛЕД">ЗА_ПРЕГЛЕД</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Факултетен номер</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="facultyNumber"
                                        value={application.studentFacultyNumber}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Приятел, с когото кандидатства</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="friend"
                                        value={application.friendFacultyNumber ? application.friendFacultyNumber : '-'}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Желани стаи</label>
                                    <br/>
                                    <label>Стая #1</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="desiredRoom1"
                                        value={`Стая: ${application.desiredRoom1 ? application.desiredRoom1.number : '-'}, `+
                                            `Блок: ${application.desiredRoom1?.apartmentBuildingNumber || ''}`+
                                            `${application.desiredRoom1?.apartmentBuildingEntrance || ''}`}
                                        disabled
                                    />
                                    <label>Стая #2</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="desiredRoom2"
                                        value={`Стая: ${application.desiredRoom2 ? application.desiredRoom2.number : '-'}, `+
                                            `Блок: ${application.desiredRoom2?.apartmentBuildingNumber || ''}`+
                                            `${application.desiredRoom2?.apartmentBuildingEntrance || ''}`}
                                        disabled
                                    />
                                    <label>Стая #3</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="desiredRoom3"
                                        value={`Стая: ${application.desiredRoom3 ? application.desiredRoom3.number : '-'}, `+
                                            `Блок: ${application.desiredRoom3?.apartmentBuildingNumber || ''}`+
                                            `${application.desiredRoom3?.apartmentBuildingEntrance || ''}`}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Кандидатстване</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="period"
                                        value={application.recordPeriod ? application.recordPeriod : '-'}
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
                )
            }
        </div>
    );
};

export default ManageApplicationDetails;