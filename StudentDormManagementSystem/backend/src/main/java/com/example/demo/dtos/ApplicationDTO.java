package com.example.demo.dtos;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ApplicationDTO {
    private Long applicationId;
    private String type;
    private LocalDateTime appliedOn;
    private String status;
    private String studentFacultyNumber;
    private String friendFacultyNumber;
    private RoomDTO desiredRoom1;
    private RoomDTO desiredRoom2;
    private RoomDTO desiredRoom3;
    private String recordPeriod;
}
