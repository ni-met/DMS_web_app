package com.example.demo.controllers;

import com.example.demo.dtos.BillDTO;
import com.example.demo.services.BillService;
import com.example.demo.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bills")
public class BillController {
    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchForBills(@RequestParam(required = false) String id,
                                            @RequestParam(required = false) String type,
                                            @RequestParam(required = false) String issuedOn,
                                            @RequestParam(required = false) String facultyNumber,
                                            @RequestParam(required = false) Boolean isPaid) {

        List<BillDTO> billDTOS = billService.searchBills(id, type, issuedOn, facultyNumber, isPaid);

        if (billDTOS.isEmpty()) return ResponseEntity.status(404).body("Bills not found");

        return ResponseEntity.ok(billDTOS);
    }

    @GetMapping("/search/{facultyNumber}")
    public ResponseEntity<?> searchStudentBills(@PathVariable(name = "facultyNumber") String facultyNumber,
                                                @RequestParam(required = false) String id,
                                                @RequestParam(required = false) String type,
                                                @RequestParam(required = false) String issuedOn,
                                                @RequestParam(required = false) Boolean isPaid) {
        try {
            List<BillDTO> billDTOS = billService.searchBills(id, type, issuedOn, facultyNumber, isPaid);
            if (billDTOS.isEmpty()) return ResponseEntity.status(404).body("Bills not found");

            return ResponseEntity.ok(billDTOS);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBillByBillId(@PathVariable(name = "id") Long id) {
        try {
            BillDTO billDTO = billService.getBillById(id);
            if (billDTO == null) ResponseEntity.status(404).body("Bill not found");

            return ResponseEntity.ok(billDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBillStatus(@PathVariable(name = "id") Long id, @RequestParam Boolean isPaid) {
        try {
            BillDTO updatedBillDTO = billService.updateBillStatus(id, isPaid);
            if (updatedBillDTO == null) return ResponseEntity.status(404).body("Bill not found");

            return ResponseEntity.ok(updatedBillDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/student/{facultyNumber}")
    public ResponseEntity<?> getBillsOfStudent(@PathVariable(name = "facultyNumber") String facultyNumber) {
        try {
            List<BillDTO> billDTOS = billService.getBillsOfStudent(facultyNumber);
            if (billDTOS == null) return ResponseEntity.status(404).body("Bills not found");

            return ResponseEntity.ok(billDTOS);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBill(@RequestBody BillDTO billDTO) {
        try {
            BillDTO createdBillDTO = billService.createBill(billDTO);
            if (createdBillDTO == null) return ResponseEntity.status(400).body("Bill not found");

            return ResponseEntity.ok(createdBillDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBill(@PathVariable(name = "id") Long id) {
        try {
            billService.deleteBillByBillId(id);

            return ResponseEntity.ok("Bill with ID " + id + " deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/unpaid")
    public ResponseEntity<?> getCountOfUnpaidBills() {
        int count = billService.getCountOfUnpaidBills();

        return ResponseEntity.ok(count);
    }

    @GetMapping("/unpaid/{facultyNumber}")
    public ResponseEntity<?> getCountOfStudentUnpaidBills(@PathVariable(name = "facultyNumber") String
                                                                  facultyNumber) {
        try {
            int count = billService.getCountOfStudentUnpaidBills(facultyNumber);

            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
