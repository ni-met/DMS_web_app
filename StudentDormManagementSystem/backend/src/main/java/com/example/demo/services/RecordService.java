package com.example.demo.services;

import com.example.demo.dtos.RecordDTO;
import com.example.demo.models.Record;
import com.example.demo.repositories.RecordRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RecordService {
    private final RecordRepository recordRepository;
    private final UserService userService;

    public RecordService(RecordRepository recordRepository, UserService userService) {
        this.recordRepository = recordRepository;
        this.userService = userService;
    }

    public RecordDTO toDTO(Record record) {
        RecordDTO recordDTO = new RecordDTO();

        recordDTO.setRecordId(record.getRecordId());
        recordDTO.setPeriod(record.getPeriod());
        recordDTO.setIsActive(record.getIsActive());
        recordDTO.setCreatedOn(record.getCreatedOn());

        return recordDTO;
    }

    @Transactional
    public Long generateRecordId() {
        Long maxRecordId = recordRepository.findMaxRecordId();

        if (maxRecordId == null || maxRecordId <= 0) return 1L;

        return maxRecordId + 1;
    }

    public Record toEntity(RecordDTO recordDTO) {
        Record record = new Record();

        Long recordId = generateRecordId();
        record.setRecordId(recordId);
        record.setPeriod(recordDTO.getPeriod());
        record.setIsActive(false);
        record.setCreatedOn(LocalDateTime.now());

        return record;
    }

    public List<RecordDTO> searchRecords(String id, String period, Boolean isActive) {
        id = userService.transformParameter(id);
        period = userService.transformParameter(period);

        List<Record> records = recordRepository.searchRecords(id, period, isActive);

        List<RecordDTO> recordDTOS = new ArrayList<>();
        if (!records.isEmpty()) {
            for (Record record : records) {
                recordDTOS.add(toDTO(record));
            }
        }

        return recordDTOS;
    }

    public RecordDTO getRecordByRecordId(Long id) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid record ID");

        Optional<Record> recordOptional = recordRepository.findRecordByRecordId(id);
        if (recordOptional.isEmpty()) throw new EntityNotFoundException("Record not found");

        RecordDTO recordDTO = toDTO(recordOptional.get());

        return recordDTO;
    }

    public RecordDTO updateRecordStatus(Long id, Boolean isActive) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid record ID");
        if (isActive == null) throw new IllegalArgumentException("New status cannot be null");

        Optional<Record> recordOptional = recordRepository.findRecordByRecordId(id);

        if (recordOptional.isEmpty()) throw new EntityNotFoundException("Record not found");

        Record currentRecord = recordOptional.get();

        if (isActive == true) {
            currentRecord.setIsActive(true);
        } else {
            currentRecord.setIsActive(false);
        }

        Record updatedRecord = recordRepository.save(currentRecord);
        RecordDTO updatedRecordDTO = toDTO(updatedRecord);

        return updatedRecordDTO;
    }

    public Record getLatestActiveRecord() {
        Optional<Record> recordOptional = recordRepository.findTopByIsActiveOrderByCreatedOnDesc(true);
        if (recordOptional.isEmpty()) throw new EntityNotFoundException("Latest record not found");

        Record record = recordOptional.get();
        return record;
    }

    public RecordDTO getLatestRecord() {
        Optional<Record> recordOptional = recordRepository.findTopByOrderByCreatedOnDesc();

        if (recordOptional.isEmpty()) throw new EntityNotFoundException("Record not found");

        RecordDTO recordDTO = toDTO(recordOptional.get());
        return recordDTO;
    }

    public RecordDTO getRecordByPeriod(String period) {
        if (period == null || period.trim().isEmpty())
            throw new IllegalArgumentException("Period should have value");

        Optional<Record> recordOptional = recordRepository.findRecordByPeriod(period);
        if (recordOptional.isEmpty()) throw new EntityNotFoundException("Record not found");

        RecordDTO recordDTO = toDTO(recordOptional.get());

        return recordDTO;
    }

    @Transactional
    public RecordDTO createRecord(RecordDTO recordDTO) {
        if (recordDTO == null) throw new IllegalArgumentException("No data to create new record with");

        Record record = toEntity(recordDTO);
        recordRepository.save(record);

        return toDTO(record);
    }

    @Transactional
    public void deleteRecordByRecordId(Long id) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid record ID");

        Optional<Record> recordOptional = recordRepository.findRecordByRecordId(id);

        if (recordOptional.isEmpty()) throw new EntityNotFoundException("Record not found");

        Record record = recordOptional.get();
        recordRepository.delete(record);
    }

    public List<RecordDTO> getAllRecords() {
        List<Record> allRecords = recordRepository.findAll(Sort.by(Sort.Direction.DESC, "createdOn"));

        if (allRecords.isEmpty()) throw new EntityNotFoundException("Records not found");

        List<RecordDTO> recordDTOS = new ArrayList<>();
        for (Record record : allRecords) {
            recordDTOS.add(toDTO(record));

        }

        return recordDTOS;
    }

}
