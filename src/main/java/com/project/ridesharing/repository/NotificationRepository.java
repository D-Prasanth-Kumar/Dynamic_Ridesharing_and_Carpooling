package com.project.ridesharing.repository;

import com.project.ridesharing.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByTimestampDesc(Long userId);
}
