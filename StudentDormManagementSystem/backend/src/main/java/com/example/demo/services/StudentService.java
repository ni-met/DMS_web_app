package com.example.demo.services;

import com.example.demo.dtos.StudentDTO;
import com.example.demo.models.*;
import com.example.demo.repositories.StudentRepository;
import com.example.demo.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    private final UserService userService;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final SpecialtyService specialtyService;
    private final FacultyService facultyService;
    private final RoomService roomService;

    public StudentService(UserService userService, StudentRepository studentRepository, UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, SpecialtyService specialtyService, FacultyService facultyService, RoomService roomService) {
        this.userService = userService;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.specialtyService = specialtyService;
        this.facultyService = facultyService;
        this.roomService = roomService;
    }

    public StudentDTO toDTO(Student student) {
        StudentDTO studentDTO = new StudentDTO();

        studentDTO.setEmail(student.getUser().getEmail());
        studentDTO.setFirstName(student.getUser().getFirstName());
        studentDTO.setLastName(student.getUser().getLastName());
        studentDTO.setFacultyNumber(student.getFacultyNumber());
        studentDTO.setPhoneNumber(student.getPhoneNumber());
        studentDTO.setSemester(student.getSemester());
        studentDTO.setSpecialty(student.getSpecialty().getName());
        studentDTO.setFaculty(student.getSpecialty().getFaculty().getName());
        studentDTO.setCity(student.getCity());
        studentDTO.setGpa(student.getGpa());

        if (student.getRoom() != null) {
            studentDTO.setRoomId(student.getRoom().getRoomId());
            studentDTO.setRoom(student.getRoom().getNumber());
            studentDTO.setApartmentBuildingId(student.getRoom().getApartmentBuilding().getApartmentBuildingId());
            studentDTO.setApartmentBuildingNumber(student.getRoom().getApartmentBuilding().getNumber());
            studentDTO.setApartmentBuildingEntrance(student.getRoom().getApartmentBuilding().getEntrance());
        } else {
            studentDTO.setRoom(null);
            studentDTO.setApartmentBuildingNumber(null);
            studentDTO.setApartmentBuildingEntrance(null);
        }

        return studentDTO;
    }

    public Student toEntity(StudentDTO studentDTO) {
        Student student = new Student();
        User user = new User();

        user.setEmail(studentDTO.getEmail());
        user.setPassword(bCryptPasswordEncoder.encode(studentDTO.getFacultyNumber()));
        user.setFirstName(studentDTO.getFirstName());
        user.setLastName(studentDTO.getLastName());
        user.setRole(User.Role.STUDENT);
        userRepository.save(user);

        student.setUser(user);
        student.setFacultyNumber(studentDTO.getFacultyNumber());
        student.setPhoneNumber(studentDTO.getPhoneNumber());
        student.setSemester(studentDTO.getSemester());

        Specialty specialty = specialtyService.getSpecialtyByName(studentDTO.getSpecialty());
        student.setSpecialty(specialty);

        Faculty faculty = facultyService.getFacultyByName(studentDTO.getFaculty());
        student.getSpecialty().setFaculty(faculty);

        Room room = roomService.getRoomById(studentDTO.getRoomId());
        student.setRoom(room);
        student.getRoom().setCapacity(student.getRoom().getCapacity() - 1);

        student.setCity(studentDTO.getCity());
        student.setGpa(studentDTO.getGpa());

        return student;
    }

    public StudentDTO getStudentDTOByFacultyNumber(String facultyNumber) {
        if (facultyNumber == null || facultyNumber.trim().isEmpty())
            throw new IllegalArgumentException("Faculty number should have value");

        Optional<Student> studentOptional = studentRepository.findStudentByFacultyNumber(facultyNumber);

        if (studentOptional.isEmpty()) throw new EntityNotFoundException("Student not found");

        StudentDTO studentDTO = toDTO(studentOptional.get());

        return studentDTO;
    }

    public Student getStudentByFacultyNumber(String facultyNumber) {
        if (facultyNumber == null || facultyNumber.trim().isEmpty())
            throw new IllegalArgumentException("Faculty number should have value");

        Optional<Student> studentOptional = studentRepository.findStudentByFacultyNumber(facultyNumber);
        if (studentOptional.isEmpty()) throw new EntityNotFoundException("Student not found");

        return studentOptional.get();
    }

    public List<StudentDTO> searchForStudents(String email, String fullName, String facultyNumber, String faculty,
                                              String specialty, Integer semester, String phoneNumber,
                                              String apartmentBuilding, Integer room, String city, String gpa) {

        email = userService.transformParameter(email);
        fullName = userService.transformParameter(fullName);
        facultyNumber = userService.transformParameter(facultyNumber);
        faculty = userService.transformParameter(faculty);
        specialty = userService.transformParameter(specialty);
        phoneNumber = userService.transformParameter(phoneNumber);
        apartmentBuilding = userService.transformParameter(apartmentBuilding);
        city = userService.transformParameter(city);

        List<Student> students = studentRepository.searchStudents(email, fullName, facultyNumber, faculty,
                specialty, semester, phoneNumber, apartmentBuilding, room, city, gpa);

        List<StudentDTO> studentDTOS = new ArrayList<>();
        if (!students.isEmpty()) {
            for (Student student : students) {
                studentDTOS.add(toDTO(student));
            }
        }

        return studentDTOS;
    }

    public StudentDTO updateStudent(String facultyNumber, StudentDTO studentDTO) {
        if (facultyNumber == null || facultyNumber.trim().isEmpty())
            throw new IllegalArgumentException("Faculty number should have value");

        if (studentDTO == null) throw new IllegalArgumentException("No changing data found");

        Optional<Student> currentStudentOptional = studentRepository.findStudentByFacultyNumber(facultyNumber);

        if (currentStudentOptional.isEmpty()) throw new EntityNotFoundException("Student not found");

        Student currentStudent = currentStudentOptional.get();

        User user = currentStudent.getUser();
        user.setEmail(studentDTO.getEmail());

        user.setFirstName(studentDTO.getFirstName());
        user.setLastName(studentDTO.getLastName());

        currentStudent.setPhoneNumber(studentDTO.getPhoneNumber());
        currentStudent.setSemester(studentDTO.getSemester());

        Faculty faculty = facultyService.getFacultyByName(studentDTO.getFaculty());
        currentStudent.getSpecialty().setFaculty(faculty);

        Specialty specialty = specialtyService.getSpecialtyByName(studentDTO.getSpecialty());
        currentStudent.setSpecialty(specialty);

        if (currentStudent.getRoom() != null) {
            Integer capacity = currentStudent.getRoom().getCapacity();
            currentStudent.getRoom().setCapacity(capacity + 1);
        }

        Room room = roomService.findRoomByNumberAndApartmentBuilding(studentDTO.getRoom(), studentDTO.getApartmentBuildingNumber(), studentDTO.getApartmentBuildingEntrance());
        if (room != null) {
            Integer capacity = room.getCapacity();
            room.setCapacity(capacity - 1);
        }
        currentStudent.setRoom(room);

        currentStudent.setCity(studentDTO.getCity());
        currentStudent.setGpa(studentDTO.getGpa());

        studentRepository.save(currentStudent);
        StudentDTO updatedStudentDTO = toDTO(currentStudent);

        return updatedStudentDTO;
    }

    public Student getCurrentStudent() {
        User user = userService.getCurrentUser();
        Optional<Student> studentOptional = studentRepository.findStudentByUser_Email(user.getEmail());

        if (!studentOptional.isPresent()) throw new EntityNotFoundException("Student not found");

        Student student = studentOptional.get();

        return student;
    }

    @Transactional
    public StudentDTO createStudent(StudentDTO studentDTO) {
        if (studentDTO == null) throw new IllegalArgumentException("No data to create new student with");

        Optional<User> userOptional = userRepository.findUserByEmail(studentDTO.getEmail());
        Optional<Student> studentOptionalFacultyNumber = studentRepository.findStudentByFacultyNumber(studentDTO.getFacultyNumber());
        Optional<Student> studentOptionalPhoneNumber = studentRepository.findStudentByPhoneNumber(studentDTO.getPhoneNumber());

        if (!userOptional.isEmpty())
            throw new IllegalArgumentException("This email is already taken");
        else if (!studentOptionalFacultyNumber.isEmpty())
            throw new IllegalArgumentException("This faculty number is already taken");
        else if (!studentOptionalPhoneNumber.isEmpty())
            throw new IllegalArgumentException("This phone number is already taken");

        Student student = toEntity(studentDTO);
        studentRepository.save(student);

        return toDTO(student);
    }

    @Transactional
    public void deleteStudentByFacultyNumber(String facultyNumber) {
        if (facultyNumber == null || facultyNumber.trim().isEmpty())
            throw new IllegalArgumentException("Faculty number should have value");

        Optional<Student> studentOptional = studentRepository.findStudentByFacultyNumber(facultyNumber);

        if (studentOptional.isEmpty())
            throw new EntityNotFoundException("Student with faculty number " + facultyNumber + " not found");

        Student student = studentOptional.get();
        studentRepository.delete(student);
    }

    public StudentDTO getStudentByPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty())
            throw new IllegalArgumentException("Phone number should have value");

        Optional<Student> studentOptional = studentRepository.findStudentByPhoneNumber(phoneNumber);

        if (studentOptional.isEmpty()) throw new EntityNotFoundException("Student not found");

        StudentDTO studentDTO = toDTO(studentOptional.get());

        return studentDTO;
    }

    public int getStudentCountWithRooms() {
        return studentRepository.countStudentsWithARoom();
    }

}
