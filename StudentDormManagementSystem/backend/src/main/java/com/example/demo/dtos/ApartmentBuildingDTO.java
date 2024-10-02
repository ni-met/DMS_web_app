package com.example.demo.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApartmentBuildingDTO {
    private Long apartmentBuildingId;
    private Integer number;
    private Character entrance;
    private Integer availableRoomsCount;
}
