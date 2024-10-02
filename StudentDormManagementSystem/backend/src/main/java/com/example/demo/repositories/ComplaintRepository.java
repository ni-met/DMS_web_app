package com.example.demo.repositories;

import com.example.demo.models.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findComplaintByComplaintId(Long id);

    List<Complaint> findAllByStudent_FacultyNumber(String facultyNumber);

    @Query("SELECT MAX(c.complaintId) FROM Complaint c")
    Long findMaxComplaintId();

    @Query("SELECT c FROM Complaint c " +
            "JOIN c.student st " +
            "WHERE " +
            "(:id IS NULL OR CAST(c.complaintId AS string) LIKE :id%) AND " +
            "(:title IS NULL OR CAST(c.title AS string) LIKE :title%) AND " +
            "(:content IS NULL OR CAST(c.content AS string) LIKE :content%) AND " +
            "(:madeOn IS NULL OR CAST(c.madeOn AS string) LIKE :madeOn%) AND " +
            "(:facultyNumber IS NULL OR CAST(st.facultyNumber AS string) LIKE :facultyNumber%) AND " +
            "(:status IS NULL OR CAST(c.status AS string) LIKE :status%)" +
            "ORDER BY c.madeOn DESC")
    List<Complaint> searchComplaints(@Param("id") String id,
                                     @Param("title") String title,
                                     @Param("content") String content,
                                     @Param("madeOn") String madeOn,
                                     @Param("facultyNumber") String facultyNumber,
                                     @Param("status") String status);

    int countComplaintsByStatus(Complaint.Status status);

    int countComplaintsByStatusAndStudent_FacultyNumber(Complaint.Status status, String facultyNumber);
}
