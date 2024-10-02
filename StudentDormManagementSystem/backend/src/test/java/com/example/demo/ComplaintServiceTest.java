package com.example.demo;

import com.example.demo.models.*;
import com.example.demo.repositories.ComplaintRepository;
import com.example.demo.repositories.StudentRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.*;
import com.example.demo.dtos.ComplaintDTO;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ComplaintServiceTest {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ComplaintService complaintService;

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
    void testCreateComplaintSuccess() {
        ComplaintDTO newComplaintDTO = new ComplaintDTO();
        newComplaintDTO.setTitle("Заглавие - тест");
        newComplaintDTO.setContent("Съдържание - тест");
        newComplaintDTO.setFacultyNumber(student.getFacultyNumber());

        ComplaintDTO createdComplaint = complaintService.createComplaint(newComplaintDTO);

        assertNotNull(createdComplaint);
        assertEquals(newComplaintDTO.getTitle(), createdComplaint.getTitle());
        assertEquals(newComplaintDTO.getContent(), createdComplaint.getContent());
        assertEquals(student.getFacultyNumber(), createdComplaint.getFacultyNumber());
    }

    @Test
    void testCreateComplaintWithNullDTO() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            complaintService.createComplaint(null);
        });
        assertEquals("No data to create new complaint with", exception.getMessage());
    }

    @Test
    void testGetComplaintByIdSuccess() {
        ComplaintDTO complaintDTO = new ComplaintDTO();
        complaintDTO.setTitle("Заглавие - тест");
        complaintDTO.setContent("Съдържание - тест");
        complaintDTO.setFacultyNumber(student.getFacultyNumber());
        complaintDTO.setMadeOn(LocalDateTime.now());

        ComplaintDTO createdComplaint = complaintService.createComplaint(complaintDTO);
        ComplaintDTO fetchedComplaint = complaintService.getComplaintById(createdComplaint.getComplaintId());

        assertNotNull(fetchedComplaint);
        assertEquals(createdComplaint.getComplaintId(), fetchedComplaint.getComplaintId());
        assertEquals(createdComplaint.getTitle(), fetchedComplaint.getTitle());
        assertEquals(createdComplaint.getContent(), fetchedComplaint.getContent());
    }

    @Test
    void testGetComplaintByIdWithInvalidId() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            complaintService.getComplaintById(null);
        });
        assertEquals("Invalid ID", exception.getMessage());

        exception = assertThrows(IllegalArgumentException.class, () -> {
            complaintService.getComplaintById(-1L);
        });
        assertEquals("Invalid ID", exception.getMessage());
    }

    @Test
    void testGetComplaintByIdWithNonExistingId() {
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            complaintService.getComplaintById(500L);
        });
        assertEquals("Complaint not found", exception.getMessage());
    }

    @Test
    void testDeleteComplaintByComplaintIdSuccess() {
        ComplaintDTO complaintDTO = new ComplaintDTO();
        complaintDTO.setTitle("Заглавие - тест");
        complaintDTO.setContent("Съдържание - тест");
        complaintDTO.setFacultyNumber(student.getFacultyNumber());
        ComplaintDTO createdComplaintDTO = complaintService.createComplaint(complaintDTO);

        ComplaintDTO complaintExists = complaintService.getComplaintById(createdComplaintDTO.getComplaintId());
        assertNotNull(complaintExists);

        complaintService.deleteComplaintByComplaintId(createdComplaintDTO.getComplaintId());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            complaintService.getComplaintById(createdComplaintDTO.getComplaintId());
        });
        assertEquals("Complaint not found", exception.getMessage());
    }

    @Test
    void testDeleteComplaintByComplaintIdWithNonExistingComplaintId() {
        Long invalidComplaintId = 500L;

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            complaintService.getComplaintById(invalidComplaintId);
        });
        assertEquals("Complaint not found", exception.getMessage());
    }

    @Test
    void testDeleteComplaintWithInvalidId() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            complaintService.deleteComplaintByComplaintId(null);
        });
        assertEquals("Invalid complaint ID", exception.getMessage());

        exception = assertThrows(IllegalArgumentException.class, () -> {
            complaintService.deleteComplaintByComplaintId(-1L);
        });
        assertEquals("Invalid complaint ID", exception.getMessage());
    }

    @Test
    void testUpdateComplaintStatusSuccess() {
        ComplaintDTO complaintDTO = new ComplaintDTO();
        complaintDTO.setTitle("Заглавие - тест");
        complaintDTO.setContent("Съдържание на оплакването - тест");
        complaintDTO.setMadeOn(LocalDateTime.now());
        complaintDTO.setFacultyNumber(student.getFacultyNumber());
        complaintDTO.setStatus("ЗА_ПРЕГЛЕД");
        complaintService.createComplaint(complaintDTO);
        Long complaintId = complaintService.createComplaint(complaintDTO).getComplaintId();

        ComplaintDTO updatedComplaintDTO = complaintService.updateComplaintStatus(complaintId, "ПРИЕТО");

        assertNotNull(updatedComplaintDTO);

        ComplaintDTO complaintById = complaintService.getComplaintById(complaintId);
        assertEquals("ПРИЕТО", complaintById.getStatus());
    }

    @Test
    void testUpdateComplaintStatusWithNullStatus() {
        ComplaintDTO complaintDTO = new ComplaintDTO();
        complaintDTO.setTitle("Заглавие - тест");
        complaintDTO.setContent("Съдържание на оплакването - тест");
        complaintDTO.setMadeOn(LocalDateTime.now());
        complaintDTO.setFacultyNumber(student.getFacultyNumber());
        complaintDTO.setStatus("ЗА_ПРЕГЛЕД");
        complaintService.createComplaint(complaintDTO);
        Long complaintId = complaintService.createComplaint(complaintDTO).getComplaintId();

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            complaintService.updateComplaintStatus(complaintId, null);
        });
        assertEquals("New status cannot be null", exception.getMessage());
    }

    @Test
    void testUpdateComplaintStatusWithInvalidId() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            complaintService.updateComplaintStatus(null, "ПРИЕТО");
        });
        assertEquals("Invalid ID", exception.getMessage());

        exception = assertThrows(IllegalArgumentException.class, () -> {
            complaintService.updateComplaintStatus(-1L, "ПРИЕТО");
        });
        assertEquals("Invalid ID", exception.getMessage());
    }

    @Test
    void testUpdateComplaintStatusWithNonExistentId() {
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            complaintService.updateComplaintStatus(500L, "ПРИЕТО");
        });
        assertEquals("Complaint not found", exception.getMessage());
    }

    @Test
    void testUpdateComplaintStatusWithInvalidStatus() {
        ComplaintDTO complaintDTO = new ComplaintDTO();
        complaintDTO.setTitle("Заглавие - тест");
        complaintDTO.setContent("Съдържание на оплакването - тест");
        complaintDTO.setMadeOn(LocalDateTime.now());
        complaintDTO.setFacultyNumber(student.getFacultyNumber());
        complaintDTO.setStatus("ЗА_ПРЕГЛЕД");
        complaintService.createComplaint(complaintDTO);
        Long complaintId = complaintService.createComplaint(complaintDTO).getComplaintId();

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            complaintService.updateComplaintStatus(complaintId, "ТЕСТ_СТАТУС");
        });
        assertEquals("New status is invalid", exception.getMessage());
    }
}
