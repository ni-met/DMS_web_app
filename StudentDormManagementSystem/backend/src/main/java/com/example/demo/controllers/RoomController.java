package com.example.demo.controllers;

import com.example.demo.dtos.RoomDTO;
import com.example.demo.services.RoomService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchForRooms(@RequestParam(required = false) String roomNumber,
                                            @RequestParam(required = false) String apartmentBuilding) {
        try {
            List<RoomDTO> roomDTOS = roomService.searchForRooms(roomNumber, apartmentBuilding);
            if (roomDTOS.isEmpty()) return ResponseEntity.status(404).body("Rooms not found");

            return ResponseEntity.ok(roomDTOS);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/available")
    public ResponseEntity<?> getCountOfAvailableRooms() {
        int count = roomService.getCountOfAvailableRooms();

        return ResponseEntity.ok(count);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomByRoomId(@PathVariable(name = "id") Long id) {
        try {
            RoomDTO roomDTO = roomService.getRoomDTOById(id);
            if (roomDTO == null) return ResponseEntity.status(404).body("Room not found");

            return ResponseEntity.ok(roomDTO);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/show-available")
    public ResponseEntity<?> getAvailableRoomsInBuilding(
            @RequestParam(name = "apartmentBuildingId") Long apartmentBuildingId,
            @RequestParam(name = "movingPeople") Integer movingPeople) {

        try {
            List<RoomDTO> roomDTOS = roomService.getAvailableRoomsInBuilding(apartmentBuildingId, movingPeople);
            if (roomDTOS.isEmpty()) return ResponseEntity.status(404).body("Available rooms not found");

            return ResponseEntity.ok(roomDTOS);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoomCapacity(@PathVariable(name = "id") Long id,
                                                @RequestParam(name = "capacity") Integer capacity) {
        try {
            RoomDTO updatedRoomDTO = roomService.updateRoomCapacity(id, capacity);
            if (updatedRoomDTO == null) return ResponseEntity.status(404).body("Room not found");

            return ResponseEntity.ok(updatedRoomDTO);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/in-building/{apartmentBuildingId}")
    public ResponseEntity<?> getAllRoomsInBuilding(@PathVariable(name = "apartmentBuildingId") Long apartmentBuildingId) {
        try {
            List<RoomDTO> roomDTOS = roomService.getAllRoomsInBuilding(apartmentBuildingId);

            if (roomDTOS.isEmpty()) return ResponseEntity.status(404).body("Rooms not found");

            return ResponseEntity.ok(roomDTOS);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
