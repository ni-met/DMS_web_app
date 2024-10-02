package com.example.demo.repositories;

import com.example.demo.models.Record;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecordRepository extends JpaRepository<Record, Long> {
    Optional<Record> findRecordByRecordId(Long id);

    Optional<Record> findRecordByPeriod(String period);
    Optional<Record> findTopByIsActiveOrderByCreatedOnDesc(boolean isActive);

    Optional<Record> findTopByOrderByCreatedOnDesc();

    @Query("SELECT r FROM Record r " +
            "WHERE " +
            "(:id IS NULL OR CAST(r.recordId AS string) LIKE :id%) AND " +
            "(:period IS NULL OR r.period LIKE %:period%) AND " +
            "(:isActive IS NULL OR r.isActive = :isActive)" +
            "ORDER BY r.createdOn DESC")
    List<Record> searchRecords(@Param("id") String id,
                               @Param("period") String period,
                               @Param("isActive") Boolean isActive);

    @Query("SELECT MAX(r.recordId) FROM Record r")
    Long findMaxRecordId();

    List<Record> findAll(Sort sort);

}
