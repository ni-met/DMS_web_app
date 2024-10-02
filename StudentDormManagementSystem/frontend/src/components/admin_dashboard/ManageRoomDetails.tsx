import React, {useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import {useNavigate, useParams} from 'react-router-dom';
import AdminNavigationBar from './AdminNavigationBar';
import {Room} from "../../types/types";
import useUpdateData from "../hooks/useUpdateData";
import useDeleteData from "../hooks/useDeleteData";
import Spinner from "../shared/Spinner";

const ManageRoomDetails = () => {
    const {id} = useParams();
    const [room, setRoom] = useState<Room | null>(null);
    const [newCapacity, setNewCapacity] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<boolean | null>(false);

    useEffect(() => {
        axios.get(`/rooms/${id}`)
            .then(response => {
                setRoom(response.data);
                setNewCapacity(response.data.capacity);
            })
            .catch(error => {
                console.error('Error fetching room details:', error);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);

        if (value > 4 || value < 0) {
            alert('Свободните места могат да бъдат от 0 до 4.');
            return;
        }

        setTouched(true);
        setNewCapacity(e.target.value);
    };

    const {handleUpdate, error: updateError} = useUpdateData({
        updateUrl: `/rooms/${id}`,
        postData: null,
        initialData: room?.capacity,
        newData: setNewCapacity,
        params: {capacity: newCapacity},
        setLoading,
        onSuccess: (response) => {
            setRoom(response.data);
            setNewCapacity(response.data.capacity);
        },
        onError: (error) => {
            console.error('Error updating room details:', error);
        }
    });

    const {handleDelete, error: deleteError} = useDeleteData({
        deleteUrl: `/rooms/delete/${id}`,
        setLoading,
        onSuccess: () => {
            navigate('/manage-rooms');
        },
        onError: (error) => {
            console.error('Error deleting room:', error);
        }
    });

    const handleDeleteConfirmation = () => {
        const userConfirmed = window.confirm('Сигурни ли сте, че желаете да изтриете стаята?');

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
                room ? (
                    <div className="container">
                        <h1>Стая</h1>
                        <div className="form-container" style={{display: 'flex', justifyContent: 'space-between'}}>
                            <form>
                                <div className="form-group">
                                    <label>Номер на стая</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="number"
                                        value={room.number}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Свободни места</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="capacity"
                                        value={newCapacity}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Блок</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="apartmentBuildingNumber"
                                        value={room.apartmentBuildingNumber}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Вход</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="apartmentBuildingEntrance"
                                        value={room.apartmentBuildingEntrance}
                                        disabled
                                    />
                                </div>

                                <br/>
                                <button disabled={loading || !touched} type="button" className="btn btn-primary"
                                        style={{marginRight: "16px", marginBottom: "16px"}}
                                        onClick={handleUpdate}>Запази
                                </button>
                                <button disabled={loading} type="button" className="btn btn-danger"
                                        style={{marginRight: "16px", marginBottom: "16px"}}
                                        onClick={handleDeleteConfirmation}>Изтрий
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

export default ManageRoomDetails;