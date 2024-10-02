package com.example.demo.controllers;

import com.example.demo.dtos.RecordDTO;
import com.example.demo.services.RecordService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/records")
public class RecordController {
    private final RecordService recordService;

    public RecordController(RecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchRecords(@RequestParam(required = false) String id,
                                           @RequestParam(required = false) String period,
                                           @RequestParam(required = false) Boolean isActive) {

        List<RecordDTO> recordDTOS = recordService.searchRecords(id, period, isActive);

        if (recordDTOS.isEmpty()) return ResponseEntity.status(404).body("Record not found");

        return ResponseEntity.ok(recordDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecordByRecordId(@PathVariable(name = "id") Long id) {
        try {
            RecordDTO recordDTO = recordService.getRecordByRecordId(id);
            if (recordDTO == null) ResponseEntity.status(404).body("Record not found");

            return ResponseEntity.ok(recordDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecordStatus(@PathVariable(name = "id") Long id, @RequestParam Boolean isActive) {
        try {
            RecordDTO updatedRecordDTO = recordService.updateRecordStatus(id, isActive);
            if (updatedRecordDTO == null) return ResponseEntity.status(404).body("Record not found");

            return ResponseEntity.ok(updatedRecordDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestRecord() {
        try {
            RecordDTO recordDTO = recordService.getLatestRecord();
            if (recordDTO == null) return ResponseEntity.status(404).body("Record not found");

            return ResponseEntity.ok(recordDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/period")
    public ResponseEntity<?> getRecordByPeriod(@RequestParam(name = "period") String period) {
        try {
            RecordDTO recordDTO = recordService.getRecordByPeriod(period);
            if (recordDTO == null) ResponseEntity.status(404).body("Record not found");

            return ResponseEntity.ok(recordDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRecord(@RequestBody RecordDTO recordDTO) {
        try {
            RecordDTO newRecordDTO = recordService.createRecord(recordDTO);
            if (recordDTO == null) return ResponseEntity.status(404).body("Record not found");

            return ResponseEntity.ok(newRecordDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRecord(@PathVariable(name = "id") Long id) {
        try {
            recordService.deleteRecordByRecordId(id);

            return ResponseEntity.ok("Record with ID " + id + " deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllRecords() {
        try {
            List<RecordDTO> recordDTOS = recordService.getAllRecords();
            if (recordDTOS.isEmpty()) return ResponseEntity.status(404).body("Records not found");

            return ResponseEntity.ok(recordDTOS);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
