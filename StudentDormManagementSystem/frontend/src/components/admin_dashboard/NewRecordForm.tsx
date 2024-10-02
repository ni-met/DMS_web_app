import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "../../axiosConfig";
import AdminNavigationBar from "./AdminNavigationBar";
import useFormValidation from "../hooks/useFormValidation";
import ErrorFeedback from "../shared/ErrorFeedback";

const NewRecordForm = () => {
    const initialFormData = {
        period: '',
        isActive: false
    };

    const [recordExists, setRecordExists] = useState<boolean | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const fieldValidators: Record<string, (v?: any) => string> = {
        period: (value: string) => {
            if (!value?.trim() || value?.length < 3) return 'Трябва да въведете период';

            if (value && !(/^[А-Яа-я0-9\-_\/]+$/.test(value))) return 'Периодът не трябва да съдържа букви на латиница и специални символи';

            if (value?.length > 255) return 'Периодът не може да надвишава 255 символа.'
            return '';
        }
    }

    const {formData, setFormData, errors, touched, handleChange, handleBlur} = useFormValidation(
        initialFormData, fieldValidators
    )

    useEffect(() => {
        if (formData.period.trim() === '') {
            setRecordExists(null);
            return;
        }

        setLoading(true);

        axios.get(`/records/period`, {
            params: {period: formData.period}
        })
            .then(response => {
                setRecordExists(true);
            })
            .catch(error => {
                console.error('Error fetching record:', error);
                setRecordExists(false);
            }).finally(() => {
            setLoading(false);
        })
    }, [formData.period]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.period.length > 2 && recordExists === false) {
            setLoading(true);

            axios.post('/records/create', formData)
                .then(response => {
                    alert('Класирането е създадено успешно!');
                    setFormData(initialFormData);
                })
                .catch(error => {
                    console.error('Error occurred while creating record', error);
                    alert('Възникна грешка при създаването на ново класиране.');
                }).finally(() => {
                setLoading(false);
            })
        } else alert('Периодът е невалиден или вече съществува.');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            <div className="container">
                <h1>Ново класиране</h1>
                <form onSubmit={handleSubmit} style={{maxWidth: '600px'}}>
                    <div className="form-group">
                        <label>Период</label>
                        <input
                            type="text"
                            className="form-control"
                            name="period"
                            value={formData.period}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <ErrorFeedback showMessage={touched.period && errors.period} feedback={errors.period}/>
                    </div>
                    <button disabled={loading} type="submit" className="btn btn-primary" style={{marginTop: "16px", marginBottom: "16px", marginRight:"16px"}}>
                        Създай класиране
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel} style={{marginTop: "16px", marginBottom: "16px"}}>Назад
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewRecordForm;