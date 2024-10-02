package com.example.demo.repositories;

import com.example.demo.models.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    Optional<Bill> findBillByBillId(Long billId);

    List<Bill> findAllByStudent_FacultyNumber(String facultyNumber);

    int countBillsByIsPaid(boolean isPaid);

    int countBillsByIsPaidAndStudent_FacultyNumber(boolean isPaid, String facultyNumber);

    @Query("SELECT MAX(b.billId) FROM Bill b")
    Long findMaxBillId();

    @Query("SELECT b FROM Bill b " +
            "JOIN b.student st " +
            "WHERE " +
            "(:id IS NULL OR CAST(b.billId AS string) LIKE :id%) AND " +
            "(:type IS NULL OR CAST(b.type AS string) LIKE :type%) AND " +
            "(:issuedOn IS NULL OR CAST(b.issuedOn AS string) LIKE :issuedOn%) AND " +
            "(:facultyNumber IS NULL OR CAST(st.facultyNumber AS string) LIKE :facultyNumber%) AND " +
            "(:isPaid IS NULL OR CAST(b.isPaid AS string) LIKE :isPaid%)" +
            "ORDER BY b.issuedOn DESC")
    List<Bill> searchBills(@Param("id") String id,
                           @Param("type") String type,
                           @Param("issuedOn") String issuedOn,
                           @Param("facultyNumber") String facultyNumber,
                           @Param("isPaid") Boolean isPaid);
}
