import React, {useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import AdminNavigationBar from "./AdminNavigationBar";
import {Link} from "react-router-dom";
import styles from '../shared/dashboard.module.css';
import "../../styles.css"

const AdminDashboard = () => {
    const [countOfStudentsWithARoom, setCountOfStudentsWithARoom] = useState(null);
    const [countOfAvailableRooms, setCountOfAvailableRooms] = useState(null);
    const [countOfApplicationsForMoving, setCountOfApplicationsForMoving] = useState(null);
    const [countOfUnpaidBills, setCountOfUnpaidBills] = useState(null);
    const [countOfUnsolvedComplaints, setCountOfUnsolvedComplaints] = useState(null);

    useEffect(() => {
        axios.get('/students/with-a-room')
            .then(response => {
                setCountOfStudentsWithARoom(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the student count!', error);
            });
    }, []);

    useEffect(() => {
        axios.get('/rooms/available')
            .then(response => {
                setCountOfAvailableRooms(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the count of available rooms!', error);
            });
    }, []);

    useEffect(() => {
        axios.get('/applications/waiting')
            .then(response => {
                setCountOfApplicationsForMoving(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the count of applications for change of room!', error);
            });
    }, []);

    useEffect(() => {
        axios.get('/bills/unpaid')
            .then(response => {
                setCountOfUnpaidBills(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the count of unpaid bills!', error);
            });
    }, []);

    useEffect(() => {
        axios.get('/complaints/waiting')
            .then(response => {
                setCountOfUnsolvedComplaints(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the count of unsolved complaints!', error);
            });
    }, []);

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            <div className="container mb-7" style={{marginTop:'16px'}}>
                <div className="row">

                    <div className="col-sm-6">
                        <div className={`mb-4 ${styles.dashboardCard}`}>
                            <div className={`${styles.dashboardCardBody}`}>
                                <div>
                                    <h5 className="card-title">Студенти</h5>
                                    <p className="card-text">
                                        Имат стая: {countOfStudentsWithARoom !== null ? countOfStudentsWithARoom : '-'}
                                    </p>
                                </div>
                                <span className={`material-symbols-outlined icon ${styles.icon}`}>person</span>
                            </div>

                            <div className="d-flex justify-content-around">
                                <Link to="/manage-students"
                                      className={`btn btn-info ${styles.btn}`}>Редактирай</Link>
                                <Link to="/manage-students/new"
                                      className={`btn btn-primary ${styles.btn}`}>Добави</Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className={`mb-4 ${styles.dashboardCard}`}>
                            <div className={`${styles.dashboardCardBody}`}>
                                <div>
                                    <h5 className="card-title">Стаи</h5>
                                    <p className="card-text">Свободни: {countOfAvailableRooms !== null ? countOfAvailableRooms : '-'}</p>
                                </div>
                                <span className={`material-symbols-outlined icon ${styles.icon}`}>hotel</span>
                            </div>

                            <div className="d-flex justify-content-around">
                                <Link to="/manage-rooms"
                                      className={`btn btn-info ${styles.btn}`}>Редактирай</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <div className={`mb-4 ${styles.dashboardCard}`}>
                            <div className={`${styles.dashboardCardBody}`}>
                                <div>
                                    <h5 className="card-title">Заявления</h5>
                                    <p className="card-text">Чакащи за преместване:
                                        {countOfApplicationsForMoving !== null ? countOfApplicationsForMoving : '-'}</p>
                                </div>
                                <span className={`material-symbols-outlined icon ${styles.icon}`}>description</span>
                            </div>

                            <div className="d-flex justify-content-around">
                                <Link to="/manage-applications"
                                      className={`btn btn-info ${styles.btn}`}>Редактирай</Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className={`mb-4 ${styles.dashboardCard}`}>
                            <div className={`${styles.dashboardCardBody}`}>
                                <div>
                                    <h5 className="card-title">Сметки</h5>
                                    <p className="card-text">Брой
                                        неплатени: {countOfUnpaidBills !== null ? countOfUnpaidBills : '-'}</p>
                                </div>
                                <span className={`material-symbols-outlined icon ${styles.icon}`}>payments</span>
                            </div>

                            <div className="d-flex justify-content-around">
                                <Link to="/manage-bills"
                                      className={`btn btn-info ${styles.btn}`}>Редактирай</Link>
                                <Link to="/manage-bills/new"
                                      className={`btn btn-primary ${styles.btn}`}>Добави</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <div className={`mb-4 ${styles.dashboardCard}`}>
                            <div className={`${styles.dashboardCardBody}`}>
                                <div>
                                    <h5 className="card-title">Класирания</h5>
                                </div>
                                <span className={`material-symbols-outlined icon ${styles.icon}`}>contract</span>
                            </div>

                            <div className="d-flex justify-content-around">
                                <Link to="/manage-records"
                                      className={`btn btn-info ${styles.btn}`}>Редактирай</Link>
                                <Link to="/manage-records/new"
                                      className={`btn btn-primary ${styles.btn}`}>Добави</Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className={`mb-4 ${styles.dashboardCard}`}>
                            <div className={`${styles.dashboardCardBody}`}>
                                <div>
                                    <h5 className="card-title">Оплаквания</h5>
                                    <p className="card-text">За
                                        преглед: {countOfUnsolvedComplaints !== null ? countOfUnsolvedComplaints : '-'}</p>
                                </div>
                                <span className={`material-symbols-outlined icon ${styles.icon}`}>
                                        sentiment_dissatisfied</span>
                            </div>

                            <div className="d-flex justify-content-around">
                                <Link to="/manage-complaints"
                                      className={`btn btn-info ${styles.btn}`}>Редактирай</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
