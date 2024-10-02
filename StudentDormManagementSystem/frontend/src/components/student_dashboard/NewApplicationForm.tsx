import React, {useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import {useNavigate} from 'react-router-dom';
import StudentNavigationBar from "./StudentNavigationBar";
import StudentDetails from "./StudentDetails";
import {ApartmentBuilding, Application} from "../../types/types";
import styles from "../shared/dashboard.module.css";
import RoomChooser from "./RoomChooser";

const NewApplicationForm = ({requestType}: any) => {
    const [movingPeople, setMovingPeople] = useState<number>(1);
    const [apartmentBuildings, setApartmentBuildings] = useState<ApartmentBuilding[]>([]);
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
    const [facultyNumberExists, setFacultyNumberExists] = useState<boolean | null>(null);

    const initialRoomToChooseState = {desiredRoom1: false, desiredRoom2: false, desiredRoom3: false};
    const [roomToChoose, setRoomToChoose] = useState(initialRoomToChooseState);

    type RoomKeys = keyof typeof initialRoomToChooseState;

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [applicationData, setFormData] = useState<Partial<Application>>({
        type: requestType,
        studentFacultyNumber: '',
        friendFacultyNumber: '',
        desiredRoom1: {
            roomId: undefined,
            number: undefined,
            apartmentBuildingId: undefined,
            apartmentBuildingNumber: undefined,
            apartmentBuildingEntrance: undefined
        },
        desiredRoom2: {
            roomId: undefined,
            number: undefined,
            apartmentBuildingId: undefined,
            apartmentBuildingNumber: undefined,
            apartmentBuildingEntrance: undefined
        },
        desiredRoom3: {
            roomId: undefined,
            number: undefined,
            apartmentBuildingId: undefined,
            apartmentBuildingNumber: undefined,
            apartmentBuildingEntrance: undefined
        }
    });

    useEffect(() => {
        setLoading(true)

        axios.get(`apartment-buildings/all`, {params: {movingPeople}})
            .then(response => {
                setApartmentBuildings(response.data);
                (response.data.availableRoomsCount);
            })
            .catch(error => {
                console.error('Error fetching available apartment buildings:', error);
            }).finally(() => {
            setLoading(false);
        });
    }, [movingPeople]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMovingPeople(e.target.checked ? 2 : 1);

        if (!e.target.checked) {
            setFormData(prevData => ({
                ...prevData,
                friendFacultyNumber: ''
            }));
        }
    };

    const handleBuildingDisplay = (room: RoomKeys) => {
        setRoomToChoose({
            ...initialRoomToChooseState,
            [room]: true
        })
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (facultyNumberExists === false) {
            alert('Въведеният факултетен номер на приятел не съществува');
            return;
        }
        setLoading(true);

        axios.post(`/applications/create/${applicationData.type}`, applicationData)
            .then(response => {
                alert('Успешно подаване на заявление!');
                navigate(`/apply`);
            })
            .catch(error => {
                console.error('Error creating application:', error);
                alert('Неуспешно подаване на заявление');

            }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        if (applicationData.friendFacultyNumber?.trim() === '') {
            return;
        }

        if (applicationData.friendFacultyNumber?.length === 9) {
            setLoading(true);

            axios.get(`/students/${applicationData.friendFacultyNumber}`)
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
    }, [applicationData.friendFacultyNumber]);

    const handleBlockSelect = (id: number) => {
        setSelectedBuildingId(id)
    }

    const applyWithFriend = movingPeople == 2;
    const showBuildingSelect = apartmentBuildings.length > 0 &&
        (roomToChoose.desiredRoom1 || roomToChoose.desiredRoom2 || roomToChoose.desiredRoom3);


    const resetSelections = () => {
        setSelectedBuildingId(null)
        setRoomToChoose(initialRoomToChooseState)
    }

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="">
            <StudentNavigationBar/>

            <div className="container overflow-auto">
                <h1>Ново заявление</h1>
                <div className={`card`}>
                    <div className={`${styles.dashboardCardBody}`}>
                        <StudentDetails
                            setFormData={setFormData}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{marginTop: "16px"}}>
                    {requestType === 'new-room' && (
                        <div className="form-check">
                            <label>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={applyWithFriend}
                                    onChange={handleCheckboxChange}
                                />
                                Кандидатствай с приятел
                            </label>
                        </div>
                    )}

                    {applyWithFriend && (
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Факултетен номер на приятел"
                                name="friendFacultyNumber"
                                value={applicationData.friendFacultyNumber}
                                onChange={handleChange}
                            />
                            {applicationData.friendFacultyNumber?.length != 9 && (
                                <div className="error">Факултетният номер трябва да е с дължина 9 символа.</div>
                            )}
                        </div>
                    )}

                    <h3>Избрани стаи</h3>

                    <div className="form-group mb-2">
                        <div className="form-group mb-2 d-flex align-items-center row">
                            <div className="col-auto">
                                <label>Стая #1</label>
                            </div>
                            <div className="col-auto">
                                <input
                                    type="text"
                                    className="form-control" style={{maxWidth: "200px"}}
                                    name="desiredRoom1"
                                    value={`${applicationData.desiredRoom1?.number || ''},` +
                                        ` Блок ${applicationData.desiredRoom1?.apartmentBuildingNumber || ''}` +
                                        `${applicationData.desiredRoom1?.apartmentBuildingEntrance || ''}`}
                                    disabled
                                />
                            </div>

                            <div className="col-auto">
                                <button name="desiredRoom1"
                                        disabled={loading} type="button"
                                        className={`btn btn-primary ${styles.btnShowBuildings}`}
                                        onClick={() => handleBuildingDisplay('desiredRoom1')}>Избери
                                </button>
                            </div>
                            {applicationData.desiredRoom1?.number ? (
                                <div className="col-auto">
                                    <button disabled={loading || !applicationData.desiredRoom1?.number} type="button"
                                            className={`btn btn-info ${styles.btnShowBuildings}`}
                                            onClick={() => handleBuildingDisplay('desiredRoom1')}>Редактирай
                                    </button>
                                </div>
                            ) : ''}
                        </div>
                    </div>


                    <div className="form-group mb-2 d-flex align-items-center row">
                        <div className="col-auto">
                            <label>Стая #2</label>
                        </div>
                        <div className="col-auto">
                            <input
                                type="text"
                                className="form-control" style={{maxWidth: "200px"}}
                                name="desiredRoom2"
                                value={`${applicationData.desiredRoom2?.number || ''},` +
                                    ` Блок ${applicationData.desiredRoom2?.apartmentBuildingNumber || ''}` +
                                    `${applicationData.desiredRoom2?.apartmentBuildingEntrance || ''}`}
                                disabled
                            />
                        </div>

                        <div className="col-auto">
                            <button name="desiredRoom2"
                                    disabled={loading} type="button"
                                    className={`btn btn-primary ${styles.btnShowBuildings}`}
                                    onClick={() => handleBuildingDisplay('desiredRoom2')}>Избери
                            </button>
                        </div>

                        {applicationData.desiredRoom2?.number ? (
                            <div className="col-auto">
                                <button disabled={loading || !applicationData.desiredRoom2?.number} type="button"
                                        className={`btn btn-info ${styles.btnShowBuildings}`}
                                        onClick={() => handleBuildingDisplay('desiredRoom2')}>Редактирай
                                </button>
                            </div>
                        ) : ''}
                    </div>

                    <div className="form-group mb-4 d-flex align-items-center row">
                        <div className="col-auto">
                            <label>Стая #3</label>
                        </div>
                        <div className="col-auto">
                            <input
                                type="text"
                                className="form-control" style={{maxWidth: "200px"}}
                                name="desiredRoom3"
                                value={`${applicationData.desiredRoom3?.number || ''},` +
                                    ` Блок ${applicationData.desiredRoom3?.apartmentBuildingNumber || ''}` +
                                    `${applicationData.desiredRoom3?.apartmentBuildingEntrance || ''}`}
                                disabled
                            />
                        </div>

                        <div className="col-auto">
                            <button name="desiredRoom3"
                                    disabled={loading} type="button"
                                    className={`btn btn-primary ${styles.btnShowBuildings}`}
                                    onClick={() => handleBuildingDisplay('desiredRoom3')}>Избери
                            </button>
                        </div>
                        {applicationData.desiredRoom3?.number ? (
                            <div className="col-auto">
                                <button disabled={loading || !applicationData.desiredRoom3?.number} type="button"
                                        className={`btn btn-info ${styles.btnShowBuildings}`}
                                        onClick={() => handleBuildingDisplay('desiredRoom3')}>Редактирай
                                </button>
                            </div>
                        ) : ''}
                    </div>

                    <div>
                        {showBuildingSelect ? (
                            <div className="apartment-buildings-container ">
                                <div className="row">
                                    {apartmentBuildings.map((apartmentBuilding: ApartmentBuilding) => (

                                        apartmentBuilding.apartmentBuildingId !== 0 ?
                                            (<div className="col-sm-6 col-md-3"
                                                  key={apartmentBuilding.apartmentBuildingId}>
                                                <div
                                                    onClick={() => handleBlockSelect(apartmentBuilding.apartmentBuildingId)}
                                                    className={`mb-4 ${styles.dashboardCard}`}>
                                                    <div className={`${styles.dashboardCardBody}`}
                                                         style={{minHeight: "9rem"}}
                                                         onClick={() => handleBlockSelect(apartmentBuilding.apartmentBuildingId)}>
                                                        <div>
                                                            <h5 className="card-title">
                                                                Блок {apartmentBuilding.number}{apartmentBuilding.entrance || ''}
                                                            </h5>
                                                            <p className="card-text">Свободни
                                                                стаи: {apartmentBuilding.availableRoomsCount || '-'}</p>
                                                        </div>
                                                        <span
                                                            className={`material-symbols-outlined icon ${styles.icon}`}>
                                                        apartment</span>
                                                    </div>
                                                </div>
                                            </div>) : null
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <br/>
                        )}
                    </div>


                    {selectedBuildingId &&
                        <RoomChooser
                            resetSelections={resetSelections}
                            roomToChoose={roomToChoose}
                            movingPeople={movingPeople}
                            setFormData={setFormData}
                            selectedBuildingId={selectedBuildingId}
                            setSelectedBuildingId={setSelectedBuildingId}
                        />}

                    <button disabled={loading} type="submit" className="btn btn-primary"
                            style={{marginRight: '16px', marginTop: '16px', marginBottom: '16px'}}>Подай заявлението
                    </button>
                    <button type="button" className="btn btn-secondary"
                            style={{marginRight: '16px', marginTop: '16px', marginBottom: '16px'}}
                            onClick={handleCancel}>Назад
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewApplicationForm;