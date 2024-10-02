import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from "../../axiosConfig";
import AdminNavigationBar from "./AdminNavigationBar";
import useFormValidation from "../hooks/useFormValidation";
import ErrorFeedback from "../shared/ErrorFeedback";

const NewBillForm = () => {
    const initialFormData = {
        type: '',
        amount: 0,
        studentFacultyNumber: '',
        isPaid: false
    };

    const [isValidFacultyNumber, setIsValidFacultyNumber] = useState<boolean | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const fieldValidators: Record<string, (v?: any) => string> = {
        studentFacultyNumber: (value?: string) => {
            if (!value?.trim() || value?.length < 9) return 'Трябва да въведете факултетен номер';

            if (value && !(/^[0-9]*$/.test(value))) return 'Факултетният номер трябва да се състои само от числа';

            if (value?.length > 9) return 'Факултетният номер трябва да се състои от 9 символа';

            return '';
        },
        amount: (value: string) => {
            if (value.length < 1) return 'Трябва да въведете сума';
            if (value && !(/^\d+(\.\d{1,2})?$/.test(value))) return 'Сумата трябва да се състои само от числа';

            return '';
        }
    }

    const {formData, setFormData, errors, touched, handleChange, handleBlur} = useFormValidation(
        initialFormData, fieldValidators
    )

    useEffect(() => {
        if (formData.studentFacultyNumber.trim() === '') {
            return;
        }

        if (formData.studentFacultyNumber.length === 9) {
            setLoading(true);

            axios.get(`/students/${formData.studentFacultyNumber}`)
                .then(response => {
                    setIsValidFacultyNumber(true);
                })
                .catch(error => {
                    console.error('Error fetching student:', error);
                    setIsValidFacultyNumber(false);
                }).finally(() => {
                setLoading(false);
            })
        } else {
            return;
        }
    }, [formData.studentFacultyNumber]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.studentFacultyNumber.length === 9 && isValidFacultyNumber === true) {
            setLoading(true);

            axios.post('/bills/create', formData)
                .then(response => {
                    alert('Сметката е създадена успешно!');
                    setFormData(initialFormData);
                })
                .catch(error => {
                    console.error('Error occurred while creating bill', error);
                    alert('Възникна грешка при създаването на нова сметка.');
                }).finally(() => {
                setLoading(false);
            })
        } else alert('Въведен е невалиден факултетен номер');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="d-flex">
            <AdminNavigationBar/>
            <div className="container">
                <h1>Нова сметка</h1>
                <form onSubmit={handleSubmit} style={{maxWidth: '220px'}}>
                    <div className="form-group">
                        <label>Тип</label>
                        <select
                            className="form-control"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="НАЕМ">НАЕМ</option>
                            <option value="ВОДА">ВОДА</option>
                            <option value="ТОК">ТОК</option>
                            <option value="ПАРНО">ПАРНО</option>
                            <option value="НОЩУВКА">НОЩУВКА</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Сума</label>
                        <input
                            type="text"
                            className="form-control"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <ErrorFeedback showMessage={touched.amount && errors.amount} feedback={errors.amount}/>
                    </div>
                    <div className="form-group">
                        <label>Факултетен номер</label>
                        <input
                            type="text"
                            className="form-control"
                            name="studentFacultyNumber"
                            value={formData.studentFacultyNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <ErrorFeedback showMessage={touched.studentFacultyNumber && errors.studentFacultyNumber}
                                       feedback={errors.studentFacultyNumber}/>
                    </div>
                    {}
                    <button disabled={loading} type="submit" className="btn btn-primary" style={{marginTop: "16px", marginBottom:"16px", marginRight:"16px"}}>
                        Създай сметка
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel} style={{marginTop: "16px", marginBottom:"16px"}}>Назад
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewBillForm;