package com.example.demo.controllers;

import com.example.demo.dtos.FacultyDTO;
import com.example.demo.services.FacultyService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/faculties")
public class FacultyController {
    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllFaculties() {
        try {
            List<FacultyDTO> facultyDTOS = facultyService.getAllFaculties();
            if (facultyDTOS.isEmpty()) return ResponseEntity.status(404).body("Faculties not found");

            return ResponseEntity.ok(facultyDTOS);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
