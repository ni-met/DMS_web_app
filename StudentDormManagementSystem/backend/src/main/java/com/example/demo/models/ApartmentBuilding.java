package com.example.demo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "apartment_buildings")
public class ApartmentBuilding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
    private Long id;

    @Column(name = "apartment_building_id", nullable = false, unique = true)
    private Long apartmentBuildingId;

    @Column(nullable = false)
    private Integer number;

    private Character entrance;

    @OneToMany(mappedBy = "apartmentBuilding")
    @JsonIgnore
    private List<Room> rooms;
}
