package com.example.demo.repositories;

import com.example.demo.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findRoomByRoomId(Long id);

    Optional<Room> findRoomByNumberAndApartmentBuilding_NumberAndApartmentBuilding_Entrance(Integer roomNumber,
                                                                                            Integer apartmentBuildingNumber,
                                                                                            Character apartmentBuildingEntrance);


    List<Room> getRoomsByCapacityGreaterThanEqual(int movingPeople);

    @Query("SELECT SUM(r.capacity) FROM Room r WHERE r.capacity >= 1")
    int getAvailableCapacity();

    @Query("SELECT r FROM Room r " +
            "LEFT JOIN r.apartmentBuilding ap " +
            "WHERE " +
            "(:apartmentBuilding IS NULL OR CONCAT(ap.number, COALESCE(ap.entrance, '')) LIKE CONCAT('%', :apartmentBuilding, '%')) AND " +
            "(:roomNumber IS NULL OR CAST(r.number AS string) LIKE :roomNumber%) " +
            "ORDER BY r.roomId")
    List<Room> searchRooms(@Param("roomNumber") String roomNumber,
                           @Param("apartmentBuilding") String apartmentBuilding);

    List<Room> findRoomsByApartmentBuilding_ApartmentBuildingIdAndCapacityGreaterThanEqual(Long apartmentBuildingId, Integer movingPeople);

    int countRoomsByCapacityGreaterThanEqual(int capacity);

    Integer countRoomsByApartmentBuilding_IdAndCapacityGreaterThanEqual(Long apartmentBuildingId, int movingPeople);

    List<Room> findRoomsByApartmentBuilding_ApartmentBuildingId(Long apartmentBuildingId);
}
