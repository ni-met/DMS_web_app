import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "../../axiosConfig";
import StudentNavigationBar from "./StudentNavigationBar";

const NewComplaintForm = () => {
    const [facultyNumber, setFacultyNumber] = useState<string | null>(null);
    const initialFormData = {
        title: '',
        content: '',
        facultyNumber: facultyNumber,
    };
    const [formData, setFormData] = useState(initialFormData);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`/students/profile`)
            .then(response => {
                setFacultyNumber(response.data.facultyNumber);
            })
            .catch(error => {
                console.error('Error fetching student profile:', error);
            });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        axios.post('/complaints/create', formData)
            .then(response => {
                alert('Оплакването е създадено успешно!');
                setFormData(initialFormData);
            })
            .catch(error => {
                console.error('Error occurred while creating complaint', error);
                alert('Възникна грешка при създаването на ново оплакване.');
            }).finally(() => {
            setLoading(false);
        })
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="d-flex">
            <StudentNavigationBar/>
            <div className="container">
                <h1>Ново оплакване</h1>
                <form onSubmit={handleSubmit} style={{maxWidth: '800px'}}>
                    <div className="form-group">
                        <label>Заглавие</label>
                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Описание</label>
                        <textarea
                            className="form-control"
                            name="content"
                            rows={5}
                            value={formData.content}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>
                    <button disabled={loading} type="submit" className="btn btn-primary"
                            style={{marginRight: '16px', marginTop: '16px'}}>Подай оплакване
                    </button>
                    <button type="button" className="btn btn-secondary" style={{marginRight: '16px', marginTop: '16px'}}
                            onClick={handleCancel}>Назад
                    </button>
                </form>
            </div>
        </div>
    );

};

export default NewComplaintForm;