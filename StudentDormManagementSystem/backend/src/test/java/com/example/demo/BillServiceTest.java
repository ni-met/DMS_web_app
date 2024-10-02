package com.example.demo;

import com.example.demo.models.Student;
import com.example.demo.models.User;
import com.example.demo.repositories.BillRepository;
import com.example.demo.repositories.StudentRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.BillService;
import com.example.demo.services.SpecialtyService;
import com.example.demo.services.UserService;
import com.example.demo.models.Specialty;
import com.example.demo.dtos.BillDTO;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class BillServiceTest {
    @Autowired
    private BillService billService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private SpecialtyService specialtyService;

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
        Specialty specialty = specialtyService.getSpecialtyByName("Информационни технологии в индустрията");
        student.setSpecialty(specialty);
        student.setCity("София");
        student.setGpa(5.25);

        userRepository.save(user);
        studentRepository.save(student);
    }

    @Test
    void testCreateBillSuccess() {
        BillDTO billDTO = new BillDTO();
        billDTO.setType("ТОК");
        billDTO.setAmount(23.25);
        billDTO.setStudentFacultyNumber(student.getFacultyNumber());
        billDTO.setIsPaid(false);

        BillDTO createdBill = billService.createBill(billDTO);

        assertNotNull(createdBill);
        assertEquals(billDTO.getType(), createdBill.getType());
        assertEquals(billDTO.getAmount(), createdBill.getAmount());
        assertEquals(billDTO.getStudentFacultyNumber(), createdBill.getStudentFacultyNumber());
        assertEquals(billDTO.getIsPaid(), createdBill.getIsPaid());
    }

    @Test
    void testCreateBillWithNullDTO() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            billService.createBill(null);
        });
        assertEquals("No data to create new bill with", exception.getMessage());
    }

    @Test
    void testGetBillByIdSuccess() {
        BillDTO billDTO = new BillDTO();
        billDTO.setBillId(1L);
        billDTO.setType("ТОК");
        billDTO.setAmount(23.25);
        billDTO.setStudentFacultyNumber(student.getFacultyNumber());
        billDTO.setIsPaid(false);

        BillDTO createdBill = billService.createBill(billDTO);

        BillDTO retrievedBill = billService.getBillById(createdBill.getBillId());

        assertNotNull(retrievedBill);
        assertEquals(createdBill.getType(), retrievedBill.getType());
        assertEquals(createdBill.getAmount(), retrievedBill.getAmount());
        assertEquals(createdBill.getStudentFacultyNumber(), retrievedBill.getStudentFacultyNumber());
        assertEquals(createdBill.getIssuedOn(), retrievedBill.getIssuedOn());
        assertEquals(createdBill.getIsPaid(), retrievedBill.getIsPaid());
    }

    @Test
    void testGetBillByIdWithInvalidId() {
        Long invalidBillId = 500L;

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            billService.getBillById(invalidBillId);
        });
        assertEquals("Bill not found", exception.getMessage());
    }

    @Test
    void testDeleteBillByBillIdSuccess() {
        BillDTO billDTO = new BillDTO();
        billDTO.setType("ТОК");
        billDTO.setAmount(23.50);
        billDTO.setStudentFacultyNumber(student.getFacultyNumber());
        billDTO.setIssuedOn(LocalDateTime.now());
        billDTO.setIsPaid(false);
        BillDTO createdBill = billService.createBill(billDTO);

        BillDTO billExists = billService.getBillById(createdBill.getBillId());
        assertNotNull(billExists);

        billService.deleteBillByBillId(createdBill.getBillId());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            billService.getBillById(createdBill.getBillId());
        });
        assertEquals("Bill not found", exception.getMessage());
    }

    @Test
    void testDeleteBillByBillIdWithNonExistingBillId() {
        Long invalidBillId = 500L;

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            billService.getBillById(invalidBillId);
        });
        assertEquals("Bill not found", exception.getMessage());
    }

    @Test
    void testDeleteBillByBillIdWithInvalidId() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            billService.deleteBillByBillId(null);
        });
        assertEquals("Invalid bill ID", exception.getMessage());

        exception = assertThrows(IllegalArgumentException.class, () -> {
            billService.deleteBillByBillId(-1L);
        });
        assertEquals("Invalid bill ID", exception.getMessage());
    }

    @Test
    void testUpdateBillStatusSuccess() {
        BillDTO billDTO = new BillDTO();
        billDTO.setType("ВОДА");
        billDTO.setAmount(5.12);
        billDTO.setStudentFacultyNumber(student.getFacultyNumber());
        billDTO.setIssuedOn(LocalDateTime.now());
        billDTO.setIsPaid(false);
        BillDTO createdBill = billService.createBill(billDTO);

        BillDTO updatedBillDTO = billService.updateBillStatus(createdBill.getBillId(), true);

        assertNotNull(updatedBillDTO);
        assertEquals(true, updatedBillDTO.getIsPaid());
    }

    @Test
    void testUpdateBillStatusWithNullStatus() {
        BillDTO billDTO = new BillDTO();
        billDTO.setType("ВОДА");
        billDTO.setAmount(5.12);
        billDTO.setStudentFacultyNumber(student.getFacultyNumber());
        billDTO.setIssuedOn(LocalDateTime.now());
        billDTO.setIsPaid(false);
        BillDTO createdBill = billService.createBill(billDTO);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            billService.updateBillStatus(createdBill.getBillId(), null);
        });
        assertEquals("New status cannot be null", exception.getMessage());
    }

    @Test
    void testUpdateBillStatusWithInvalidId() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            billService.updateBillStatus(null, true);
        });
        assertEquals("Invalid bill ID", exception.getMessage());

        exception = assertThrows(IllegalArgumentException.class, () -> {
            billService.updateBillStatus(-1L, true);
        });
        assertEquals("Invalid bill ID", exception.getMessage());
    }

    @Test
    void testUpdateBillStatusWithNonExistentBill() {
        Long invalidBillId = 500L;

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            billService.updateBillStatus(invalidBillId, true);
        });
        assertEquals("Bill not found", exception.getMessage());
    }

    @Test
    void testGetBillsOfStudentWithValidFacultyNumberSuccess() {
        BillDTO bill1 = new BillDTO();
        bill1.setType("НОЩУВКА");
        bill1.setAmount(12.0);
        bill1.setIssuedOn(LocalDateTime.now());
        bill1.setStudentFacultyNumber(student.getFacultyNumber());
        bill1.setIsPaid(false);
        billService.createBill(bill1);

        BillDTO bill2 = new BillDTO();
        bill2.setType("ПАРНО");
        bill2.setAmount(16.70);
        bill2.setIssuedOn(LocalDateTime.now());
        bill2.setStudentFacultyNumber(student.getFacultyNumber());
        bill2.setIsPaid(false);
        billService.createBill(bill2);

        List<BillDTO> bills = billService.getBillsOfStudent(student.getFacultyNumber());

        assertNotNull(bills);
        assertEquals(2, bills.size());
        assertEquals(bill1.getStudentFacultyNumber(), bills.get(0).getStudentFacultyNumber());
        assertEquals(bill2.getStudentFacultyNumber(), bills.get(1).getStudentFacultyNumber());
        assertEquals(bill1.getType(), bills.get(0).getType());
        assertEquals(bill2.getType(), bills.get(1).getType());
        assertEquals(bill1.getAmount(), bills.get(0).getAmount());
        assertEquals(bill2.getAmount(), bills.get(1).getAmount());
        assertEquals(bill1.getIsPaid(), bills.get(0).getIsPaid());
        assertEquals(bill2.getIsPaid(), bills.get(1).getIsPaid());
    }

    @Test
    void testGetBillsOfStudentWithEmptyResult() {
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            billService.getBillsOfStudent(student.getFacultyNumber());
        });
        assertEquals("Bills not found", exception.getMessage());
    }

    @Test
    void testGetBillsOfStudentWithNullFacultyNumber() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            billService.getBillsOfStudent(null);
        });
        assertEquals("Faculty number should have value", exception.getMessage());
    }

    @Test
    void testGetBillsOfStudentWithInvalidStudentFacultyNumber() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            billService.getBillsOfStudent("");
        });
        assertEquals("Faculty number should have value", exception.getMessage());
    }
}
