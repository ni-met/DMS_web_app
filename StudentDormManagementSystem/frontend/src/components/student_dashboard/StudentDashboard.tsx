import React, {useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import {Student} from '../../types/types'
import StudentNavigationBar from "./StudentNavigationBar";
import {Link} from "react-router-dom";
import styles from '../shared/dashboard.module.css';
import "../../styles.css"
import Spinner from "../shared/Spinner";

const StudentDashboard = () => {
    const [student, setStudent] = useState<Student | null>(null);
    const [facultyNumber, setFacultyNumber] = useState<string | null>(null);

    const [countOfUnpaidBills, setCountOfUnpaidBills] = useState(null);
    const [countOfWaitingComplaints, setCountOfWaitingComplaints] = useState(null);

    useEffect(() => {
        axios.get(`/students/profile`)
            .then(response => {
                setStudent(response.data);
                setFacultyNumber(response.data.facultyNumber);
            })
            .catch(error => {
                console.error('Error fetching student profile:', error);
            });
    }, []);

    useEffect(() => {
        if (facultyNumber == null) return;

        axios.get(`/bills/unpaid/${facultyNumber}`)
            .then(response => {
                setCountOfUnpaidBills(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the count of unpaid bills!', error);
            });
    }, [facultyNumber]);

    useEffect(() => {
        axios.get(`/complaints/waiting/${facultyNumber}`)
            .then(response => {
                setCountOfWaitingComplaints(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the count of complaints!', error);
            });
    }, [facultyNumber]);

    return (
        <div className="d-flex">
            <StudentNavigationBar/>
            <div className="container mb-7" style={{marginTop: '16px', marginBottom: '5px'}}>

                {student ? (
                    <div className="cards-container">
                        <h2>Добре дошли, {student.firstName} {student.lastName}!</h2>

                        <div className="row">

                            <div className="col-sm-6">
                                <div className={`mb-4 ${styles.dashboardCard}`}>
                                    <div className={`${styles.dashboardCardBody}`}>
                                        <div>
                                            <h5 className="card-title">Сметки</h5>
                                            <p className="card-text">
                                                Неплатени: {countOfUnpaidBills !== null ? countOfUnpaidBills : '-'}</p>
                                        </div>
                                        <span
                                            className={`material-symbols-outlined icon ${styles.icon}`}>payments</span>
                                    </div>
                                    <Link to="/bills" className={`btn btn-primary ${styles.btn}`}>Виж всички</Link>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className={`mb-4 ${styles.dashboardCard}`}>
                                    <div className={`${styles.dashboardCardBody}`}>
                                        <div>
                                            <h5 className="card-title">Оплаквания</h5>
                                            <p className="card-text">За
                                                преглед: {countOfWaitingComplaints !== null ? countOfWaitingComplaints : '-'}</p>
                                        </div>
                                        <span className={`material-symbols-outlined icon ${styles.icon}`}>
                                            sentiment_dissatisfied</span>
                                    </div>
                                    <Link to="/complaints" className={`btn btn-primary ${styles.btn}`}>Виж всички</Link>
                                </div>
                            </div>
                        </div>

                        <div className="row">

                        </div>
                    </div>
                ) : (
                    <Spinner delay={2000} />
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;