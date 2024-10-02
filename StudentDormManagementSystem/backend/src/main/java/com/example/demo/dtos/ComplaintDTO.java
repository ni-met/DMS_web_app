package com.example.demo.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ComplaintDTO {
    private Long complaintId;
    private String title;
    private String content;
    private LocalDateTime madeOn;
    private String facultyNumber;
    private String status;
}
