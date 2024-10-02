import React, {useState} from 'react';
import axios, {setAuthHeader} from '../../axiosConfig';
import {useNavigate} from 'react-router-dom';

const Login = ({setRole}: { setRole: Function }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setAuthHeader(email, password);
            const response = await axios.post('/auth/login', null);

            if (response.status === 200) {
                const role = response.data;
                setRole(role);
                if (role === 'ADMIN') {
                    navigate('/admins');
                } else if (role === 'STUDENT') {
                    navigate('/students');
                } else {
                    alert('Грешно потребителско име или парола.');
                    console.error('Error: Invalid user.');
                }
            }
        } catch (error) {
            alert('Грешно потребителско име или парола.');
            console.error('Authentication failed', error);
            axios.defaults.headers.common['Authorization'] = '';
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="card text-center" style={{width: "18rem"}}>
                <div className="card-body" style={{display: "center"}}>
                    <h2 className="mb-4">Влез в профил</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <input
                                id="emailField"
                                type="email"
                                className="form-control mb-2"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Имейл"
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                id="passwordField"
                                type="password"
                                className="form-control mb-2"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Парола"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block w-100">Влез</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;