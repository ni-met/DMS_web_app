package com.example.demo.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BillDTO {
    private Long billId;
    private String type;
    private Double amount;
    private LocalDateTime issuedOn;
    private String studentFacultyNumber;
    private Boolean isPaid;
}
