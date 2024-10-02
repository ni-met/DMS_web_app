USE student_dorms_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    role ENUM('STUDENT', 'ADMIN') NOT NULL
);

CREATE TABLE faculties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE specialties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    faculty_id BIGINT NOT NULL,
    CONSTRAINT fk_specialty_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
);

CREATE TABLE apartment_buildings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    apartment_building_id BIGINT NOT NULL UNIQUE,
    number INT NOT NULL,
    entrance CHAR(1)
);

CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL UNIQUE,
    number INT NOT NULL,
    capacity INT NOT NULL,
    apartment_building_id BIGINT NOT NULL,
    CONSTRAINT fk_room_apartment_building FOREIGN KEY (apartment_building_id) REFERENCES apartment_buildings(id) ON DELETE CASCADE
);

CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    faculty_number VARCHAR(9) NOT NULL UNIQUE,
    phone_number VARCHAR(10) NOT NULL UNIQUE,
    semester INT NOT NULL,
    specialty_id BIGINT NOT NULL,
    room_id BIGINT,
    city VARCHAR(45) NOT NULL,
    gpa DOUBLE,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_specialty FOREIGN KEY (specialty_id) REFERENCES specialties(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

CREATE TABLE bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_id BIGINT NOT NULL UNIQUE,
    type ENUM('НАЕМ', 'ВОДА', 'ТОК', 'ПАРНО', 'НОЩУВКА') NOT NULL,
    amount DOUBLE NOT NULL,
    issued_on DATETIME NOT NULL,
    student_id BIGINT NOT NULL,
    is_paid TINYINT(1) NOT NULL,
    CONSTRAINT fk_bill_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE desired_rooms(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room1_id BIGINT,
    room2_id BIGINT,
    room3_id BIGINT,
    CONSTRAINT fk_desired_rooms_room1 FOREIGN KEY (room1_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_desired_rooms_room2 FOREIGN KEY (room2_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_desired_rooms_room3 FOREIGN KEY (room3_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE records(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    record_id  BIGINT NOT NULL UNIQUE,
    period VARCHAR(255) NOT NULL UNIQUE,
    created_on DATETIME NOT NULL,
    is_active TINYINT(1) NOT NULL
);

CREATE TABLE applications(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL UNIQUE,
    type ENUM('НАСТАНЯВАНЕ', 'СМЯНА', 'НАПУСКАНЕ') NOT NULL,
    applied_on DATETIME NOT NULL,
    status ENUM('ОДОБРЕНО', 'ЗА_ПРЕГЛЕД', 'ОТХВЪРЛЕНО') NOT NULL,
    student_id BIGINT NOT NULL,
    friend_id BIGINT,
    desired_rooms_id BIGINT,
    record_id BIGINT,
    CONSTRAINT fk_application_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_application_friend FOREIGN KEY (friend_id) REFERENCES students(id) ON DELETE SET NULL,
    CONSTRAINT fk_application_desired_rooms FOREIGN KEY (desired_rooms_id) REFERENCES desired_rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_application_record FOREIGN KEY (record_id) REFERENCES records(id) ON DELETE CASCADE
);

CREATE TABLE complaints(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(800) NOT NULL,
    student_id BIGINT NOT NULL,
    made_on DATETIME NOT NULL,
    status ENUM('ПРИЕТО', 'ЗА_ПРЕГЛЕД', 'ОТХВЪРЛЕНО') NOT NULL,
    CONSTRAINT fk_complaint_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);