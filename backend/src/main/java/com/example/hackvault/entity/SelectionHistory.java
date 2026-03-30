package com.example.hackvault.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "selection_history")
public class SelectionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idea_id", nullable = false)
    private Idea idea;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "changed_by_user_id", nullable = false)
    private AppUser changedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IdeaStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IdeaStatus toStatus;

    @Column(nullable = false, length = 1000)
    private String rationale;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant changedAt;
}
