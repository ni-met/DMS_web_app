import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AdminNavigationBar from './AdminNavigationBar';
import {ApartmentBuilding, Faculty, Room, Specialty} from "../../types/types";
import axios from "../../axiosConfig";
import useFormValidation from "../hooks/useFormValidation";
import ErrorFeedback from "../shared/ErrorFeedback";

const NewStudentForm = () => {
    const initialFormData = {
        email: '',
        firstName: '',
        lastName: '',
        facultyNumber: '',
        phoneNumber: '',
        semester: 1,
        specialty: '',
        faculty: '',
        room: {roomId: null, number: null},
        city: '',
        gpa: 2,
        apartmentBuilding: {apartmentBuildingId: null, number: null, entrance: ''},
    }

    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [apartmentBuildings, setApartmentBuildings] = useState<ApartmentBuilding[]>([]);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [facultyNumberExists, setFacultyNumberExists] = useState<boolean | null>(null);
    const [emailExists, setEmailExists] = useState<boolean | null>(null);
    const [phoneNumberExists, setPhoneNumberExists] = useState<boolean | null>(null);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const fieldValidators: Record<string, (v?: any) => string> = {
        email: (value?: string) => {
            if (!value?.trim() || value?.length < 13) return 'Трябва да въведете имейл';

            if (!value?.endsWith("@tu-sofia.bg")) return 'Имейлът трябва да завършва на "@tu-sofia.bg"';

            if (value?.length > 255) return 'Името не може да надвишава 255 символа';

            return '';
        },
        firstName: (value?: string) => {
            if (!value?.trim() || value?.length < 2) return 'Трябва да въведете име';

            if (value && !(/^[А-Яа-яЁё\s]*$/.test(value))) return 'Името трябва да се състои само от букви на кирилица';

            if (value?.length > 45) return 'Името не може да надвишава 45 символа';

            return '';
        },
        lastName: (value?: string) => {
            if (!value?.trim() || value?.length < 2) return 'Трябва да въведете фамилия';

            if (value && !(/^[А-Яа-яЁё\s]*$/.test(value))) return 'Фамилията трябва да се състои само от букви на кирилица';

            if (value?.length > 45) return 'Фамилията не може да надвишава 45 символа.';

            return '';
        },
        facultyNumber: (value?: string) => {
            if (!value?.trim() || value?.length < 9) return 'Трябва да въведете факултетен номер';

            if (value && !(/^[0-9]*$/.test(value))) return 'Факултетният номер трябва да се състои само от числа';

            if (value?.length > 9) return 'Факултетният номер трябва да се състои от 9 символа';

            return '';
        },
        phoneNumber: (value?: string) => {
            if (!value?.trim() || value.length < 10) return 'Трябва да въведете телефонен номер';

            if (!value?.startsWith("08")) return 'Телефонният номер трябва да започва с "08"';
            if (value && !(/^\d*$/.test(value))) return 'Телефонният номер трябва да се състои само от числа';

            if (value?.length > 10) return 'Телефонният номер трябва да се състои от 10 цифри';

            return '';
        },
        semester: (value: number) => {
            if (value > 8 || value < 1) return 'Семестърът може да бъде между 1 и 8.';

            return '';
        },
        city: (value?: string) => {
            if (!value?.trim() || value?.length < 3) return 'Трябва да въведете град';

            if (value && !(/^[А-Яа-яЁё\s]*$/.test(value))) return 'Градът трябва да се състои само от букви на кирилица.';

            if (value?.length > 45) return 'Градът не може да надвишава 45 символа.'

            return '';
        },
        gpa: (value: number) => {
            if (value > 6 || value < 2) return 'Средният успех може да бъде от 2 до 6.';

            return '';
        },
    }

    const {formData, setFormData, errors, touched, handleChange, handleBlur} = useFormValidation(
        initialFormData, fieldValidators
    )

    useEffect(() => {
        if (formData.email.trim() === '' || formData.email.length < 13) {
            return;
        }

        setLoading(true);

        axios.get(`/users/${formData.email}`)
            .then(response => {
                setEmailExists(true);
            })
            .catch(error => {
                console.error('Error fetching student via email:', error);
                setEmailExists(false);
            }).finally(() => {
            setLoading(false);
        })
    }, [formData.email]);

    useEffect(() => {
        if (formData.facultyNumber.trim() === '') {
            return;
        }

        if (formData.facultyNumber.length === 9) {
            setLoading(true);

            axios.get(`/students/${formData.facultyNumber}`)
                .then(response => {
                    setFacultyNumberExists(true);
                })
                .catch(error => {
                    console.error('Error fetching student via faculty number:', error);
                    setFacultyNumberExists(false);
                }).finally(() => {
                setLoading(false);
            })
        } else {
            return;
        }
    }, [formData.facultyNumber]);

    useEffect(() => {
        if (formData.phoneNumber.trim() === '') {
            return;
        }

        if (formData.phoneNumber.length === 10) {
            setLoading(true);

            axios.get(`/students/by-phone/${formData.phoneNumber}`)
                .then(response => {
                    setPhoneNumberExists(true);
                })
                .catch(error => {
                    console.error('Error fetching student via phone number:', error);
                    setPhoneNumberExists(false);
                }).finally(() => {
                setLoading(false);
            })
        } else {
            return;
        }
    }, [formData.phoneNumber]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (emailExists === true) {
            alert('Въведеният имейл вече съществува');
            return;
        } else if (facultyNumberExists === true) {
            alert('Въведеният факултетен номер вече съществува');
            return;
        } else if (phoneNumberExists === true) {
            alert('Въведеният телефонен номер вече съществува');
            return;
        }

        setLoading(true);

        const studentData = {
            ...formData,
            room: formData.room.number,
            roomId: formData.room.roomId,
            apartmentBuildingId: formData.apartmentBuilding.apartmentBuildingId,
            apartmentBuildingNumber: formData.apartmentBuilding.number,
            apartmentBuildingEntrance: formData.apartmentBuilding.entrance
        }

        axios.post('/students/create', studentData)
            .then(response => {
                alert('Студентът е създаден успешно!');
                setFormData(initialFormData);
            })
            .catch(error => {
                console.error('Error occurred while creating student', error);
                alert('Възникна грешка при създаването на нов студент.');
            }).finally(() => {
            setLoading(false);
        })
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
        if (formData.faculty === null) return;
        setLoading(true);

        axios.get(`/specialties/faculty/${encodeURIComponent(formData.faculty)}`)
            .then(response => {
                setSpecialties(response.data);
            })
            .catch(error => {
                console.error('Error fetching specialties:', error);
            }).finally(() => {
            setLoading(false);
        });
    }, [formData.faculty]);

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

    useEffect(() => {
        if (formData.apartmentBuilding.apartmentBuildingId == null) return;
        setLoading(true);

        axios.get(`rooms/show-available`, {
            params: {
                apartmentBuildingId: formData.apartmentBuilding.apartmentBuildingId,
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
    }, [formData.apartmentBuilding.apartmentBuildingId]);

    const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({...formData, faculty: e.target.value, specialty: ''});
    };

    const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({...formData, specialty: e.target.value});
    };

    const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;

        if (selectedValue) {
            const selectedBuilding = JSON.parse(selectedValue);

            setFormData((prevFormData) => ({
                ...prevFormData,
                apartmentBuilding: selectedBuilding,
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                apartmentBuilding: initialFormData.apartmentBuilding,
            }));

        }
    };

    const handleRoomSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;

        if (selectedValue) {
            const selectedRoom = JSON.parse(selectedValue);

            setFormData((prevFormData) => ({
                ...prevFormData,
                room: selectedRoom,
            }));

        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                room: initialFormData.room,
            }));
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            <div className="container">
                <h1>Нов студент</h1>
                <form onSubmit={handleSubmit} style={{maxWidth:'420px'}}>
                    <div className="form-group">
                        <label>Имейл</label>
                        <input
                            type="text"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <ErrorFeedback showMessage={touched.email && errors.email} feedback={errors.email}/>
                    </div>
                    <div className="form-group">
                        <label>Име</label>
                        <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <ErrorFeedback showMessage={touched.firstName && errors.firstName} feedback={errors.firstName}/>
                    </div>
                    <div className="form-group">
                        <label>Фамилия</label>
                        <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <ErrorFeedback showMessage={touched.lastName && errors.lastName} feedback={errors.lastName}/>
                    </div>
                    <div className="form-group">
                        <label>Факултетен номер</label>
                        <input
                            type="text"
                            className="form-control"
                            name="facultyNumber"
                            value={formData.facultyNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <ErrorFeedback showMessage={touched.facultyNumber && errors.facultyNumber}
                                       feedback={errors.facultyNumber}/>
                    </div>
                    <div className="form-group">
                        <label>Телефонен номер</label>
                        <input
                            type="text"
                            className="form-control"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <ErrorFeedback showMessage={touched.phoneNumber && errors.phoneNumber}
                                       feedback={errors.phoneNumber}/>
                    </div>
                    <div className="form-group">
                        <label>Семестър</label>
                        <input
                            type="number"
                            className="form-control"
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <ErrorFeedback showMessage={touched.semester && errors.semester} feedback={errors.semester}/>
                    </div>
                    <div className="form-group">
                        <label>Факултет</label>
                        <select
                            className="form-control"
                            name="faculty"
                            value={formData.faculty}
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
                            value={formData.specialty}
                            onChange={handleSpecialtyChange}
                            required
                            disabled={!formData.faculty || loading || specialties.length === 0}
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
                        <label>Град</label>
                        <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <ErrorFeedback showMessage={touched.city && errors.city} feedback={errors.city}/>
                    </div>

                    <div className="form-group">
                        <label>Среден успех</label>
                        <input
                            type="number"
                            className="form-control"
                            name="gpa"
                            value={formData.gpa}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <ErrorFeedback showMessage={touched.gpa && errors.gpa} feedback={errors.gpa}/>
                    </div>
                    <div className="form-group">
                        <label>Блок</label>
                        <select
                            className="form-control"
                            name="apartmentBuilding"
                            value={formData.apartmentBuilding ? JSON.stringify(formData.apartmentBuilding) : ''}
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
                            value={formData.room ? JSON.stringify(formData.room) : ''}
                            onChange={handleRoomSelect}
                            disabled={loading || availableRooms.length === 0}
                        >
                            <option value="">Избери стая</option>
                            {availableRooms.map(room => (
                                <option key={room.roomId}
                                        value={JSON.stringify({
                                            roomId: room.roomId,
                                            number: room.number,
                                        })}>
                                    Стая {room.number}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button disabled={loading} type="submit" className="btn btn-primary"
                            style={{marginTop: "16px", marginBottom: "16px", marginRight:"16px"}}>Създай профил
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}
                            style={{marginTop: "16px", marginBottom: "16px"}}>Назад
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewStudentForm;