package com.example.demo.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
    private Long id;

    @Column(name = "application_id", nullable = false, unique = true)
    private Long applicationId;

    public enum Type {
        НАСТАНЯВАНЕ, СМЯНА, НАПУСКАНЕ
    }

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "applied_on", nullable = false)
    private LocalDateTime appliedOn;

    public enum Status {
        ОДОБРЕНО, ЗА_ПРЕГЛЕД, ОТХВЪРЛЕНО
    }

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "friend_id", referencedColumnName = "id")
    private Student friend;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "desired_rooms_id", referencedColumnName = "id")
    private DesiredRooms desiredRooms;

    @ManyToOne
    @JoinColumn(name = "record_id", referencedColumnName = "id")
    private Record record;
}
