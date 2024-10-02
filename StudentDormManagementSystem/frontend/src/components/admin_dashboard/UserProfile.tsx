import React, {useEffect, useState} from "react";
import {User} from "../../types/types";
import axios from "../../axiosConfig";
import styles from "../shared/dashboard.module.css";
import AdminNavigationBar from "./AdminNavigationBar";
import PasswordChanger from "../shared/PasswordChanger";
import Spinner from "../shared/Spinner";

const UserProfile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');

    useEffect(() => {
        axios.get(`/users/profile`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }, []);

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            {
                user ? (
                    <div className="container">
                        <h1>Моят профил</h1>
                        <div className={`card`}>
                            <div className={`${styles.profileCardBody}`}>
                                <p>Име: {user.firstName} {user.lastName}</p>
                                <p>Имейл: {user.email}</p>
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
                    <Spinner delay={2000} />
                )}
        </div>
    );
};

export default UserProfile;