package com.project.ridesharing.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String message;
    private boolean isRead = false;
    private LocalDateTime timestamp = LocalDateTime.now();

    public Notification() {}

    public Notification(User user, String message) {
        this.user = user;
        this.message = message;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public String getMessage() { return message; }

    public void setMessage(String message) { this.message = message; }

    public boolean isRead() { return isRead; }

    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getTimestamp() { return timestamp; }

    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
