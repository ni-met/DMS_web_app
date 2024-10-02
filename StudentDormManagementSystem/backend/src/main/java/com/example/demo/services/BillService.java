package com.example.demo.services;

import com.example.demo.models.Student;
import com.example.demo.repositories.BillRepository;
import com.example.demo.repositories.StudentRepository;
import com.example.demo.models.Bill;
import com.example.demo.dtos.BillDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final UserService userService;
    private final StudentRepository studentRepository;

    public BillService(BillRepository billRepository, UserService userService, StudentRepository studentRepository) {
        this.billRepository = billRepository;
        this.userService = userService;
        this.studentRepository = studentRepository;
    }

    public BillDTO toDTO(Bill bill) {
        BillDTO billDTO = new BillDTO();

        billDTO.setBillId(bill.getBillId());
        billDTO.setType(bill.getType().toString());
        billDTO.setAmount(bill.getAmount());
        billDTO.setIssuedOn(bill.getIssuedOn());
        billDTO.setStudentFacultyNumber(bill.getStudent().getFacultyNumber());
        billDTO.setIsPaid(bill.getIsPaid());

        return billDTO;
    }

    @Transactional
    public Long generateBillId() {
        Long maxBillId = billRepository.findMaxBillId();

        if (maxBillId == null || maxBillId <= 0) return 1L;

        return maxBillId + 1;
    }

    public Bill toEntity(BillDTO billDTO) {
        Bill bill = new Bill();

        Long billId = generateBillId();
        bill.setBillId(billId);
        bill.setType(Bill.Type.valueOf(billDTO.getType().trim().toUpperCase()));
        bill.setAmount(billDTO.getAmount().doubleValue());
        bill.setIssuedOn(LocalDateTime.now());

        Optional<Student> studentOptional = studentRepository.findStudentByFacultyNumber(billDTO.getStudentFacultyNumber());
        Student student = studentOptional.get();
        bill.setStudent(student);
        bill.setIsPaid(false);

        return bill;
    }

    public List<BillDTO> searchBills(String id, String type, String issuedOn, String facultyNumber, Boolean isPaid) {
        userService.checkIfStudent(facultyNumber);

        id = userService.transformParameter(id);

        type = userService.transformParameter(type);
        if (type != null) type.toUpperCase();

        issuedOn = userService.transformParameter(issuedOn);
        facultyNumber = userService.transformParameter(facultyNumber);

        List<Bill> bills = billRepository.searchBills(id, type, issuedOn, facultyNumber, isPaid);

        List<BillDTO> billDTOS = new ArrayList<>();
        if (!bills.isEmpty()) {
            for (Bill bill : bills) {
                billDTOS.add(toDTO(bill));
            }
        }

        return billDTOS;
    }

    public BillDTO getBillById(Long id) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid ID");

        Optional<Bill> billOptional = billRepository.findBillByBillId(id);
        if (billOptional.isEmpty()) throw new EntityNotFoundException("Bill not found");

        BillDTO billDTO = toDTO(billOptional.get());

        return billDTO;
    }

    public BillDTO updateBillStatus(Long billId, Boolean isPaid) {
        if (billId == null || billId <= 0) throw new IllegalArgumentException("Invalid bill ID");
        if (isPaid == null) throw new IllegalArgumentException("New status cannot be null");

        Optional<Bill> billOptional = billRepository.findBillByBillId(billId);

        if (billOptional.isEmpty()) throw new EntityNotFoundException("Bill not found");

        Bill bill = billOptional.get();
        bill.setIsPaid(isPaid);

        billRepository.save(bill);

        return toDTO(bill);
    }

    public List<BillDTO> getBillsOfStudent(String facultyNumber) {
        if (facultyNumber == null || facultyNumber.trim().isEmpty())
            throw new IllegalArgumentException("Faculty number should have value");

        List<Bill> bills = billRepository.findAllByStudent_FacultyNumber(facultyNumber);

        if (bills.isEmpty()) throw new EntityNotFoundException("Bills not found");

        List<BillDTO> billDTOS = new ArrayList<>();
        for (Bill bill : bills) {
            billDTOS.add(toDTO(bill));
        }

        return billDTOS;
    }

    public BillDTO createBill(BillDTO billDTO) {
        if (billDTO == null) throw new IllegalArgumentException("No data to create new bill with");

        Bill bill = toEntity(billDTO);
        billRepository.save(bill);

        return toDTO(bill);
    }

    public void deleteBillByBillId(Long id) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid bill ID");

        Optional<Bill> billOptional = billRepository.findBillByBillId(id);
        if (billOptional.isEmpty()) throw new EntityNotFoundException("Bill not found");

        Bill bill = billOptional.get();
        billRepository.delete(bill);
    }

    public int getCountOfUnpaidBills() {
        return billRepository.countBillsByIsPaid(false);
    }

    public int getCountOfStudentUnpaidBills(String facultyNumber) {
        userService.checkIfStudent(facultyNumber);

        return billRepository.countBillsByIsPaidAndStudent_FacultyNumber(false, facultyNumber);
    }
}
