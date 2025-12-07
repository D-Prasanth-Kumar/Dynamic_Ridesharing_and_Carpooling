package com.project.ridesharing.dto;

import com.project.ridesharing.model.Notification;
import java.time.LocalDateTime;

public class NotificationDTO {
    private Long id;
    private String message;
    private boolean isRead;
    private String timestamp;

    public NotificationDTO(Notification n) {
        this.id = n.getId();
        this.message = n.getMessage();
        this.isRead = n.isRead();
        this.timestamp = n.getTimestamp().toString();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean getIsRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}