package com.example.demo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
    private Long id;

    @Column(name = "room_id", nullable = false, unique = true)
    private Long roomId;

    @Column(nullable = false)
    private Integer number;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @ManyToOne
    @JoinColumn(name = "apartment_building_id", referencedColumnName = "id", nullable = false)
    private ApartmentBuilding apartmentBuilding;

    @OneToMany(mappedBy = "room")
    @JsonIgnore
    private List<Student> students;

    @OneToMany(mappedBy = "room1")
    @JsonIgnore
    private List<DesiredRooms> room1;

    @OneToMany(mappedBy = "room2")
    @JsonIgnore
    private List<DesiredRooms> room2;

    @OneToMany(mappedBy = "room3")
    @JsonIgnore
    private List<DesiredRooms> room3;
}
