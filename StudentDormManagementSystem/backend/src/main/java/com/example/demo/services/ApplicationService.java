package com.example.demo.services;

import com.example.demo.dtos.ApplicationDTO;
import com.example.demo.dtos.RoomDTO;
import com.example.demo.models.*;
import com.example.demo.repositories.*;
import com.example.demo.models.Record;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map.Entry;
import java.util.*;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final RecordService recordService;
    private final RecordRepository recordRepository;
    private final StudentService studentService;
    private final UserService userService;
    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;
    private final RoomService roomService;
    private final DesiredRoomsRepository desiredRoomsRepository;
    private final ApartmentBuildingRepository apartmentBuildingRepository;
    private final ApartmentBuildingService apartmentBuildingService;

    public ApplicationService(ApplicationRepository applicationRepository, RecordService recordService, RecordRepository recordRepository, StudentService studentService, UserService userService, StudentRepository studentRepository, RoomRepository roomRepository, RoomService roomService, DesiredRoomsRepository desiredRoomsRepository, ApartmentBuildingRepository apartmentBuildingRepository, ApartmentBuildingService apartmentBuildingService) {
        this.applicationRepository = applicationRepository;
        this.recordService = recordService;
        this.recordRepository = recordRepository;
        this.studentService = studentService;
        this.userService = userService;
        this.studentRepository = studentRepository;
        this.roomRepository = roomRepository;
        this.roomService = roomService;
        this.desiredRoomsRepository = desiredRoomsRepository;
        this.apartmentBuildingRepository = apartmentBuildingRepository;
        this.apartmentBuildingService = apartmentBuildingService;
    }

    @Transactional
    public Long generateApplicationId() {
        Long maxApplicationId = applicationRepository.findMaxApplicationId();

        if (maxApplicationId == null || maxApplicationId <= 0) return 1L;

        return maxApplicationId + 1;
    }

    public Application toEntity(ApplicationDTO applicationDTO) {
        Application application = new Application();

        Long applicationId = generateApplicationId();
        application.setApplicationId(applicationId);

        String type = applicationDTO.getType();
        switch (type) {
            case "leave":
                application.setType(Application.Type.НАПУСКАНЕ);
                application.setRecord(null);
                break;
            case "change":
                application.setType(Application.Type.СМЯНА);
                application.setRecord(null);
                break;
            case "new-room":
                application.setType(Application.Type.НАСТАНЯВАНЕ);
                application.setRecord(recordService.getLatestActiveRecord());
                break;
            default:
                throw new IllegalArgumentException("Invalid application type");
        }

        application.setAppliedOn(LocalDateTime.now());
        application.setStatus(Application.Status.ЗА_ПРЕГЛЕД);

        Optional<Student> studentOptional = studentRepository.findStudentByFacultyNumber(applicationDTO.getStudentFacultyNumber());
        if (studentOptional.isEmpty()) throw new EntityNotFoundException("Student not found");

        Student student = studentOptional.get();
        application.setStudent(student);

        if (applicationDTO.getFriendFacultyNumber() != null && !applicationDTO.getFriendFacultyNumber().trim().isEmpty()) {
            Optional<Student> friendOptional = studentRepository.findStudentByFacultyNumber(applicationDTO.getFriendFacultyNumber());
            if (friendOptional.isPresent()) {
                Student friend = friendOptional.get();
                application.setFriend(friend);
            } else {
                application.setFriend(null);
            }
        }

        DesiredRooms desiredRooms = null;
        Room room1 = applicationDTO.getDesiredRoom1() != null && applicationDTO.getDesiredRoom1().getRoomId() != null ? roomService.getRoomById(applicationDTO.getDesiredRoom1().getRoomId()) : null;
        Room room2 = applicationDTO.getDesiredRoom2() != null && applicationDTO.getDesiredRoom2().getRoomId() != null ? roomService.getRoomById(applicationDTO.getDesiredRoom2().getRoomId()) : null;
        Room room3 = applicationDTO.getDesiredRoom3() != null && applicationDTO.getDesiredRoom3().getRoomId() != null ? roomService.getRoomById(applicationDTO.getDesiredRoom3().getRoomId()) : null;

        desiredRooms = new DesiredRooms();

        Room unchecked = roomService.getRoomById(0L);

        if (room1 != null) {
            desiredRooms.setRoom1(room1);
        } else {
            desiredRooms.setRoom1(unchecked);
        }
        if (room2 != null) {
            desiredRooms.setRoom2(room2);
        } else {
            desiredRooms.setRoom2(unchecked);
        }
        if (room3 != null) {
            desiredRooms.setRoom3(room3);
        } else {
            desiredRooms.setRoom3(unchecked);
        }

        desiredRoomsRepository.save(desiredRooms);
        application.setDesiredRooms(desiredRooms);

        return application;
    }

    public ApplicationDTO toDTO(Application application) {
        ApplicationDTO applicationDTO = new ApplicationDTO();

        applicationDTO.setApplicationId(application.getApplicationId());
        applicationDTO.setType(application.getType().toString());
        applicationDTO.setAppliedOn(application.getAppliedOn());
        applicationDTO.setStatus(application.getStatus().toString());
        applicationDTO.setStudentFacultyNumber(application.getStudent().getFacultyNumber());

        if (application.getFriend() != null) {
            applicationDTO.setFriendFacultyNumber(application.getFriend().getFacultyNumber());
        } else {
            applicationDTO.setFriendFacultyNumber(null);
        }

        DesiredRooms desiredRooms = application.getDesiredRooms();
        RoomDTO desiredRoom1 = desiredRooms != null ? roomService.toDTO(application.getDesiredRooms().getRoom1()) : null;
        RoomDTO desiredRoom2 = desiredRooms != null ? roomService.toDTO(application.getDesiredRooms().getRoom2()) : null;
        RoomDTO desiredRoom3 = desiredRooms != null ? roomService.toDTO(application.getDesiredRooms().getRoom3()) : null;

        applicationDTO.setDesiredRoom1(desiredRoom1);
        applicationDTO.setDesiredRoom2(desiredRoom2);
        applicationDTO.setDesiredRoom3(desiredRoom3);

        if (application.getRecord() != null) {
            applicationDTO.setRecordPeriod(application.getRecord().getPeriod());
        } else applicationDTO.setRecordPeriod(null);

        return applicationDTO;
    }

    public Application leaveRoom(Application application, Student student) {
        Room currentRoom = student.getRoom();
        currentRoom.setCapacity(currentRoom.getCapacity() + 1);
        student.setRoom(null);

        application.setStatus(Application.Status.ОДОБРЕНО);
        application.setFriend(null);
        application.setRecord(null);

        return application;
    }

    public int checkForAFriend(Application application, ApplicationDTO applicationDTO, int movingPeople) {
        if (application.getFriend() != null) {
            Optional<Student> friendOptional = studentRepository.findStudentByFacultyNumber(applicationDTO.getFriendFacultyNumber());

            if (!friendOptional.isEmpty()) {
                Student friend = friendOptional.get();
                if (friend.getGpa() >= 4.50 || !friend.getCity().toLowerCase().trim().equals("софия")) {
                    movingPeople = 2;
                }
            } else application.setFriend(null);
        }

        return movingPeople;
    }

    public Application applyForARoom(ApplicationDTO applicationDTO, Application application, Student student, int movingPeople) {
        movingPeople = checkForAFriend(application, applicationDTO, movingPeople);

        if (student.getRoom() != null) leaveRoom(application, student);

        Entry<List<Room>, Integer> result = roomService.showAvailableRooms(movingPeople);
        List<Room> availableRooms = result.getKey();
        movingPeople = result.getValue();

        if (availableRooms.isEmpty()) {
            application.setStatus(Application.Status.ОТХВЪРЛЕНО);
            if (applicationDTO.getType().trim().toLowerCase().equals("new-room"))
                application.setRecord(recordService.getLatestActiveRecord());

            return application;
        }

        if (movingPeople == 1) application.setFriend(null);

        application.setStatus(Application.Status.ЗА_ПРЕГЛЕД);

        if (applicationDTO.getType().trim().toLowerCase().equals("new-room"))
            application.setRecord(recordService.getLatestActiveRecord());

        return application;
    }

    public ApplicationDTO createApplication(ApplicationDTO applicationDTO, String type) {
        if (applicationDTO == null) throw new IllegalArgumentException("No data to create application with");
        if (type == null || type.trim().isEmpty()) throw new IllegalArgumentException("Type should have value");

        Student student = studentService.getStudentByFacultyNumber(applicationDTO.getStudentFacultyNumber());
        applicationDTO.setStudentFacultyNumber(student.getFacultyNumber());

        Application application = toEntity(applicationDTO);

        int movingPeople = 1;

        if (type.trim().toLowerCase().equals("leave")) {
            if (student.getRoom() != null)
                application = leaveRoom(application, student);
        }

        if (type.trim().toLowerCase().equals("change")) {
            application = applyForARoom(applicationDTO, application, student, 1);
            application.setFriend(null);
            application.setRecord(null);
            application.setStatus(Application.Status.ЗА_ПРЕГЛЕД);
        }

        if (type.trim().toLowerCase().equals("new-room")) {
            application = applyForARoom(applicationDTO, application, student, movingPeople);
        }

        applicationRepository.save(application);
        return toDTO(application);
    }

    public List<Application> sortApplicationsByGPA(List<Application> allApplications) {
        Collections.sort(allApplications, Comparator.comparingDouble((Application application) ->
                application.getStudent().getGpa()).reversed());

        return allApplications;
    }

    public List<ApplicationDTO> rankStudentApplications(Long recordId) {
        if (recordId == null || recordId <= 0) throw new IllegalArgumentException("Invalid record ID");

        Optional<Record> recordOptional = recordRepository.findRecordByRecordId(recordId);

        if (recordOptional.isEmpty()) throw new EntityNotFoundException("Record not found");
        Record record = recordOptional.get();

        if (record.getIsActive() == true)
            throw new IllegalStateException("Record status should be inactive in order to rank applications");

        List<Application> allApplications = applicationRepository.findAllByRecord_RecordId(recordId);

        if (allApplications.isEmpty()) throw new EntityNotFoundException("Applications not found");

        int applicationsCount = applicationRepository.countAllByRecord_RecordId(recordId);
        int capacityCount = roomRepository.getAvailableCapacity();

        sortApplicationsByGPA(allApplications);
        if (applicationsCount > capacityCount) {
            int excessApplications = applicationsCount - capacityCount;
            allApplications = allApplications.subList(0, allApplications.size() - excessApplications);
        }

        for (Application application : allApplications) {
            Student student = application.getStudent();

            List<Room> desiredRooms = Arrays.asList(
                    application.getDesiredRooms().getRoom1(),
                    application.getDesiredRooms().getRoom2(),
                    application.getDesiredRooms().getRoom3()
            );

            for (Room desiredRoom : desiredRooms) {
                if (desiredRoom != null && desiredRoom.getCapacity() >= 1) {
                    student.setRoom(desiredRoom);
                    desiredRoom.setCapacity(desiredRoom.getCapacity() - 1);

                    if (student.getRoom() != null) break;
                }
            }

            if (student.getRoom() == null) {

                if (application.getFriend() == null) {
                    Room randomRoom = roomService.getRandomAvailableRoom(1);

                    student.setRoom(randomRoom);
                    randomRoom.setCapacity(randomRoom.getCapacity() - 1);
                } else {
                    Optional<Student> friendOptional = studentRepository.findStudentByFacultyNumber(application.getFriend().getFacultyNumber());
                    Student friend = friendOptional.get();

                    Room friendsRoom = friend.getRoom();

                    if (friend.getRoom().getNumber() != null && friendsRoom.getCapacity() >= 1) {
                        student.setRoom(friendsRoom);
                        friendsRoom.setCapacity(friendsRoom.getCapacity() - 1);
                    } else {
                        Room randomRoom = roomService.getRandomAvailableRoom(2);
                        student.setRoom(randomRoom);

                        randomRoom.setCapacity(randomRoom.getCapacity() - 1);
                        if (student.getRoom() == null) {
                            randomRoom = roomService.getRandomAvailableRoom(1);
                            student.setRoom(randomRoom);

                            randomRoom.setCapacity(randomRoom.getCapacity() - 1);
                        }
                    }
                }
            }

            if (student.getRoom() != null) {
                application.setStatus(Application.Status.ОДОБРЕНО);
            } else {
                application.setStatus(Application.Status.ОТХВЪРЛЕНО);
            }

            applicationRepository.save(application);
        }

        List<ApplicationDTO> applicationDTOS = new ArrayList<>();
        for (Application application : allApplications) {
            applicationDTOS.add(toDTO(application));
        }

        return applicationDTOS;
    }

    public ApplicationDTO updateApplicationStatus(Long id, String status) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid ID");
        if (status == null || status.trim().isEmpty())
            throw new IllegalArgumentException("New status should have value");

        Optional<Application> applicationOptional = applicationRepository
                .findApplicationByApplicationId(id);

        if (applicationOptional.isEmpty()) throw new EntityNotFoundException("Application not found");

        Application application = applicationOptional.get();

        status = status.trim().toUpperCase();
        switch (status) {
            case "ОДОБРЕНО":
                application.setStatus(Application.Status.ОДОБРЕНО);
                break;
            case "ОТХВЪРЛЕНО":
                application.setStatus(Application.Status.ОТХВЪРЛЕНО);
                break;
            case "ЗА_ПРЕГЛЕД":
                application.setStatus(Application.Status.ЗА_ПРЕГЛЕД);
                break;
            default:
                throw new IllegalArgumentException("New status is invalid");
        }

        applicationRepository.save(application);

        ApplicationDTO updatedApplicationDTO = toDTO(application);
        return updatedApplicationDTO;
    }

    public int getPendingApplicationsForMovingCount() {
        return applicationRepository.countApplicationsByTypeAndStatus(Application.Type.СМЯНА, Application.Status.ЗА_ПРЕГЛЕД);
    }

    public List<ApplicationDTO> searchApplications(String id, String type, String appliedOn, String status,
                                                   String facultyNumber, String period) {

        id = userService.transformParameter(id);

        type = userService.transformParameter(type);
        if (type != null) type.toUpperCase();

        appliedOn = userService.transformParameter(appliedOn);

        status = userService.transformParameter(status);
        if (status != null) status.toUpperCase();

        facultyNumber = userService.transformParameter(facultyNumber);
        period = userService.transformParameter(period);

        List<Application> applications = applicationRepository.searchApplications(id, type, appliedOn,
                status, facultyNumber, period);

        List<ApplicationDTO> applicationDTOS = new ArrayList<>();
        if (!applications.isEmpty()) {
            for (Application application : applications) {
                applicationDTOS.add(toDTO(application));
            }
        }

        return applicationDTOS;
    }

    public ApplicationDTO getApplicationById(Long id) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid ID");

        Optional<Application> applicationOptional = applicationRepository.findApplicationByApplicationId(id);

        if (applicationOptional.isEmpty()) throw new EntityNotFoundException("Application not found");

        ApplicationDTO applicationDTO = toDTO(applicationOptional.get());

        return applicationDTO;
    }

    public void deleteApplication(Long id) {
        if (id == null || id <= 0) throw new IllegalArgumentException("Invalid ID");

        Optional<Application> applicationOptional = applicationRepository.findApplicationByApplicationId(id);

        if (applicationOptional.isEmpty()) throw new EntityNotFoundException("Application not found");

        Application application = applicationOptional.get();
        applicationRepository.delete(application);
    }

    public Boolean checkIfApplicationExistsForRecord(Long recordId, String facultyNumber) {
        if (recordId == null || recordId <= 0) throw new IllegalArgumentException("Record ID should have value");
        if (facultyNumber == null || facultyNumber.trim().isEmpty())
            throw new IllegalArgumentException("Faculty number should have value");

        Optional<Application> applicationOptional = applicationRepository.findApplicationByRecord_RecordIdAndStudent_FacultyNumber(recordId, facultyNumber);

        if (applicationOptional.isEmpty()) return false;
        return true;
    }

    public Boolean checkIfApplicationForChangeExists(String facultyNumber) {
        if (facultyNumber == null || facultyNumber.trim().isEmpty())
            throw new IllegalArgumentException("Faculty number should have value");

        Optional<Application> applicationOptional = applicationRepository.findApplicationByTypeAndStatusAndStudent_FacultyNumber(Application.Type.СМЯНА, Application.Status.ЗА_ПРЕГЛЕД, facultyNumber);

        if (applicationOptional.isEmpty()) return false;
        return true;
    }
}
