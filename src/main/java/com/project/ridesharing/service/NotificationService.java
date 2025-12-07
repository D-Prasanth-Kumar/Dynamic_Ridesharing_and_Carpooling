package com.project.ridesharing.service;

import com.project.ridesharing.repository.NotificationRepository;
import com.project.ridesharing.model.Notification;
import com.project.ridesharing.model.User;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(User user, String message) {
        Notification notification = new Notification(user, message);
        notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(user.getId());
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
