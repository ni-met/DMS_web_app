package com.example.demo.services;

import com.example.demo.dtos.RoomDTO;
import com.example.demo.models.ApartmentBuilding;
import com.example.demo.models.Room;
import com.example.demo.repositories.ApartmentBuildingRepository;
import com.example.demo.repositories.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Map.Entry;
import java.util.AbstractMap.SimpleEntry;
import java.util.*;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final ApartmentBuildingRepository apartmentBuildingRepository;
    private final UserService userService;

    public RoomService(RoomRepository roomRepository, ApartmentBuildingRepository apartmentBuildingRepository, UserService userService) {
        this.roomRepository = roomRepository;
        this.apartmentBuildingRepository = apartmentBuildingRepository;
        this.userService = userService;
    }

    private final Random random = new Random();

    public Room getRandomAvailableRoom(int movingPeople) {
        List<Room> availableRooms = roomRepository.getRoomsByCapacityGreaterThanEqual(movingPeople);
        if (availableRooms.isEmpty()) throw new EntityNotFoundException("Available rooms not found");

        Room randomRoom = availableRooms.get(random.nextInt(availableRooms.size()));

        return randomRoom;
    }

    public RoomDTO toDTO(Room room) {
        RoomDTO roomDTO = new RoomDTO();

        roomDTO.setRoomId(room.getRoomId());
        roomDTO.setNumber(room.getNumber());
        roomDTO.setCapacity(room.getCapacity());
        roomDTO.setApartmentBuildingId(room.getApartmentBuilding().getApartmentBuildingId());
        roomDTO.setApartmentBuildingNumber(room.getApartmentBuilding().getNumber());
        roomDTO.setApartmentBuildingEntrance(room.getApartmentBuilding().getEntrance());

        return roomDTO;
    }

    public Entry<List<Room>, Integer> showAvailableRooms(int movingPeople) {
        List<Room> availableRooms;

        if (movingPeople > 1) {
            availableRooms = roomRepository.getRoomsByCapacityGreaterThanEqual(2);

            if (availableRooms.isEmpty()) {
                availableRooms = roomRepository.getRoomsByCapacityGreaterThanEqual(1);

                movingPeople = 1;
            }
        } else {
            availableRooms = roomRepository.getRoomsByCapacityGreaterThanEqual(1);
        }
        return new SimpleEntry<>(availableRooms, movingPeople);
    }

    public List<RoomDTO> searchForRooms(String roomNumber, String apartmentBuilding) {
        if (roomNumber.trim().equals("0"))
            throw new IllegalArgumentException("Room number should have value");
        if (apartmentBuilding.trim().equals("0"))
            throw new IllegalArgumentException("Apartment building number should have value");

        roomNumber = userService.transformParameter(roomNumber);
        apartmentBuilding = userService.transformParameter(apartmentBuilding);

        List<Room> rooms = roomRepository.searchRooms(roomNumber, apartmentBuilding);

        List<RoomDTO> roomDTOS = new ArrayList<>();
        if (!rooms.isEmpty()) {
            for (Room room : rooms) {
                roomDTOS.add(toDTO(room));
            }
        }

        return roomDTOS;
    }

    public RoomDTO getRoomDTOById(Long id) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid room ID");

        Optional<Room> roomOptional = roomRepository.findRoomByRoomId(id);

        if (roomOptional.isEmpty()) throw new EntityNotFoundException("Room not found");

        RoomDTO roomDTO = toDTO(roomOptional.get());

        return roomDTO;
    }

    public Room getRoomById(Long id) {
        if (id == null || id < 0) throw new IllegalArgumentException("Invalid room ID");

        Optional<Room> roomOptional = roomRepository.findRoomByRoomId(id);
        if (roomOptional.isEmpty()) throw new EntityNotFoundException("Room not found");

        Room room = roomOptional.get();
        return room;
    }

    public RoomDTO updateRoomCapacity(Long roomId, Integer capacity) {
        if (roomId == null || roomId <= 0) throw new IllegalArgumentException("Invalid room ID");
        if (capacity == null || capacity < 0 || capacity > 4)
            throw new IllegalArgumentException("Invalid new capacity");

        Optional<Room> roomOptional = roomRepository.findRoomByRoomId(roomId);

        if (roomOptional.isEmpty()) throw new EntityNotFoundException("Room not found");

        Room room = roomOptional.get();
        room.setCapacity(capacity);

        roomRepository.save(room);

        return toDTO(room);
    }

    public List<RoomDTO> getAvailableRoomsInBuilding(Long apartmentBuildingId, Integer movingPeople) {
        if (apartmentBuildingId == null || apartmentBuildingId <= 0)
            throw new IllegalArgumentException("Invalid apartment building ID");
        if (movingPeople < 1 || movingPeople > 2)
            throw new IllegalArgumentException("Moving people can either be one or two");

        Optional<ApartmentBuilding> apartmentBuildingOptional = apartmentBuildingRepository.findApartmentBuildingByApartmentBuildingId(apartmentBuildingId);

        if (apartmentBuildingOptional.isEmpty()) throw new EntityNotFoundException("Apartment building not found");

        List<Room> availableRooms = roomRepository
                .findRoomsByApartmentBuilding_ApartmentBuildingIdAndCapacityGreaterThanEqual(apartmentBuildingId, movingPeople);

        if (availableRooms.isEmpty()) throw new EntityNotFoundException("Available rooms not found");

        List<RoomDTO> roomDTOS = new ArrayList<>();
        for (Room room : availableRooms) {
            roomDTOS.add(toDTO(room));
        }

        return roomDTOS;
    }

    public List<RoomDTO> getAllRoomsInBuilding(Long apartmentBuildingId) {
        List<Room> allRooms = roomRepository.findRoomsByApartmentBuilding_ApartmentBuildingId(apartmentBuildingId);

        if (allRooms.isEmpty()) throw new EntityNotFoundException("Room not found");

        List<RoomDTO> roomDTOS = new ArrayList<>();
        if (!allRooms.isEmpty()) {
            for (Room room : allRooms) {
                roomDTOS.add(toDTO(room));
            }
        }

        return roomDTOS;
    }

    public Room findRoomByNumberAndApartmentBuilding(Integer roomNumber, Integer apartmentBuildingNumber, Character apartmentBuildingEntrance) {
        Optional<Room> roomOptional = roomRepository.findRoomByNumberAndApartmentBuilding_NumberAndApartmentBuilding_Entrance(roomNumber, apartmentBuildingNumber, apartmentBuildingEntrance);

        if (roomOptional.isEmpty()) throw new EntityNotFoundException("Room not found");
        Room room = roomOptional.get();

        return room;
    }

    public int getCountOfAvailableRooms() {
        return roomRepository.countRoomsByCapacityGreaterThanEqual(1);
    }

    public Integer getCountOfRoomsInBuilding(Long apartmentBuildingId, int movingPeople) {
        return roomRepository.countRoomsByApartmentBuilding_IdAndCapacityGreaterThanEqual(apartmentBuildingId, movingPeople);
    }
}
