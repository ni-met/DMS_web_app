package com.example.demo.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentDTO {
    private String email;
    private String firstName;
    private String lastName;
    private String facultyNumber;
    private String phoneNumber;
    private Integer semester;
    private String specialty;
    private String faculty;
    private Integer room;
    private Long roomId;
    private String city;
    private Double gpa;
    private Long apartmentBuildingId;
    private Integer apartmentBuildingNumber;
    private Character apartmentBuildingEntrance;
}

