package com.project.ridesharing.controller;

import com.project.ridesharing.model.Notification;
import com.project.ridesharing.model.User;
import com.project.ridesharing.service.NotificationService;
import com.project.ridesharing.repository.UserRepository;
import com.project.ridesharing.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import com.project.ridesharing.dto.NotificationDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public NotificationController(NotificationService notificationService, UserRepository userRepository, JwtUtil jwtUtil) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getMyNotifications(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username).orElseThrow();

        List<Notification> entities = notificationService.getUserNotifications(user);

        List<NotificationDTO> dtos = entities.stream()
                .map(NotificationDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("Marked as read");
    }
}