import React, {useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import {Application, Record, Student} from '../../types/types'
import StudentNavigationBar from "./StudentNavigationBar";
import {Link, useNavigate} from "react-router-dom";
import styles from "../shared/dashboard.module.css";
import Spinner from "../shared/Spinner";

const ChooseApplication = () => {
    const [student, setStudent] = useState<Student | null>(null);
    const [facultyNumber, setFacultyNumber] = useState<string>('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [applicationData, setFormData] = useState<Application>({
        applicationId: 0,
        type: 'leave',
        appliedOn: '',
        status: '',
        studentFacultyNumber: facultyNumber,
        friendFacultyNumber: '',
        desiredRoom1: {},
        desiredRoom2: {},
        desiredRoom3: {},
        recordPeriod: '',
    });
    const [applicationNewRoomExists, setApplicationNewRoomExists] = useState<boolean | null>(null);
    const [applicationChangeRoomExists, setApplicationChangeRoomExists] = useState<boolean | null>(null);
    const [record, setRecord] = useState<Record | null>(null);

    useEffect(() => {
        setLoading(true);

        axios.get(`/records/latest`)
            .then(response => {
                setRecord(response.data);
            })
            .catch(error => {
                console.error('Error fetching record details:', error);
            }).finally(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        setLoading(true);

        axios.get(`/students/profile`)
            .then(response => {
                setStudent(response.data);
                setFacultyNumber(response.data.facultyNumber);
            })
            .catch(error => {
                console.error('Error fetching student profile:', error);
            }).finally(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            studentFacultyNumber: facultyNumber,
        }));
    }, [facultyNumber]);

    useEffect(() => {
        if (facultyNumber == '' || record == null) return;

        setLoading(true);
        axios.get(`/applications/exists/new-room`,
            {
                params: {
                    recordId: record.recordId,
                    facultyNumber
                }
            })
            .then(response => {
                setApplicationNewRoomExists(response.data);
            })
            .catch(error => {
                console.error('Error fetching application details:', error);
            }).finally(() => {
            setLoading(false);
        });
    }, [record, facultyNumber]);

    useEffect(() => {
        if (facultyNumber == '') return;

        setLoading(true);
        axios.get(`/applications/exists/change`,
            {
                params: {
                    facultyNumber
                }
            })
            .then(response => {
                setApplicationChangeRoomExists(response.data);
            })
            .catch(error => {
                console.error('Error fetching application details:', error);
            }).finally(() => {
            setLoading(false);
        });
    }, [facultyNumber]);

    const handleNewRoomClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (record?.isActive === false) {
            e.preventDefault()
            alert("В момента не може да се подават заявления.");
        }

        if (applicationNewRoomExists === true) {
            e.preventDefault();
            alert("Вече сте подали заявление.");
        }
    };

    const handleChangeRoomClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if(student?.room === null || student?.room === 0){
            e.preventDefault();
            alert("Все още нямате текуща стая, която да смените.");
        }

        if (applicationChangeRoomExists === true) {
            e.preventDefault();
            alert("Вече сте подали заявление, което в момента е за преглед.");
        }
    };

    if (student?.gpa && student.gpa < 4.50 || student?.city.trim().toLowerCase() === "софия") {
        return (<div className="d-flex">
                <StudentNavigationBar/>
                <div className="container mb-7">
                    <h2>Не можете да кандидатствате за общежитие.</h2>
                </div>
            </div>
        );
    }

    const handleLeave = () => {
        setLoading(true);

        axios.post(`/applications/create/${applicationData.type}`, applicationData)
            .then(response => {
                alert('Успешно напускане на стая!');
                navigate(`/apply`);
            })
            .catch(error => {
                console.error('Error creating application:', error);
                alert('Неуспешно напускане на стая.');
            }).finally(() => {
            setLoading(false);
        });
    };

    const handleLeaveConfirmation = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if (loading) return;

        if(student?.room === null || student?.room === 0){
            alert('Не сте настанени в стая, която да напуснете.');
            return;
        }
        const userConfirmed = window.confirm('Сигурни ли сте, че желаете да напуснете стаята си?');

        if (userConfirmed) {
            handleLeave();
        }
    };

    return (
        <div className="d-flex">
            <StudentNavigationBar/>
            <div className="container mb-7 mt-4">
                {student ? (
                    <div className="applications-container">
                        <div className="row">

                            <div className="col-md-4">
                                <Link to="/apply/new-room/" className={`mb-4 ${styles.dashboardCard}`}
                                      style={{textDecoration: "inherit", color: "inherit"}}
                                      onClick={handleNewRoomClick}>
                                    <div
                                        className={`${styles.dashboardCardBody} justify-content-center align-items-center`}
                                        style={{minHeight: '300px'}}>
                                        <h5 className="card-title">Настаняване в нова стая</h5>
                                        <span className={`material-symbols-outlined icon ${styles.icon}`}>add</span>
                                    </div>
                                </Link>
                            </div>

                            <div className="col-md-4">
                                <Link to="/apply/change-room" className={`mb-4 ${styles.dashboardCard}`}
                                      style={{textDecoration: "inherit", color: "inherit"}}
                                      onClick={handleChangeRoomClick}>
                                    <div
                                        className={`${styles.dashboardCardBody} justify-content-center align-items-center`}
                                        style={{minHeight: '300px'}}>
                                        <h5 className="card-title text-center">Смяна на стая</h5>
                                        <span
                                            className={`material-symbols-outlined icon ${styles.icon}`}>swap_horiz</span>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-md-4">
                                <Link to="/apply/leave-room" className={`mb-4 ${styles.dashboardCard}`}
                                      style={{textDecoration: "inherit", color: "inherit"}}
                                      onClick={handleLeaveConfirmation}>
                                    <div
                                        className={`${styles.dashboardCardBody} justify-content-center align-items-center`}
                                        style={{minHeight: '300px'}}>
                                        <h5 className="card-title text-center">Напускане на стая</h5>
                                        <span
                                            className={`material-symbols-outlined icon ${styles.icon}`}>logout</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Spinner delay={2000} />
                )}
            </div>
        </div>
    );
};

export default ChooseApplication;