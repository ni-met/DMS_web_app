import styles from "./dashboard.module.css";
import React, {useState} from "react";
import axios from "../../axiosConfig";
import {useNavigate} from "react-router-dom";

interface PasswordChangerProps {
    newPassword: string,
    oldPassword: string,
    repeatNewPassword: string,
    setOldPassword: React.Dispatch<React.SetStateAction<string>>,
    setNewPassword: React.Dispatch<React.SetStateAction<string>>,
    setRepeatNewPassword: React.Dispatch<React.SetStateAction<string>>
}

const PasswordChanger = ({
                             newPassword,
                             oldPassword,
                             repeatNewPassword,
                             setNewPassword,
                             setOldPassword,
                             setRepeatNewPassword
                         }: PasswordChangerProps) => {
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const navigate = useNavigate();

    const decodePassword = (authHeader: any) => {
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return
        }
        const base64Credentials = authHeader.split(' ')[1];
        const parsedCredentials = atob(base64Credentials);
        return parsedCredentials.split(':')[1];
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);

        const authHeader = axios.defaults.headers.common['Authorization'];
        const existingPassword  = decodePassword(authHeader);

        if (!existingPassword || oldPassword !== existingPassword) {
            setPasswordError('Въведената стара парола е неправилна.');
            return;
        }

        if (newPassword !== repeatNewPassword) {
            setPasswordError('Въведената нова парола не съвпада.');
            return;
        }

        if (newPassword === oldPassword) {
            setPasswordError('Новата парола не може да бъде същата като старата.');
            return;
        }

        try {
            const coded = `${btoa(`${oldPassword}:${newPassword}`)}`
            const response = await axios.post('/users/pass', null,
                {
                    params: {
                        credentials: coded
                    }
                });

            if (response.status === 200) {
                alert('Паролата беше променена успешно!');
                setShowPasswordChange(false);
                setOldPassword('');
                setNewPassword('');
                setRepeatNewPassword('');

                delete axios.defaults.headers.common['Authorization'];
                navigate('/login', {replace: true});

                window.history.pushState(null, '', window.location.href);
                window.onpopstate = function () {
                    window.history.go(1);
                }
            }
        } catch (error) {
            console.error('Error occurred while changing password:', error);
            setPasswordError('Възникна грешка при смяната на паролата.');
            axios.defaults.headers.common['Authorization'] = '';
        }
    };

    return (
        <div>
            <button
                className="btn btn-primary mt-3"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
            >
                Промени парола
            </button>

            {
                showPasswordChange && (
                    <div className="row mt-4">
                        <div className="col-md-6">
                            <form onSubmit={handlePasswordChange} style={{maxWidth:'320px'}}>
                                <div className="form-group">
                                    <label>Стара парола</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Нова парола</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Повтори новата парола</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={repeatNewPassword}
                                        onChange={(e) => setRepeatNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {passwordError && <p className="text-danger">{passwordError}</p>}
                                <button type="submit"
                                        className={`btn btn-info mt-3 ${styles.btnChange}`}>Промени парола
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default PasswordChanger;