package com.example.demo.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomDTO {
    private Long roomId;
    private Integer number;
    private Integer capacity;
    private Long apartmentBuildingId;
    private Integer apartmentBuildingNumber;
    private Character apartmentBuildingEntrance;
}
