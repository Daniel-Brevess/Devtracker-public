package org.danielbreves.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import org.danielbreves.backend.entity.enums.GoalDifficulty;
import org.danielbreves.backend.entity.enums.GoalStatus;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "goals")
public class Goal implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_user", nullable = false)
    private Long idUser;

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private GoalDifficulty difficulty;

    @Enumerated(EnumType.STRING)
    private GoalStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Goal() {
    }

    public Goal(
            Long id,
            Long idUser,
            String title,
            String description,
            GoalDifficulty difficulty,
            GoalStatus status,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.idUser = idUser;
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getIdUser() {
        return idUser;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public GoalDifficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(GoalDifficulty difficulty) {
        this.difficulty = difficulty;
    }

    public GoalStatus getStatus() {
        return status;
    }

    public void setStatus(GoalStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (status == null) {
            status = GoalStatus.TODO;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Goal goal = (Goal) o;
        return Objects.equals(id, goal.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
