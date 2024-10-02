package com.example.demo.services;

import com.example.demo.repositories.FacultyRepository;
import com.example.demo.models.Faculty;
import com.example.demo.dtos.FacultyDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FacultyService {
    private final FacultyRepository facultyRepository;

    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    public FacultyDTO toDTO(Faculty faculty) {
        FacultyDTO facultyDTO = new FacultyDTO();

        facultyDTO.setName(faculty.getName());

        return facultyDTO;
    }

    public List<FacultyDTO> getAllFaculties() {
        List<Faculty> allFaculties = facultyRepository.findAll();

        if (allFaculties.isEmpty()) throw new EntityNotFoundException("Faculties not found");

        List<FacultyDTO> facultyDTOS = new ArrayList<>();
        for (Faculty faculty : allFaculties) {
            facultyDTOS.add(toDTO(faculty));
        }

        return facultyDTOS;
    }

    public Faculty getFacultyByName(String name) {
        if (name == null || name.trim().isEmpty()) throw new IllegalArgumentException("Faculty name should have value");

        Optional<Faculty> facultyOptional = facultyRepository.findFacultyByName(name);
        if (facultyOptional.isEmpty()) throw new EntityNotFoundException("Faculty not found");
        Faculty faculty = facultyOptional.get();

        return faculty;
    }
}
