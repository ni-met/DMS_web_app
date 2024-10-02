import React, {useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import {Student} from '../../types/types'
import StudentNavigationBar from "./StudentNavigationBar";
import styles from "../shared/dashboard.module.css";
import StudentDetails from "./StudentDetails";
import PasswordChanger from "../shared/PasswordChanger";
import Spinner from "../shared/Spinner";

const StudentProfile = () => {
    const [student, setStudent] = useState<Student | null>(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');

    useEffect(() => {
        axios.get(`/students/profile`)
            .then(response => {
                setStudent(response.data);
            })
            .catch(error => {
                console.error('Error fetching student profile:', error);
            });
    }, []);

    return (
        <div className="d-flex">
            <StudentNavigationBar/>
            {
                student ? (
                    <div className="container">
                        <h1>Моят профил</h1>
                        <div className={`card`}>
                            <div className={`${styles.dashboardCardBody}`}>
                                <StudentDetails/>
                            </div>
                        </div>

                        <PasswordChanger
                            newPassword={newPassword}
                            oldPassword={oldPassword}
                            repeatNewPassword={repeatNewPassword}
                            setNewPassword={setNewPassword}
                            setOldPassword={setOldPassword}
                            setRepeatNewPassword={setRepeatNewPassword}
                        />

                    </div>
                ) : (
                    <div className="container">
                        <Spinner delay={2000}/>
                    </div>
                )}
        </div>
    );
};

export default StudentProfile;
