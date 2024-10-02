package com.example.demo.controllers;

import com.example.demo.dtos.ApplicationDTO;
import com.example.demo.services.ApplicationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")

public class ApplicationController {
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/create/{type}")
    public ResponseEntity<?> createApplication(@PathVariable(name = "type") String type,
                                               @RequestBody ApplicationDTO applicationDTO) {
        try {
            ApplicationDTO createdApplicationDTO = applicationService.createApplication(applicationDTO, type);

            return ResponseEntity.ok(createdApplicationDTO);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationByApplicationId(@PathVariable(name = "id") Long id) {
        try {
            ApplicationDTO applicationDTO = applicationService.getApplicationById(id);

            if (applicationDTO == null) ResponseEntity.status(404).body("Application not found");

            return ResponseEntity.ok(applicationDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable(name = "id") Long id,
                                                     @RequestParam(name = "status") String status) {
        try {
            ApplicationDTO updatedApplicationDTO = applicationService.updateApplicationStatus(id, status);

            if (updatedApplicationDTO == null) return ResponseEntity.status(404).body("Application not found");

            return ResponseEntity.ok(updatedApplicationDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/waiting")
    public ResponseEntity<?> getUnapprovedApplicationsForMovingCount() {
        int count = applicationService.getPendingApplicationsForMovingCount();

        return ResponseEntity.ok(count);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchForApplications(@RequestParam(required = false) String id,
                                                   @RequestParam(required = false) String type,
                                                   @RequestParam(required = false) String appliedOn,
                                                   @RequestParam(required = false) String status,
                                                   @RequestParam(required = false) String facultyNumber,
                                                   @RequestParam(required = false) String period) {

        List<ApplicationDTO> applicationDTOS = applicationService.searchApplications(id, type, appliedOn,
                status, facultyNumber, period);

        if (applicationDTOS.isEmpty()) return ResponseEntity.status(404).body("Applications not found");

        return ResponseEntity.ok(applicationDTOS);
    }

    @GetMapping("/rank/{id}")
    public ResponseEntity<?> rankApplications(@PathVariable(name = "id") Long recordId) {
        try {
            List<ApplicationDTO> rankedApplicationDTOs = applicationService.rankStudentApplications(recordId);

            if (rankedApplicationDTOs.isEmpty()) return ResponseEntity.status(404).body("Applications not found");

            return ResponseEntity.ok(rankedApplicationDTOs);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable Long id) {
        try {
            applicationService.deleteApplication(id);

            return ResponseEntity.ok("Application with ID " + id + " deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/exists/new-room")
    public ResponseEntity<?> checkIfApplicationExistsForRecord(@RequestParam(name = "recordId") Long recordId,
                                                               @RequestParam(name = "facultyNumber") String facultyNumber) {
        try {
            Boolean applicationExists = applicationService.checkIfApplicationExistsForRecord(recordId, facultyNumber);
            return ResponseEntity.ok(applicationExists);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/exists/change")
    public ResponseEntity<?> checkIfApplicationForChangeExists(@RequestParam(name = "facultyNumber") String facultyNumber) {
        try {
            Boolean applicationExists = applicationService.checkIfApplicationForChangeExists(facultyNumber);
            return ResponseEntity.ok(applicationExists);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
