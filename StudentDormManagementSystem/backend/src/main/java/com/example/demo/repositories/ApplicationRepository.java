package com.example.demo.repositories;

import com.example.demo.models.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findAllByRecord_RecordId(Long recordId);

    int countAllByRecord_RecordId(Long recordId);

    Optional<Application> findApplicationByApplicationId(Long id);

    int countApplicationsByTypeAndStatus(Application.Type type, Application.Status status);

    @Query("SELECT MAX(a.applicationId) FROM Application a")
    Long findMaxApplicationId();

    @Query("SELECT a FROM Application a " +
            "JOIN a.student st " +
            "LEFT JOIN a.record r " +
            "WHERE " +
            "(:id IS NULL OR CAST(a.applicationId AS string) LIKE :id%) AND " +
            "(:type IS NULL OR CAST(a.type AS string) LIKE :type%) AND " +
            "(:appliedOn IS NULL OR CAST(a.appliedOn AS string) LIKE :appliedOn%) AND " +
            "(:status IS NULL OR CAST(a.status AS string) LIKE :status%) AND " +
            "(:facultyNumber IS NULL OR st.facultyNumber LIKE :facultyNumber%) AND " +
            "(:period IS NULL OR r.period LIKE :period%)" +
            "ORDER BY a.appliedOn DESC")
    List<Application> searchApplications(@Param("id") String applicationId,
                                         @Param("type") String type,
                                         @Param("appliedOn") String appliedOn,
                                         @Param("status") String status,
                                         @Param("facultyNumber") String facultyNumber,
                                         @Param("period") String period);

    Optional<Application> findApplicationByRecord_RecordIdAndStudent_FacultyNumber(Long recordId, String facultyNumber);

    Optional<Application> findApplicationByTypeAndStatusAndStudent_FacultyNumber(Application.Type type, Application.Status status, String facultyNumber);
}
