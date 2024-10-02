package com.example.demo.repositories;

import com.example.demo.models.ApartmentBuilding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApartmentBuildingRepository extends JpaRepository<ApartmentBuilding, Long> {
    Optional<ApartmentBuilding> findApartmentBuildingByApartmentBuildingId(Long id);
}
