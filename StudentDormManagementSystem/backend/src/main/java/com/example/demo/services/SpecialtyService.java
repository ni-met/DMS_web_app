package com.example.demo.services;

import com.example.demo.repositories.SpecialtyRepository;
import com.example.demo.models.Specialty;
import com.example.demo.dtos.SpecialtyDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SpecialtyService {
    private final SpecialtyRepository specialtyRepository;

    public SpecialtyService(SpecialtyRepository specialtyRepository) {
        this.specialtyRepository = specialtyRepository;
    }

    public SpecialtyDTO toDTO(Specialty specialty) {
        SpecialtyDTO specialtyDTO = new SpecialtyDTO();

        specialtyDTO.setName(specialty.getName());
        specialtyDTO.setFaculty(specialty.getFaculty().getName());

        return specialtyDTO;
    }

    public List<SpecialtyDTO> getSpecialtiesByFacultyName(String facultyName) {
        if (facultyName.trim().isEmpty() || facultyName == null)
            throw new IllegalArgumentException("Faculty name cannot be null");

        List<Specialty> specialties = specialtyRepository.findAllByFaculty_Name(facultyName);

        if (specialties.isEmpty()) throw new EntityNotFoundException("Specialties not found");

        List<SpecialtyDTO> specialtyDTOS = new ArrayList<>();
        for (Specialty specialty : specialties) {
            specialtyDTOS.add(toDTO(specialty));
        }

        return specialtyDTOS;
    }

    public Specialty getSpecialtyByName(String name) {
        if (name == null || name.trim().isEmpty()) throw new IllegalArgumentException("Faculty name should have value");

        Optional<Specialty> specialtyOptional = specialtyRepository.findSpecialtyByName(name);
        if (specialtyOptional.isEmpty()) throw new EntityNotFoundException("Specialty not found");
        Specialty specialty = specialtyOptional.get();

        return specialty;
    }
}
