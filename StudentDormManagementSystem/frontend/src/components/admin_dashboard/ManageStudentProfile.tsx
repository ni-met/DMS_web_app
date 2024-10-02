import React, {useEffect, useState} from 'react';
import AdminNavigationBar from "./AdminNavigationBar";
import axios from '../../axiosConfig';
import {useNavigate, useParams} from "react-router-dom";
import {Student, Bill, Faculty, Specialty, ApartmentBuilding, Room} from "../../types/types";
import useDeleteData from "../hooks/useDeleteData";
import Spinner from "../shared/Spinner";

const ManageStudentProfile: React.FC = () => {
    const {facultyNumber} = useParams();
    const [student, setStudent] = useState<Student>();

    const [bills, setBills] = useState<Bill[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [apartmentBuildings, setApartmentBuildings] = useState<ApartmentBuilding[]>([]);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<boolean | null>(false);

    useEffect(() => {
        setLoading(true);

        axios.get(`/students/${facultyNumber}`)
            .then(response => {
                setStudent(response.data);
            })
            .catch(error => {
                console.error('Error fetching student profile:', error);
            }).finally(() => {
            setLoading(false);
        })
    }, [facultyNumber]);

    useEffect(() => {
        setLoading(true);

        axios.get(`/bills/student/${facultyNumber}`)
            .then(response => {
                setBills(response.data);
            })
            .catch(error => {
                console.error('Error fetching student bills:', error);
            }).finally(() => {
            setLoading(false);
        })
    }, [facultyNumber]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTouched(true);
        const {name, value} = e.target;

        setStudent((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        axios.put(`/students/${facultyNumber}`, student)
            .then(response => {
                alert('Студентският профил е обновен успешно!');
                navigate(`/manage-student/${facultyNumber}`);
            })
            .catch(error => {
                console.error('Error updating student profile:', error);
                alert('Неуспешно обновяване на данни.');
            });
    };

    const {handleDelete, error: deleteError} = useDeleteData({
        deleteUrl: `/students/delete/${facultyNumber}`,
        setLoading,
        onSuccess: () => {
            navigate('/manage-students');
        },
        onError: (error) => {
            console.error('Error deleting student:', error);
        }
    });

    const handleDeleteConfirmation = () => {
        const userConfirmed = window.confirm('Сигурни ли сте, че желаете да изтриете студентския профил?');

        if (userConfirmed) {
            handleDelete();
        }
    };

    useEffect(() => {
        setLoading(true);

        axios.get(`/faculties/all`)
            .then(response => {
                setFaculties(response.data);
            })
            .catch(error => {
                console.error('Error fetching faculties:', error);
            }).finally(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!student || student.faculty === null) return;

        setLoading(true);

        axios.get(`/specialties/faculty/${encodeURIComponent(student.faculty)}`)
            .then(response => {
                setSpecialties(response.data);
            })
            .catch(error => {
                console.error('Error fetching specialties:', error);
            }).finally(() => {
            setLoading(false);
        });
    }, [student]);

    const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStudent((prev: any) => ({...prev, faculty: e.target.value, specialty: ''}));
    };

    const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStudent((prev: any) => ({...prev, specialty: e.target.value}));
    };

    useEffect(() => {
        setLoading(true)

        axios.get(`apartment-buildings/all`, {params: {movingPeople: 1}})
            .then(response => {
                setApartmentBuildings(response.data);
            })
            .catch(error => {
                console.error('Error fetching available apartment buildings:', error);
            }).finally(() => {
            setLoading(false);
        });
    }, []);

    const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setTouched(true);

        if (selectedValue) {
            const selectedBuilding = JSON.parse(selectedValue);

            setStudent((prev: any) => ({
                ...prev,
                apartmentBuildingId: selectedBuilding.apartmentBuildingId,
                apartmentBuildingNumber: selectedBuilding.number,
                apartmentBuildingEntrance: selectedBuilding.entrance
            }));
        } else {
            setStudent((prev: any) => ({
                ...prev,
                apartmentBuildingId: null,
                apartmentBuildingNumber: null,
                apartmentBuildingEntrance: null,
            }));

        }
    };

    useEffect(() => {
        if (!student || student.apartmentBuildingId == null) return;
        setLoading(true);

        axios.get(`rooms/show-available`, {
            params: {
                apartmentBuildingId: student?.apartmentBuildingId,
                movingPeople: 1
            }
        })
            .then(response => {
                setAvailableRooms(response.data);
            })
            .catch(error => {
                console.error('Error fetching available rooms:', error);
            }).finally(() => {
            setLoading(false);
        });
    }, [student?.apartmentBuildingId]);

    const handleRoomSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTouched(true);
        const selectedValue = e.target.value;

        if (selectedValue) {
            const selectedRoom = JSON.parse(selectedValue);

            setStudent((prev: any) => ({
                ...prev,
                room: selectedRoom.room,
                roomId: selectedRoom.roomId
            }));

        } else {
            setStudent((prev: any) => ({
                ...prev,
                room: null,
                roomId: null
            }));
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            {
                student ? (
                    <div className="container">
                        <div className="form-container" style={{display: 'flex'}}>
                            <form>
                                <h1>Профил</h1>

                                <div className="form-group">
                                    <label>Име</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName"
                                        value={student.firstName}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Фамилия</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName"
                                        value={student.lastName}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Имейл</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={student.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Факултетен номер</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="facultyNumber"
                                        value={student.facultyNumber}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Град</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="city"
                                        value={student.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Факултет</label>
                                    <select
                                        className="form-control"
                                        name="faculty"
                                        value={student.faculty}
                                        onChange={handleFacultyChange}
                                        disabled={loading || faculties.length === 0}
                                        required
                                    >
                                        <option value="">Избери факултет</option>
                                        {faculties.map(faculty => (
                                            <option key={faculty.name} value={faculty.name}>
                                                {faculty.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Специалност</label>
                                    <select
                                        className="form-control"
                                        name="specialty"
                                        value={student.specialty}
                                        onChange={handleSpecialtyChange}
                                        required
                                        disabled={!student.faculty || loading || specialties.length === 0}
                                    >
                                        <option value="">Избери специалност</option>
                                        {specialties.map(specialty => (
                                            <option key={specialty.name} value={specialty.name}>
                                                {specialty.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Семестър</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="semester"
                                        value={student.semester}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Телефонен номер</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phoneNumber"
                                        value={student.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Среден успех</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="gpa"
                                        value={student.gpa}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Блок</label>
                                    <select
                                        className="form-control"
                                        name="apartmentBuilding"
                                        value={student.apartmentBuildingId ? JSON.stringify(
                                            {
                                                apartmentBuildingId: student.apartmentBuildingId,
                                                number: student.apartmentBuildingNumber,
                                                entrance: student.apartmentBuildingEntrance
                                            }
                                        ) : ''}
                                        onChange={handleBuildingChange}
                                        disabled={loading || apartmentBuildings.length === 0}
                                    >
                                        <option value="">Избери блок</option>
                                        {apartmentBuildings.map(apartmentBuilding => (
                                            <option key={`${apartmentBuilding.number}-${apartmentBuilding.entrance}`}
                                                    value={JSON.stringify({
                                                        apartmentBuildingId: apartmentBuilding.apartmentBuildingId,
                                                        number: apartmentBuilding.number,
                                                        entrance: apartmentBuilding.entrance
                                                    })}>
                                                Блок {apartmentBuilding.number}{apartmentBuilding.entrance}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Стая</label>
                                    <select
                                        className="form-control"
                                        name="room"
                                        value={student.room ? JSON.stringify(
                                            {
                                                roomId: student.roomId,
                                                room: student.room,
                                            }
                                        ) : ''}
                                        onChange={handleRoomSelect}
                                        disabled={!student.apartmentBuildingId || loading || availableRooms.length === 0}
                                    >
                                        <option value="">Избери стая</option>
                                        {availableRooms.map(room => (
                                            <option key={room.roomId}
                                                    value={JSON.stringify({
                                                        roomId: room.roomId,
                                                        room: room.number,
                                                    })}>
                                                {room.number ? `Стая ${room.number}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <br/>
                                <button disabled={loading || !touched} type="button" className="btn btn-primary"
                                        style={{marginRight: "16px", marginBottom:"16px"}} onClick={handleSave}>Запази
                                </button>
                                <button disabled={loading} type="button" className="btn btn-danger"
                                        style={{marginRight: "16px", marginBottom:"16px"}} onClick={handleDeleteConfirmation}>Изтрий
                                </button>
                                <button type="button" className="btn btn-secondary"
                                        style={{marginRight: "16px", marginBottom:"16px"}} onClick={handleCancel}>Назад
                                </button>
                            </form>

                            {bills.length > 0 ? (
                                <div className="bills-container" style={{marginLeft:"250px"}}>
                                    <h1>Сметки на студента</h1>
                                    <table className="table table-hover table-bordered" style={{marginBottom:"16px"}}>
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
                            ) : (
                                <h1>Няма намерени сметки.</h1>
                            )}
                        </div>
                    </div>
                ) : (
                    <Spinner delay={2000} />
                )}
        </div>
    );
};

export default ManageStudentProfile;