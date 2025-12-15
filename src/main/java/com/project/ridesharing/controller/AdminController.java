package com.project.ridesharing.controller;

import com.project.ridesharing.dto.ReviewDTO;
import com.project.ridesharing.dto.UserDTO;
import com.project.ridesharing.model.User;
import com.project.ridesharing.service.AdminService;
import org.springframework.http.ResponseEntity;
import com.project.ridesharing.repository.ReviewRepository;
import com.project.ridesharing.model.Review;
import com.project.ridesharing.dto.RideResponse;
import com.project.ridesharing.dto.ReportDTO;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final ReviewRepository reviewRepository;

    public AdminController(AdminService adminService, ReviewRepository reviewRepository) {
        this.adminService = adminService;
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestParam(defaultValue = "newest") String sortBy) {

        List<User> users = adminService.getAllUsers();

        List<UserDTO> userDTOs = users.stream().map(user -> {
            UserDTO dto = new UserDTO(user);

            Double avg = reviewRepository.getAverageRating(user.getId());
            dto.setAverageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);

            return dto;
        }).collect(Collectors.toList());

        switch (sortBy) {
            case "oldest":
                userDTOs.sort(Comparator.comparing(UserDTO::getId));
                break;
            case "alphabetical":
                userDTOs.sort(Comparator.comparing(u -> u.getName() != null ? u.getName().toLowerCase() : "", String::compareTo));
                break;
            case "rating":
                userDTOs.sort(Comparator.comparing(UserDTO::getAverageRating).reversed());
                break;
            case "newest":
            default:
                userDTOs.sort(Comparator.comparing(UserDTO::getId).reversed());
                break;
        }

        return ResponseEntity.ok(userDTOs);
    }

    @PutMapping("/users/{id}/block")
    public ResponseEntity<?> toggleBlockUser(@PathVariable Long id) {
        String message = adminService.toggleBlockUser(id);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/users/{userId}/reviews")
    public ResponseEntity<?> getUserReviews(@PathVariable Long userId) {
        List<Review> reviews = reviewRepository.findByRevieweeIdOrderByTimestampDesc(userId);

        List<ReviewDTO> dtos = reviews.stream()
                .map(ReviewDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/rides")
    public ResponseEntity<List<RideResponse>> getAllRides() {

        return ResponseEntity.ok(adminService.getAllRidesHistory());
    }

    @GetMapping("/chart")
    public ResponseEntity<?> getChartData() {
        return ResponseEntity.ok(adminService.getRideActivityChart());
    }

    @GetMapping("/report")
    public ResponseEntity<ReportDTO> getReport(
            @RequestParam("from") String from,
            @RequestParam("to") String to) {

        LocalDate start = LocalDate.parse(from);
        LocalDate end = LocalDate.parse(to);

        return ResponseEntity.ok(adminService.getReport(start, end));
    }
}