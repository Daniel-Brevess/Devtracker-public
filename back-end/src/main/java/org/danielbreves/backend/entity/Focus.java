package org.danielbreves.backend.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "focuses")
public class Focus implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    private String title;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Focus() {
    }

    public Focus(Long id, User user, String title, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.title = title;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Focus focus = (Focus) o;
        return Objects.equals(id, focus.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
