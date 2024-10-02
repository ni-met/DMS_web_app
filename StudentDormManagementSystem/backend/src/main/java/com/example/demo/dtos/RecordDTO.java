package com.example.demo.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RecordDTO {
    private Long recordId;
    private String period;
    private Boolean isActive;
    private LocalDateTime createdOn;
}
