package com.example.demo.services;

import com.example.demo.repositories.ApartmentBuildingRepository;
import com.example.demo.models.ApartmentBuilding;
import com.example.demo.dtos.ApartmentBuildingDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ApartmentBuildingService {
    private final ApartmentBuildingRepository apartmentBuildingRepository;
    private final RoomService roomService;

    public ApartmentBuildingService(ApartmentBuildingRepository apartmentBuildingRepository, RoomService roomService) {
        this.apartmentBuildingRepository = apartmentBuildingRepository;
        this.roomService = roomService;
    }

    public ApartmentBuildingDTO toDTO(ApartmentBuilding apartmentBuilding, int movingPeople) {
        ApartmentBuildingDTO apartmentBuildingDTO = new ApartmentBuildingDTO();

        apartmentBuildingDTO.setApartmentBuildingId(apartmentBuilding.getApartmentBuildingId());
        apartmentBuildingDTO.setNumber(apartmentBuilding.getNumber());
        apartmentBuildingDTO.setEntrance(apartmentBuilding.getEntrance());
        apartmentBuildingDTO.setAvailableRoomsCount(roomService.getCountOfRoomsInBuilding(apartmentBuilding.getApartmentBuildingId(), movingPeople));

       return apartmentBuildingDTO;
    }

    public List<ApartmentBuildingDTO> getAllApartmentBuildings(int movingPeople) {
        if (movingPeople > 2 && movingPeople < 1)
            throw new IllegalArgumentException("Moving people can either be one or two");

        List<ApartmentBuilding> apartmentBuildings = apartmentBuildingRepository.findAll();
        apartmentBuildings = apartmentBuildings.subList(1, apartmentBuildings.size());

        if (apartmentBuildings.isEmpty()) throw new EntityNotFoundException("Apartment buildings not found");

        List<ApartmentBuildingDTO> apartmentBuildingDTOS = new ArrayList<>();
        for (ApartmentBuilding apartmentBuilding : apartmentBuildings) {
            apartmentBuildingDTOS.add(toDTO(apartmentBuilding, movingPeople));
        }

        return apartmentBuildingDTOS;
    }

    public ApartmentBuildingDTO getApartmentBuildingDTOById(Long id, int movingPeople) {
        if (movingPeople > 2 && movingPeople < 1)
            throw new IllegalArgumentException("Moving people can either be one or two");

        Optional<ApartmentBuilding> apartmentBuildingOptional = apartmentBuildingRepository.findApartmentBuildingByApartmentBuildingId(id);

        if (apartmentBuildingOptional.isEmpty()) throw new EntityNotFoundException("Apartment building not found");

        ApartmentBuildingDTO apartmentBuildingDTO = toDTO(apartmentBuildingOptional.get(), movingPeople);

        return apartmentBuildingDTO;
    }
}
