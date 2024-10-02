import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from '../components/shared/Login';
import AdminDashboard from '../components/admin_dashboard/AdminDashboard';
import StudentDashboard from '../components/student_dashboard/StudentDashboard';
import "../styles.css"
import ManageStudentProfile from "../components/admin_dashboard/ManageStudentProfile";
import ManageStudents from "../components/admin_dashboard/ManageStudents";
import ManageRooms from "../components/admin_dashboard/ManageRooms";
import ManageApplications from "../components/admin_dashboard/ManageApplications";
import ManageBills from "../components/admin_dashboard/ManageBills";
import ManageRecords from "../components/admin_dashboard/ManageRecords";
import ManageApplicationDetails from "../components/admin_dashboard/ManageApplicationDetails";
import ManageComplaints from "../components/admin_dashboard/ManageComplaints";
import ManageComplaintDetails from "../components/admin_dashboard/ManageComplaintDetails";
import ManageBillDetails from "../components/admin_dashboard/ManageBillDetails";
import ManageRoomDetails from "../components/admin_dashboard/ManageRoomDetails";
import ManageRecordDetails from "../components/admin_dashboard/ManageRecordDetails";
import RankStudentApplications from "../components/admin_dashboard/RankStudentApplications";
import ChooseApplication from "../components/student_dashboard/ChooseApplication";
import StudentBills from "../components/student_dashboard/StudentBills";
import StudentComplaints from "../components/student_dashboard/StudentComplaints";
import NewStudentForm from "../components/admin_dashboard/NewStudentForm";
import RoomChooser from "../components/student_dashboard/RoomChooser";
import NewComplaintForm from "../components/student_dashboard/NewComplaintForm";
import NewBillForm from "../components/admin_dashboard/NewBillForm";
import NewRecordForm from "../components/admin_dashboard/NewRecordForm";
import UserProfile from "../components/admin_dashboard/UserProfile";
import StudentProfile from "../components/student_dashboard/StudentProfile";
import NewRoomApplication from "../components/student_dashboard/NewRoomApplication";
import ChangeRoomApplication from "../components/student_dashboard/ChangeRoomApplication";

function App() {
    const [role, setRole] = useState('');

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login setRole={setRole}/>}/>
                    <Route path="/login" element={<Login setRole={setRole}/>}/>

                    <Route path="/manage-students"
                           element={role === 'ADMIN' ? <ManageStudents/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-students/new"
                           element={role === 'ADMIN' ? <NewStudentForm/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-student/:facultyNumber"
                           element={role === 'ADMIN' ? <ManageStudentProfile/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-rooms" element={role === 'ADMIN' ? <ManageRooms/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-room/:id"
                           element={role === 'ADMIN' ? <ManageRoomDetails/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-applications"
                           element={role === 'ADMIN' ? <ManageApplications/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-application/:id"
                           element={role === 'ADMIN' ? <ManageApplicationDetails/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-bills" element={role === 'ADMIN' ? <ManageBills/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-bill/:id"
                           element={role === 'ADMIN' ? <ManageBillDetails/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-bills/new" element={role === 'ADMIN' ? <NewBillForm/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-records" element={role === 'ADMIN' ? <ManageRecords/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-record/:id"
                           element={role === 'ADMIN' ? <ManageRecordDetails/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-records/new"
                           element={role === 'ADMIN' ? <NewRecordForm/> : <p>Unauthorized</p>}/>
                    <Route path="/rank" element={role === 'ADMIN' ? <RankStudentApplications/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-complaints"
                           element={role === 'ADMIN' ? <ManageComplaints/> : <p>Unauthorized</p>}/>
                    <Route path="/manage-complaint/:id"
                           element={role === 'ADMIN' ? <ManageComplaintDetails/> : <p>Unauthorized</p>}/>
                    <Route path="/profile" element={role === 'ADMIN' ? <UserProfile/> : <p>Unauthorized</p>}/>

                    <Route path="/bills" element={role === 'STUDENT' ? <StudentBills/> : <p>Unauthorized</p>}/>
                    <Route path="/complaints"
                           element={role === 'STUDENT' ? <StudentComplaints/> : <p>Unauthorized</p>}/>
                    <Route path="/complaints/new"
                           element={role === 'STUDENT' ? <NewComplaintForm/> : <p>Unauthorized</p>}/>
                    <Route path="/apply/" element={role === 'STUDENT' ? <ChooseApplication/> : <p>Unauthorized</p>}/>
                    <Route path="/apply/new-room"
                           element={role === 'STUDENT' ? <NewRoomApplication/> : <p>Unauthorized</p>}/>
                    <Route path="/apply/change-room"
                           element={role === 'STUDENT' ? <ChangeRoomApplication/> : <p>Unauthorized</p>}/>
                    <Route path="/building-:id" element={role === 'STUDENT' ? <RoomChooser/> : <p>Unauthorized</p>}/>
                    <Route path="/my-profile" element={role === 'STUDENT' ? <StudentProfile/> : <p>Unauthorized</p>}/>

                    <Route path="/admins" element={role === 'ADMIN' ? <AdminDashboard/> : <p>Unauthorized</p>}/>
                    <Route path="/students" element={role === 'STUDENT' ? <StudentDashboard/> : <p>Unauthorized</p>}/>

                    <Route path="*" element={<p>Страницата не е намерена.</p>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;