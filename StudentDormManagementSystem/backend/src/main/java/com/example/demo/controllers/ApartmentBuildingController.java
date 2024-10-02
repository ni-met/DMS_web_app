package com.example.demo.controllers;

import com.example.demo.dtos.ApartmentBuildingDTO;
import com.example.demo.services.ApartmentBuildingService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apartment-buildings")
public class ApartmentBuildingController {
    private final ApartmentBuildingService apartmentBuildingService;

    public ApartmentBuildingController(ApartmentBuildingService apartmentBuildingService) {
        this.apartmentBuildingService = apartmentBuildingService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllApartmentBuildings(@RequestParam(name = "movingPeople") Integer movingPeople) {
        try {
            List<ApartmentBuildingDTO> apartmentBuildingDTOS = apartmentBuildingService.getAllApartmentBuildings(movingPeople);

            if (apartmentBuildingDTOS.isEmpty())
                return ResponseEntity.status(404).body("Apartment buildings not found");

            return ResponseEntity.ok(apartmentBuildingDTOS);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{apartmentBuildingId}")
    public ResponseEntity<?> getApartmentBuilding(@PathVariable(name = "apartmentBuildingId") Long id, @RequestParam(name = "movingPeople") Integer movingPeople) {
        try {
            ApartmentBuildingDTO apartmentBuildingDTO = apartmentBuildingService.getApartmentBuildingDTOById(id, movingPeople);

            if (apartmentBuildingDTO == null) return ResponseEntity.status(404).body("Apartment building not found");

            return ResponseEntity.ok(apartmentBuildingDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
