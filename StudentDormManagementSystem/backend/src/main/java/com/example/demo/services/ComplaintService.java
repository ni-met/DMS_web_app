package com.example.demo.services;

import com.example.demo.models.Student;
import com.example.demo.repositories.ComplaintRepository;
import com.example.demo.repositories.StudentRepository;
import com.example.demo.models.Complaint;
import com.example.demo.dtos.ComplaintDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final UserService userService;
    private final StudentRepository studentRepository;

    public ComplaintService(ComplaintRepository complaintRepository, UserService userService, StudentRepository studentRepository) {
        this.complaintRepository = complaintRepository;
        this.userService = userService;
        this.studentRepository = studentRepository;
    }

    @Transactional
    public Long generateComplaintId() {
        Long maxComplaintId = complaintRepository.findMaxComplaintId();

        if (maxComplaintId == null) return 1L;

        return maxComplaintId + 1;
    }

    public Complaint toEntity(ComplaintDTO complaintDTO) {
        Complaint complaint = new Complaint();

        Long complaintId = generateComplaintId();
        complaint.setComplaintId(complaintId);

        complaint.setTitle(complaintDTO.getTitle());
        complaint.setContent(complaintDTO.getContent());
        complaint.setMadeOn(LocalDateTime.now());

        Optional<Student> studentOptional = studentRepository.findStudentByFacultyNumber(complaintDTO.getFacultyNumber());
        Student student = studentOptional.get();
        complaint.setStudent(student);

        complaint.setStatus(Complaint.Status.ЗА_ПРЕГЛЕД);

        return complaint;
    }

    public ComplaintDTO toDTO(Complaint complaint) {
        ComplaintDTO complaintDTO = new ComplaintDTO();

        complaintDTO.setComplaintId(complaint.getComplaintId());
        complaintDTO.setTitle(complaint.getTitle());
        complaintDTO.setContent(complaint.getContent());
        complaintDTO.setMadeOn(complaint.getMadeOn());
        complaintDTO.setFacultyNumber(complaint.getStudent().getFacultyNumber());
        complaintDTO.setStatus(complaint.getStatus().toString());

        return complaintDTO;
    }

    public ComplaintDTO createComplaint(ComplaintDTO complaintDTO) {
        if (complaintDTO == null) throw new IllegalArgumentException("No data to create new complaint with");

        Optional<Student> studentOptional = studentRepository.findStudentByFacultyNumber(complaintDTO.getFacultyNumber());
        if (studentOptional.isEmpty()) throw new EntityNotFoundException("Student not found");

        Student student = studentOptional.get();

        complaintDTO.setFacultyNumber(student.getFacultyNumber());
        Complaint complaint = toEntity(complaintDTO);

        complaintRepository.save(complaint);
        return toDTO(complaint);
    }

    public List<ComplaintDTO> searchComplaints(String id, String title, String content, String madeOn,
                                               String facultyNumber, String status) {
        id = userService.transformParameter(id);
        title = userService.transformParameter(title);
        content = userService.transformParameter(content);
        madeOn = userService.transformParameter(madeOn);
        facultyNumber = userService.transformParameter(facultyNumber);
        status = userService.transformParameter(status);

        List<Complaint> complaints = complaintRepository.searchComplaints(id, title, content, madeOn,
                facultyNumber, status);

        List<ComplaintDTO> complaintDTOS = new ArrayList<>();
        if (!complaints.isEmpty()) {
            for (Complaint complaint : complaints) {
                complaintDTOS.add(toDTO(complaint));
            }
        }

        return complaintDTOS;
    }

    public ComplaintDTO getComplaintById(Long id) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid ID");

        Optional<Complaint> complaintOptional = complaintRepository.findComplaintByComplaintId(id);

        if (complaintOptional.isEmpty()) throw new EntityNotFoundException("Complaint not found");

        ComplaintDTO complaintDTO = toDTO(complaintOptional.get());

        return complaintDTO;
    }

    public ComplaintDTO updateComplaintStatus(Long id, String status) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid ID");
        if (status == null) throw new IllegalArgumentException("New status cannot be null");

        Optional<Complaint> complaintOptional = complaintRepository.findComplaintByComplaintId(id);

        if (complaintOptional.isEmpty()) throw new EntityNotFoundException("Complaint not found");

        Complaint complaint = complaintOptional.get();

        status = status.trim().toUpperCase();
        switch (status) {
            case "ПРИЕТО":
                complaint.setStatus(Complaint.Status.ПРИЕТО);
                break;
            case "ОТХВЪРЛЕНО":
                complaint.setStatus(Complaint.Status.ОТХВЪРЛЕНО);
                break;
            case "ЗА_ПРЕГЛЕД":
                complaint.setStatus(Complaint.Status.ЗА_ПРЕГЛЕД);
                break;
            default:
                throw new IllegalArgumentException("New status is invalid");
        }

        complaintRepository.save(complaint);

        ComplaintDTO updatedComplaintDTO = toDTO(complaint);
        return updatedComplaintDTO;
    }

    public List<ComplaintDTO> getComplaintsOfStudent(String facultyNumber) {
        if (facultyNumber.trim().isEmpty() || facultyNumber == null)
            throw new IllegalArgumentException("Faculty number cannot be null");

        List<Complaint> complaints = complaintRepository.findAllByStudent_FacultyNumber(facultyNumber);

        if (complaints.isEmpty()) throw new EntityNotFoundException("Complaints not found");

        List<ComplaintDTO> complaintDTOS = new ArrayList<>();
        for (Complaint complaint : complaints) {
            complaintDTOS.add(toDTO(complaint));
        }

        return complaintDTOS;
    }

    public void deleteComplaintByComplaintId(Long id) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid complaint ID");

        Optional<Complaint> complaintOptional = complaintRepository.findComplaintByComplaintId(id);

        if (complaintOptional.isEmpty()) throw new EntityNotFoundException("Complaint not found");

        Complaint complaint = complaintOptional.get();
        complaintRepository.delete(complaint);
    }

    public int getCountOfWaitingComplaints() {
        return complaintRepository.countComplaintsByStatus(Complaint.Status.ЗА_ПРЕГЛЕД);
    }

    public int getCountOfWaitingComplaintsOfStudent(String facultyNumber) {
        if (facultyNumber.trim().isEmpty() || facultyNumber == null)
            throw new IllegalArgumentException("Faculty number cannot be null");

        return complaintRepository.countComplaintsByStatusAndStudent_FacultyNumber(Complaint.Status.ЗА_ПРЕГЛЕД, facultyNumber);
    }
}
