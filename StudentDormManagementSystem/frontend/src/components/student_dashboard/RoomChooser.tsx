import axios from '../../axiosConfig';
import React, {useCallback, useEffect, useState} from "react";
import {ApartmentBuilding, Room} from "../../types/types";
import Spinner from "../shared/Spinner";

const RoomChooser = ({
                         selectedBuildingId,
                         movingPeople,
                         setFormData,
                         roomToChoose,
                         resetSelections
                     }: any) => {
    const [apartmentBuilding, setApartmentBuilding] = useState<ApartmentBuilding | null>(null);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [allRooms, setAllRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<{
        value: number,
        label: string,
        apartmentBuildingEntrance: string,
        apartmentBuildingNumber: number
    } | null>(null);
    const [roomsPerFloor, setRoomsPerFloor] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedBuildingId == null) return;
        setLoading(true);

        axios.get(`/apartment-buildings/${selectedBuildingId}`, {params: {movingPeople}})
            .then(response => {
                setApartmentBuilding(response.data);
            })
            .catch(error => {
                console.error('Error fetching apartment building data:', error);
            }).finally(() => {
            setLoading(false);
        })
    }, [selectedBuildingId]);

    useEffect(() => {
        if (selectedBuildingId == null) return;
        setLoading(true);

        axios.get(`rooms/show-available`, {
            params: {
                apartmentBuildingId: selectedBuildingId,
                movingPeople
            }
        })
            .then(response => {
                setAvailableRooms(response.data);
            })
            .catch(error => {
                setAvailableRooms([]);
                setSelectedRoom(null);
                console.error('Error fetching available rooms:', error);
            }).finally(() => {
            setLoading(false);
        });
    }, [selectedBuildingId, movingPeople]);

    useEffect(() => {
        if (selectedBuildingId == null) return;
        setLoading(true);

        axios.get(`rooms/in-building/${selectedBuildingId}`, {
            params: {
                apartmentBuildingId: selectedBuildingId,
                movingPeople
            }
        })
            .then(response => {
                setAllRooms(response.data);
            })
            .catch(error => {
                setAllRooms([]);
                setSelectedRoom(null);
                console.error('Error fetching rooms:', error);
            }).finally(() => {
            setLoading(false);
        });
    }, [selectedBuildingId, movingPeople]);

    useEffect(() => {
        if (selectedRoom != null) {
            const room = parseInt(selectedRoom.label)
            const prefix = room < 200 ? 1 : 2;

            setRoomsPerFloor(allRooms.filter(room =>
                room.number != null && Math.floor(room.number / 100) === prefix));
        }
    }, [selectedRoom, allRooms]);

    const handleRoomSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;

        if (selectedValue) {
            try {
                const selectedRoom = JSON.parse(selectedValue);

                setSelectedRoom(selectedRoom);
            } catch (error) {
                console.error('Error parsing selected room:', error);
            }
        } else {
            setSelectedRoom(null);
        }
    };

    const showRoomsPerFloor = useCallback((roomsPerFloor: Room[], selectedRoom: {
        value: number,
        label: string
    } | null) => {
        let firstRoomRow: any = [];
        let secondRoomRow: any = [];

        roomsPerFloor.forEach((room, index) => {
            if (index < 6) {
                if (index === 3) {
                    firstRoomRow.push(
                        <div className="col" key={`stairs-${index}`} style={{paddingLeft: "0px", paddingRight: "0px"}}>
                            <div className="card" style={{borderRadius: "2px"}}>
                                <div className="card-body"
                                     style={{minHeight: "100px", alignSelf: "center", alignContent: "center"}}>
                                    <span className="material-symbols-outlined">floor</span>
                                </div>
                            </div>
                        </div>
                    );
                }

                firstRoomRow.push(
                    <div className="col" key={room.roomId} style={{paddingLeft: "0px", paddingRight: "0px"}}>
                        <div className="card"
                             style={{
                                 borderRadius: "2px",
                                 backgroundColor: selectedRoom && selectedRoom.value == room.roomId ? 'green' : 'red',
                                 color: "#fff"
                             }}>
                            <div className="card-body"
                                 style={{minHeight: "100px", alignSelf: "center", alignContent: "center"}}>
                                Стая {room.number}
                            </div>
                        </div>
                    </div>
                )
            } else {
                if (index === 9) {
                    secondRoomRow.push(
                        <div className="col" key={`stairs-${index}`} style={{paddingLeft: "0px", paddingRight: "0px"}}>
                            <div className="card" style={{borderRadius: "2px"}}>
                                <div className="card-body"
                                     style={{minHeight: "100px", alignSelf: "center", alignContent: "center"}}>
                                    <span className="material-symbols-outlined">floor</span>
                                </div>
                            </div>
                        </div>
                    );
                }

                secondRoomRow.push(
                    <div className="col" key={room.roomId} style={{paddingLeft: "0px", paddingRight: "0px"}}>
                        <div className="card"
                             style={{
                                 borderRadius: "2px",
                                 backgroundColor: selectedRoom && selectedRoom.value == room.roomId ? 'green' : 'red',
                                 color: "#fff"
                             }}>
                            <div className="card-body"
                                 style={{minHeight: "100px", alignSelf: "center", alignContent: "center"}}>
                                Стая {room.number}
                            </div>
                        </div>
                    </div>
                )
            }
        });

        return {firstRoomRow, secondRoomRow};
    }, [roomsPerFloor, selectedRoom]);

    const handleConfirm = () => {
        const roomKey = Object.keys(roomToChoose).find(key => roomToChoose[key] === true)!;

        setFormData((prev: any) => ({
            ...prev,
            [roomKey]: {
                roomId: selectedRoom?.value,
                number: selectedRoom?.label,
                apartmentBuildingId: selectedBuildingId,
                apartmentBuildingNumber: selectedRoom?.apartmentBuildingNumber,
                apartmentBuildingEntrance: selectedRoom?.apartmentBuildingEntrance
            }
        }))

        resetSelections()
    }

    const {firstRoomRow, secondRoomRow} = showRoomsPerFloor(roomsPerFloor, selectedRoom)

    return (
        <div>
            {
                apartmentBuilding ? (
                    <div>
                        <h1>Блок {apartmentBuilding?.number}{apartmentBuilding?.entrance || ''}</h1>
                        <div className="form-container" style={{display: 'flex'}}>
                            <div className="form-group">
                                <select
                                    className="form-control mt-2 mb-2"
                                    name="room"
                                    value={selectedRoom ? JSON.stringify(selectedRoom) : ''}
                                    onChange={handleRoomSelect}
                                    disabled={loading || availableRooms.length === 0}
                                >
                                    <option value="">Избери стая</option>
                                    {availableRooms.map(room => (
                                        <option key={room.roomId}
                                                value={JSON.stringify({
                                                    value: room.roomId,
                                                    label: room.number,
                                                    apartmentBuildingNumber: room.apartmentBuildingNumber,
                                                    apartmentBuildingEntrance: room.apartmentBuildingEntrance
                                                })}>
                                            Стая {room.number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {selectedRoom ? (
                                <div className="form-group">
                                    <button name="desiredRoom"
                                            disabled={loading} type="button" className="btn btn-primary"
                                            style={{marginTop: '8px', marginLeft: '16px'}}
                                            onClick={handleConfirm}>Потвърди
                                    </button>
                                </div>
                            ) : ''}
                        </div>

                        <div>
                            {loading ? (
                                <p>Зареждане на стаи...</p>
                            ) : (
                                <div style={{minWidth: 'max-content', marginTop: '16px'}}>
                                    <div className="row" style={{marginLeft: "auto", marginRight: "auto"}}>
                                        {firstRoomRow}
                                    </div>
                                    <div className="row" style={{height: "45px"}}>
                                        <br/>
                                    </div>
                                    <div className="row" style={{marginLeft: "auto", marginRight: "auto"}}>
                                        {secondRoomRow}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <Spinner delay={2000} />
                )}
        </div>
    );
};

export default RoomChooser;