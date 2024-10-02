import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AdminNavigationBar from './AdminNavigationBar';
import {Room} from "../../types/types";
import useSearch from "../hooks/useSearch";

const ManageRooms: React.FC = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);

    const {params, handleSearchChange} = useSearch({
        searchParams: {
            roomNumber: '',
            apartmentBuilding: ''
        },
        searchUrl: `/rooms/search`,
        handleResponse: setRooms
    });

    const handleManageRoom = (id: number) => {
        console.log("ID: " + id);
        navigate(`/manage-room/${encodeURIComponent(id)}`);
    };

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            <div className="container mb-4">
                <h1>Управление на стаи</h1>
                <h5>Търси по:</h5>
                <div className="mb-3">
                    <input
                        type="text"
                        name="roomNumber"
                        placeholder="Стая (номер)"
                        className="form-control mb-2"
                        value={params.roomNumber}
                        onChange={handleSearchChange}
                    />
                    <input
                        type="text"
                        name="apartmentBuilding"
                        placeholder="Блок"
                        className="form-control mb-2"
                        value={params.apartmentBuilding}
                        onChange={handleSearchChange}
                    />
                </div>

                <table className="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>Стая</th>
                        <th>Блок</th>
                        <th>Свободни места</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {rooms.map((room: Room) => (
                        <tr key={room.roomId}>
                            <td>{room.number}</td>
                            <td>{room.apartmentBuildingNumber
                                ? `${room.apartmentBuildingNumber}${room.apartmentBuildingEntrance || ''}` : '-'}</td>
                            <td>{room.capacity || '-'}</td>
                            <td>
                                <button className="btn btn-primary"
                                        onClick={() => handleManageRoom(room.roomId)}>
                                    Редактирай стая
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

export default ManageRooms;