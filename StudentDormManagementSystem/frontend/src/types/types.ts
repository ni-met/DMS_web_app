export type ApartmentBuilding = {
    apartmentBuildingId: number,
    number: number,
    entrance: string,
    availableRoomsCount: number
};

export type Room = {
    roomId: number,
    number?: number,
    capacity: number,
    apartmentBuildingId?: number,
    apartmentBuildingNumber: number,
    apartmentBuildingEntrance: string
};

export type Student = {
    email: string,
    firstName: string,
    lastName: string,
    facultyNumber: string,
    phoneNumber: string,
    semester: number,
    specialty: string,
    faculty: string,
    room: number,
    roomId?: number,
    apartmentBuildingId?: number,
    city: string,
    gpa: number,
    apartmentBuildingNumber: number,
    apartmentBuildingEntrance: string
};

export type Record = {
    recordId: number,
    period: string,
    isActive: boolean,
    createdOn: string
};

export type Application = {
    applicationId: number,
    type: string,
    appliedOn: string,
    status: string,
    studentFacultyNumber: string,
    friendFacultyNumber: string,
    desiredRoom1: Partial<Room>,
    desiredRoom2: Partial<Room>,
    desiredRoom3: Partial<Room>,
    recordPeriod: string
};

export type Complaint = {
    complaintId: number,
    title: string,
    content: string,
    madeOn: string,
    facultyNumber: string,
    status: string
};

export type Bill = {
    billId: number,
    type: string,
    amount: number,
    issuedOn: string,
    studentFacultyNumber: string,
    isPaid: boolean
};

export type Faculty = {
    name: string
};

export type Specialty = {
    name: string,
    faculty: string
};

export type User = {
    email: string,
    password: string,
    firstName: string,
    lastName: string
};