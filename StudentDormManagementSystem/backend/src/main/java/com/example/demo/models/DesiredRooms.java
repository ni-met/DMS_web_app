package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "desired_rooms")
public class DesiredRooms {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "room1_id", referencedColumnName = "id")
    private Room room1;

    @ManyToOne
    @JoinColumn(name = "room2_id", referencedColumnName = "id")
    private Room room2;

    @ManyToOne
    @JoinColumn(name = "room3_id", referencedColumnName = "id")
    private Room room3;
}
