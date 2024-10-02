package com.example.demo.repositories;

import com.example.demo.models.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {

    Optional<Specialty> findSpecialtyByName(String name);

    List<Specialty> findAllByFaculty_Name(String name);

}
