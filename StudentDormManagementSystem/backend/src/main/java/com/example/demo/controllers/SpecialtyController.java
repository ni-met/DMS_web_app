package com.example.demo.controllers;

import com.example.demo.dtos.SpecialtyDTO;
import com.example.demo.services.SpecialtyService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/specialties")
public class SpecialtyController {
    private final SpecialtyService specialtyService;

    public SpecialtyController(SpecialtyService specialtyService) {
        this.specialtyService = specialtyService;
    }

    @GetMapping("/faculty/{facultyName}")
    public ResponseEntity<?> getSpecialtiesByFacultyName(@PathVariable(name = "facultyName") String facultyName) {
        try {
            List<SpecialtyDTO> specialtyDTOS = specialtyService.getSpecialtiesByFacultyName(facultyName);
            if (specialtyDTOS.isEmpty()) ResponseEntity.status(404).body("Specialties not found");

            return ResponseEntity.ok(specialtyDTOS);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
