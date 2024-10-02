package com.example.demo.controllers;

import com.example.demo.dtos.ComplaintDTO;
import com.example.demo.services.ComplaintService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/complaints")
public class ComplaintController {
    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping("search")
    public ResponseEntity<?> searchComplaints(@RequestParam(required = false) String id,
                                              @RequestParam(required = false) String title,
                                              @RequestParam(required = false) String content,
                                              @RequestParam(required = false) String madeOn,
                                              @RequestParam(required = false) String facultyNumber,
                                              @RequestParam(required = false) String status) {

        List<ComplaintDTO> complaintDTOS = complaintService.searchComplaints(id, title, content, madeOn, facultyNumber, status);

        if (complaintDTOS.isEmpty()) return ResponseEntity.status(404).body("Complaints not found");

        return ResponseEntity.ok(complaintDTOS);
    }

    @GetMapping("/search/{facultyNumber}")
    public ResponseEntity<?> searchStudentComplaints(@PathVariable(name = "facultyNumber") String facultyNumber,
                                                     @RequestParam(required = false) String id,
                                                     @RequestParam(required = false) String title,
                                                     @RequestParam(required = false) String content,
                                                     @RequestParam(required = false) String madeOn,
                                                     @RequestParam(required = false) String status) {

        List<ComplaintDTO> complaintDTOS = complaintService.searchComplaints(id, title, content, madeOn, facultyNumber, status);

        if (complaintDTOS.isEmpty()) return ResponseEntity.status(404).body("Complaints not found");

        return ResponseEntity.ok(complaintDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintByComplaintId(@PathVariable(name = "id") Long id) {
        try {
            ComplaintDTO complaintDTO = complaintService.getComplaintById(id);
            if (complaintDTO == null) ResponseEntity.status(404).body("Complaint not found");

            return ResponseEntity.ok(complaintDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComplaintStatus(@PathVariable(name = "id") Long id,
                                                   @RequestParam(name = "status") String status) {
        try {
            ComplaintDTO updatedComplaintDTO = complaintService.updateComplaintStatus(id, status);
            if (updatedComplaintDTO == null) return ResponseEntity.status(404).body("Complaint not found");

            return ResponseEntity.ok(updatedComplaintDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/student/{facultyNumber}")
    public ResponseEntity<?> getComplaintsOfStudent(@PathVariable(name = "facultyNumber") String facultyNumber) {
        try {
            List<ComplaintDTO> complaintDTOS = complaintService.getComplaintsOfStudent(facultyNumber);
            if (complaintDTOS == null) return ResponseEntity.status(404).body("Complaints not found");

            return ResponseEntity.ok(complaintDTOS);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createComplaint(@RequestBody ComplaintDTO complaintDTO) {
        try {
            ComplaintDTO createdComplaintDTO = complaintService.createComplaint(complaintDTO);

            if (createdComplaintDTO == null) return ResponseEntity.status(400).body("Complaint not found");

            return ResponseEntity.ok(createdComplaintDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteComplaint(@PathVariable(name = "id") Long id) {
        try {
            complaintService.deleteComplaintByComplaintId(id);

            return ResponseEntity.ok("Complaint with ID " + id + " deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/waiting")
    public ResponseEntity<?> getCountOfWaitingComplaints() {
        int count = complaintService.getCountOfWaitingComplaints();

        return ResponseEntity.ok(count);
    }

    @GetMapping("/waiting/{facultyNumber}")
    public ResponseEntity<?> getCountOfWaitingComplaintsOfStudent(@PathVariable(name = "facultyNumber") String facultyNumber) {
        try {
            int count = complaintService.getCountOfWaitingComplaintsOfStudent(facultyNumber);

            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
