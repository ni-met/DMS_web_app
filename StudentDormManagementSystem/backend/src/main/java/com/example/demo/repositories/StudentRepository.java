package com.example.demo.repositories;

import com.example.demo.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findStudentByUser_Email(String email);

    Optional<Student> findStudentByFacultyNumber(String facultyNumber);

    Optional<Student> findStudentByPhoneNumber(String phoneNumber);

    @Query("SELECT st FROM Student st " +
            "JOIN st.user u " +
            "JOIN st.specialty sp " +
            "JOIN sp.faculty fa " +
            "LEFT JOIN st.room r " +
            "LEFT JOIN r.apartmentBuilding ap " +
            "WHERE " +
            "(:email IS NULL OR u.email LIKE %:email%) AND " +
            "(:fullName IS NULL OR CONCAT(u.firstName, ' ', u.lastName) LIKE %:fullName%) AND " +
            "(:facultyNumber IS NULL OR st.facultyNumber LIKE %:facultyNumber%) AND " +
            "(:phoneNumber IS NULL OR st.phoneNumber LIKE %:phoneNumber%) AND " +
            "(:faculty IS NULL OR fa.name LIKE %:faculty%) AND " +
            "(:specialty IS NULL OR sp.name LIKE %:specialty%) AND " +
            "(:semester IS NULL OR st.semester = :semester) AND " +
            "(:apartmentBuilding IS NULL OR CONCAT(ap.number, COALESCE(ap.entrance, '')) LIKE CONCAT('%', :apartmentBuilding, '%')) AND " +
            "(:room IS NULL OR CAST(r.number AS string) LIKE :room%) AND " +
            "(:city IS NULL OR st.city LIKE %:city%) AND " +
            "(:gpa IS NULL OR CAST(st.gpa AS string) LIKE :gpa%)")
    List<Student> searchStudents(@Param("email") String email,
                                 @Param("fullName") String fullName,
                                 @Param("facultyNumber") String facultyNumber,
                                 @Param("faculty") String faculty,
                                 @Param("specialty") String specialty,
                                 @Param("semester") Integer semester,
                                 @Param("phoneNumber") String phoneNumber,
                                 @Param("apartmentBuilding") String apartmentBuilding,
                                 @Param("room") Integer room,
                                 @Param("city") String city,
                                 @Param("gpa") String gpa);

    @Query("SELECT COUNT(s) FROM Student s WHERE s.room.id IS NOT NULL")
    int countStudentsWithARoom();
}
