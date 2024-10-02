import React, {useEffect, useState} from 'react';
import axios from "../../axiosConfig";
import {Link, useNavigate} from "react-router-dom";

const StudentNavigationBar = () => {
    const navigate = useNavigate();
    const [manageOpen, setManageOpen] = useState(false);

    const isActive = (path: any) => location.pathname === path ? 'active' : '';

    useEffect(() => {
        const manageRoutes = ['/complaints', '/complaints/new'];

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
                    <Link to="/students"
                          className={`nav-link link-light d-flex align-items-center ${isActive('/students')}`}>
                        <span className="material-symbols-outlined" style={{marginRight: '8px'}}>home</span>
                        Начало
                    </Link>
                </li>
                <li>
                    <Link to="/bills"
                          className={`nav-link link-light d-flex align-items-center ${isActive('/bills')}`}>
                        <span className="material-symbols-outlined" style={{marginRight: '8px'}}>payments</span>
                        Сметки
                    </Link>
                </li>
                <li>
                    <button
                        className="btn btn-toggle align-items-center rounded collapsed text-light d-flex align-items-center"
                        onClick={() => setManageOpen(!manageOpen)}>
                        <span className="material-symbols-outlined"
                              style={{marginRight: '8px'}}>sentiment_dissatisfied</span>
                        Оплаквания
                        <span className="material-symbols-outlined" style={{marginRight: '8px'}}>arrow_drop_down</span>
                    </button>

                    <div className={manageOpen ? 'collapse show' : 'collapse'}>
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li>
                                <Link to="/complaints"
                                      className={`nav-link link-light d-flex align-items-center ${isActive('/complaints')}`}>
                                    Виж всички
                                </Link>
                            </li>
                            <li><Link to="/complaints/new"
                                      className={`nav-link link-light d-flex align-items-center ${isActive('/complaints/new')}`}>
                                Създай
                            </Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li><Link to="/apply"
                          className={`nav-link link-light d-flex align-items-center ${isActive('/apply')}`}>
                    <span className="material-symbols-outlined" style={{marginRight: '8px'}}>post_add</span>
                    Кандидатствай
                </Link>
                </li>
                <li><Link to="/my-profile"
                          className={`nav-link link-light d-flex align-items-center ${isActive('/my-profile')}`}>
                                <span className="material-symbols-outlined"
                                      style={{marginRight: '8px'}}>account_circle</span>
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

export default StudentNavigationBar;