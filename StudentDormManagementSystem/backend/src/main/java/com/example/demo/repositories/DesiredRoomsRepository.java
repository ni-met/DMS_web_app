package com.example.demo.repositories;

import com.example.demo.models.DesiredRooms;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DesiredRoomsRepository extends JpaRepository<DesiredRooms, Long> {

}
