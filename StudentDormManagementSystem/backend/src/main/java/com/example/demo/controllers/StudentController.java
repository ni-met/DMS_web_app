package com.example.demo.controllers;

import com.example.demo.services.StudentService;
import com.example.demo.dtos.StudentDTO;
import com.example.demo.repositories.StudentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchForStudents(@RequestParam(required = false) String email,
                                               @RequestParam(required = false) String fullName,
                                               @RequestParam(required = false) String facultyNumber,
                                               @RequestParam(required = false) String faculty,
                                               @RequestParam(required = false) String specialty,
                                               @RequestParam(required = false) Integer semester,
                                               @RequestParam(required = false) String phoneNumber,
                                               @RequestParam(required = false) String apartmentBuilding,
                                               @RequestParam(required = false) Integer room,
                                               @RequestParam(required = false) String city,
                                               @RequestParam(required = false) String gpa) {

        List<StudentDTO> studentDTOS = studentService.searchForStudents(email, fullName, facultyNumber, faculty,
                specialty, semester, phoneNumber, apartmentBuilding, room, city, gpa);

        if (studentDTOS.isEmpty()) return ResponseEntity.status(404).body("Students not found");

        return ResponseEntity.ok(studentDTOS);
    }

    @GetMapping("/{facultyNumber}")
    public ResponseEntity<?> getStudentByFacultyNumber(@PathVariable(name = "facultyNumber") String facultyNumber) {
        try {
            StudentDTO studentDTO = studentService.getStudentDTOByFacultyNumber(facultyNumber);
            if (studentDTO == null) return ResponseEntity.status(404).body("Student not found");

            return ResponseEntity.ok(studentDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{facultyNumber}")
    public ResponseEntity<?> updateStudent(@PathVariable(name = "facultyNumber") String facultyNumber, @RequestBody StudentDTO studentDTO) {
        try {
            StudentDTO updatedStudentDTO = studentService.updateStudent(facultyNumber, studentDTO);
            if (updatedStudentDTO == null) ResponseEntity.status(404).body("Student not found");

            return ResponseEntity.ok(updatedStudentDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentStudent() {
        try {
            StudentDTO studentDTO = studentService.toDTO(studentService.getCurrentStudent());

            if (studentDTO == null) return ResponseEntity.status(404).body("Student not found");

            return ResponseEntity.ok(studentDTO);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body("No authenticated user found");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/with-a-room")
    public ResponseEntity<?> getStudentCountWithRooms() {
        int count = studentService.getStudentCountWithRooms();

        if (count < 1) return ResponseEntity.status(404).body("No data found");

        return ResponseEntity.ok(count);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createStudent(@RequestBody StudentDTO studentDTO) {
        try {
            StudentDTO newStudentDTO = studentService.createStudent(studentDTO);
            if (newStudentDTO == null) return ResponseEntity.status(400).body(null);

            return ResponseEntity.ok(newStudentDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete/{facultyNumber}")
    public ResponseEntity<?> deleteStudent(@PathVariable(name = "facultyNumber") String facultyNumber) {
        try {
            studentService.deleteStudentByFacultyNumber(facultyNumber);

            return ResponseEntity.ok("Student with faculty number " + facultyNumber + " deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/by-phone/{phoneNumber}")
    public ResponseEntity<?> getStudentByPhoneNumber(@PathVariable(name = "phoneNumber") String phoneNumber) {
        try {
            StudentDTO studentDTO = studentService.getStudentByPhoneNumber(phoneNumber);
            if (studentDTO == null) return ResponseEntity.status(404).body("Student not found");

            return ResponseEntity.ok(studentDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
