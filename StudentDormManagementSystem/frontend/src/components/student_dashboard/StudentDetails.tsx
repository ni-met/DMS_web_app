import React, {useEffect, useState} from 'react';
import axios from '../../axiosConfig';
import {Student} from "../../types/types";
import Spinner from "../shared/Spinner";

const StudentDetails = ({setFormData}: any) => {
    const [student, setStudent] = useState<Student>();

    useEffect(() => {
        axios.get(`/students/profile`)
            .then(response => {
                setStudent(response.data);
                setFormData((prev: any) => ({
                    ...prev,
                    studentFacultyNumber: response.data.facultyNumber
                }))
            })
            .catch(error => {
                console.error('Error fetching student profile:', error);
            });
    }, []);

    return (
        <div>
            {student ? (
                <div className="row">
                    <div className="col-md-2">
                        <p>Име: {student?.firstName} {student?.lastName}</p>
                        <p>Имейл: {student?.email}</p>
                    </div>
                    <div className="col-md-2">
                        <p>Факултетен номер: {student?.facultyNumber}</p>
                        <p>Град: {student?.city}</p>
                    </div>
                    <div className="col-md-2">
                        <p>Факултет: {student?.faculty}</p>
                    </div>
                    <div className="col-md-2">
                        <p>Специалност: {student?.specialty}</p>
                    </div>
                    <div className="col-md-2">
                        <p>Семестър: {student?.semester}</p>
                        <p>Телефонен номер: {student?.phoneNumber}</p>
                    </div>
                    <div className="col-md-2">
                        <p>Среден успех: {student?.gpa}</p>
                        <p>Блок: {student?.apartmentBuildingNumber || '-'} {student?.apartmentBuildingEntrance || ''}</p>
                        <p>Стая: {`${student?.room || '-'}`}</p>
                    </div>
                </div>
            ) : (
                <Spinner delay={2000} />
            )}
        </div>
    );
};

export default StudentDetails;