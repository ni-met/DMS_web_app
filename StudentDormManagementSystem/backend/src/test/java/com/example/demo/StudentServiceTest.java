package com.example.demo;

import com.example.demo.models.Faculty;
import com.example.demo.services.StudentService;
import com.example.demo.models.Specialty;
import com.example.demo.models.Student;
import com.example.demo.models.User;
import com.example.demo.dtos.StudentDTO;
import com.example.demo.repositories.StudentRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.SpecialtyService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Transactional
public class StudentServiceTest {
    @Autowired
    private StudentService studentService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;

    private Student student;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setEmail("test-student1@tu-sofia.bg");
        user.setPassword("123456");
        user.setFirstName("Георги");
        user.setLastName("Христов");
        user.setRole(User.Role.STUDENT);

        student = new Student();
        student.setUser(user);
        student.setFacultyNumber("501200000");
        student.setPhoneNumber("0887418529");
        student.setSemester(2);

        Faculty faculty = new Faculty();
        faculty.setId(1L);
        faculty.setName("Факултет по Компютърни системи и технологии");

        Specialty specialty = new Specialty();
        specialty.setId(1L);
        specialty.setName("Информационни технологии в индустрията");
        specialty.setFaculty(faculty);
        student.setSpecialty(specialty);

        student.setCity("София");
        student.setGpa(5.25);

        userRepository.save(user);
        studentRepository.save(student);
    }

    @Test
    void testGetStudentDTOByFacultyNumberSuccess() {
        StudentDTO studentDTO = studentService.getStudentDTOByFacultyNumber(student.getFacultyNumber());

        assertNotNull(studentDTO);
        assertEquals(student.getUser().getEmail(), studentDTO.getEmail());
        assertEquals(student.getUser().getFirstName(), studentDTO.getFirstName());
        assertEquals(student.getUser().getLastName(), studentDTO.getLastName());
        assertEquals(student.getFacultyNumber(), studentDTO.getFacultyNumber());
        assertEquals(student.getPhoneNumber(), studentDTO.getPhoneNumber());
        assertEquals(student.getSemester(), studentDTO.getSemester());
        assertEquals(student.getSpecialty().getName(), studentDTO.getSpecialty());
        assertEquals(student.getSpecialty().getFaculty().getName(), studentDTO.getFaculty());
        assertEquals(student.getCity(), studentDTO.getCity());
        assertEquals(student.getGpa(), studentDTO.getGpa());
    }

    @Test
    void testGetStudentDTOByFacultyNumberNotFound() {
        String invalidFacultyNumber = "000000000";

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            studentService.getStudentDTOByFacultyNumber(invalidFacultyNumber);
        });
        assertEquals("Student not found", exception.getMessage());
    }

    @Test
    void testGetStudentDTOByFacultyNumberInvalidArgument() {
        String invalidFacultyNumber = "";

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            studentService.getStudentDTOByFacultyNumber(invalidFacultyNumber);
        });
        assertEquals("Faculty number should have value", exception.getMessage());
    }

    @Test
    void testCreateStudentSuccess() {
        StudentDTO newStudentDTO = new StudentDTO();
        newStudentDTO.setEmail("test-student2@tu-sofia.bg");
        newStudentDTO.setFirstName("Калина");
        newStudentDTO.setLastName("Петрова");
        newStudentDTO.setFacultyNumber("121200001");
        newStudentDTO.setPhoneNumber("0881234888");
        newStudentDTO.setSemester(4);
        newStudentDTO.setSpecialty("Компютърно и софтуерно инженерство");
        newStudentDTO.setFaculty("Факултет по Компютърни системи и технологии");
        newStudentDTO.setCity("Пловдив");
        newStudentDTO.setGpa(4.80);
        newStudentDTO.setRoomId(1L);

        StudentDTO createdStudentDTO = studentService.createStudent(newStudentDTO);

        assertNotNull(createdStudentDTO);
        Student savedStudent = studentService.getStudentByFacultyNumber(newStudentDTO.getFacultyNumber());
        assertTrue(savedStudent != null, "Student should be in the database");
        assertEquals("Калина", savedStudent.getUser().getFirstName(), "First should name be in the database");
        assertEquals("Пловдив", savedStudent.getCity(), "City should be in the database");
    }

    @Test
    void testCreateStudentWithExistingEmailShouldThrowException() {
        StudentDTO existingEmailDTO = new StudentDTO();
        existingEmailDTO.setEmail(student.getUser().getEmail());
        existingEmailDTO.setFirstName("Йоан");
        existingEmailDTO.setLastName("Великов");
        existingEmailDTO.setFacultyNumber("301200001");
        existingEmailDTO.setPhoneNumber("0881234999");
        existingEmailDTO.setSemester(7);
        existingEmailDTO.setCity("Елин Пелин");
        existingEmailDTO.setGpa(5.40);
        existingEmailDTO.setSpecialty("Машиностроене");

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            studentService.createStudent(existingEmailDTO);
        }, "createStudent() should have thrown an error for duplicating emails");

        assertTrue(thrown.getMessage().contains("This email is already taken"), "Expected error message about already existing email");
    }

    @Test
    void testCreateStudentWithDuplicateFacultyNumberShouldThrowException() {
        StudentDTO duplicateFacultyNumberDTO = new StudentDTO();
        duplicateFacultyNumberDTO.setEmail("test-student4@tu-sofia.bg");
        duplicateFacultyNumberDTO.setFirstName("Тихомир");
        duplicateFacultyNumberDTO.setLastName("Стефанов");
        duplicateFacultyNumberDTO.setFacultyNumber(student.getFacultyNumber());
        duplicateFacultyNumberDTO.setPhoneNumber("0887654777");
        duplicateFacultyNumberDTO.setSemester(6);
        duplicateFacultyNumberDTO.setCity("Лом");
        duplicateFacultyNumberDTO.setGpa(5.12);
        duplicateFacultyNumberDTO.setSpecialty("Информационни технологии в индустрията");

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            studentService.createStudent(duplicateFacultyNumberDTO);
        }, "createStudent() should have thrown an error for duplicating faculty numbers");

        assertTrue(thrown.getMessage().contains("This faculty number is already taken"), "Expected error message about already existing faculty number");
    }

    @Test
    void testCreateStudentWithDuplicatePhoneNumberShouldThrowException() {
        StudentDTO duplicatePhoneNumberDTO = new StudentDTO();
        duplicatePhoneNumberDTO.setEmail("test-student5@tu-sofia.bg");
        duplicatePhoneNumberDTO.setFirstName("Антон");
        duplicatePhoneNumberDTO.setLastName("Росенов");
        duplicatePhoneNumberDTO.setFacultyNumber("171200003");
        duplicatePhoneNumberDTO.setPhoneNumber(student.getPhoneNumber());
        duplicatePhoneNumberDTO.setSemester(2);
        duplicatePhoneNumberDTO.setCity("Бургас");
        duplicatePhoneNumberDTO.setGpa(4.60);
        duplicatePhoneNumberDTO.setSpecialty("Телекомуникации");

        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            studentService.createStudent(duplicatePhoneNumberDTO);
        }, "createStudent() should have thrown an error for duplicating phone numbers");

        assertTrue(thrown.getMessage().contains("This phone number is already taken"), "Expected error message about already existing phone number");
    }

    @Test
    void testCreateStudentWithNullDTO() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            studentService.createStudent(null);
        });
        assertEquals("No data to create new student with", exception.getMessage());
    }
}
