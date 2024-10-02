import React, {useEffect, useState} from 'react';
import axios from "../../axiosConfig";
import {Link, useNavigate} from "react-router-dom";

const AdminNavigationBar = () => {
    const navigate = useNavigate();
    const [manageOpen, setManageOpen] = useState(false);
    const isActive = (path: any) => location.pathname === path ? 'active' : '';

    useEffect(() => {
        const manageRoutes = ['/manage-students', '/manage-rooms', '/manage-applications',
            '/manage-complaints', '/manage-bills', '/manage-records'];

        if (manageRoutes.includes(location.pathname)) {
            setManageOpen(true);
        } else {
            setManageOpen(false);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login', {replace: true});

        window.history.pushState(null, '', window.location.href);
        window.onpopstate = function () {
            window.history.go(1);
        }
    };

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 position-fixed bg-dark"
             style={{width: '250px', height: '100vh', overflowY: 'auto'}}>

            <h2 className="text-center text-light">Меню</h2>

            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="/admins"
                          className={`nav-link link-light nav-link link-light d-flex align-items-center ${isActive('/admins')}`}>
                        <span className="material-symbols-outlined" style={{marginRight: '8px'}}>home</span>
                        Начало
                    </Link>
                </li>
                <li>
                    <button
                        className="btn btn-toggle align-items-center rounded collapsed text-light d-flex align-items-center"
                        onClick={() => setManageOpen(!manageOpen)}>
                        Управлявай
                        <span className="material-symbols-outlined" style={{marginRight: '8px'}}>arrow_drop_down</span>
                    </button>
                    <div className={manageOpen ? 'collapse show' : 'collapse'}>
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><Link to="/manage-students"
                                      className={`nav-link link-light d-flex align-items-center ${isActive('/manage-students')}`}>
                                <span className="material-symbols-outlined" style={{marginRight: '8px'}}>groups</span>
                                Студенти
                            </Link>
                            </li>
                            <li><Link to="/manage-rooms"
                                      className={`nav-link link-light d-flex align-items-center ${isActive('/manage-rooms')}`}>
                                <span className="material-symbols-outlined"
                                      style={{marginRight: '8px'}}>apartment</span>
                                Стаи
                            </Link>
                            </li>
                            <li>
                                <Link to="/manage-applications"
                                      className={`nav-link link-light d-flex align-items-center ${isActive('/manage-applications')}`}>
                                    <span className="material-symbols-outlined"
                                          style={{marginRight: '8px'}}>description</span>
                                    Заявления
                                </Link>
                            </li>
                            <li>
                                <Link to="/manage-complaints"
                                      className={`nav-link link-light d-flex align-items-center ${isActive('/manage-complaints')}`}>
                                    <span className="material-symbols-outlined"
                                          style={{marginRight: '8px'}}>sentiment_dissatisfied</span>
                                    Оплаквания
                                </Link>
                            </li>
                            <li>
                                <Link to="/manage-bills"
                                      className={`nav-link link-light d-flex align-items-center ${isActive('/manage-bills')}`}>
                                    <span className="material-symbols-outlined"
                                          style={{marginRight: '8px'}}>payments</span>
                                    Сметки
                                </Link>
                            </li>
                            <li>
                                <Link to="/manage-records"
                                      className={`nav-link link-light d-flex align-items-center ${isActive('/manage-records')}`}>
                                    <span className="material-symbols-outlined"
                                          style={{marginRight: '8px'}}>contract</span>
                                    Класирания
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>

                <li>
                    <Link to="/rank" className={`nav-link link-light d-flex align-items-center ${isActive('/rank')}`}>
                        <span className="material-symbols-outlined" style={{marginRight: '8px'}}>kid_star</span>
                        Класирай студенти
                    </Link>
                </li>
                <li>
                    <Link to="/profile"
                          className={`nav-link link-light d-flex align-items-center ${isActive('/profile')}`}>
                        <span className="material-symbols-outlined" style={{marginRight: '8px'}}>account_circle</span>
                        Моят профил
                    </Link>
                </li>
            </ul>

            <div className="dropdown">
                <button className="btn btn-outline-secondary w-100" onClick={handleLogout}>
                    Излез
                </button>
            </div>
        </div>
    );
};

export default AdminNavigationBar;
