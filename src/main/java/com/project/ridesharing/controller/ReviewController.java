package com.project.ridesharing.controller;

import com.project.ridesharing.dto.ReviewRequest;
import com.project.ridesharing.model.Review;
import com.project.ridesharing.model.Ride;
import com.project.ridesharing.model.User;
import com.project.ridesharing.repository.ReviewRepository;
import com.project.ridesharing.repository.RideRepository;
import com.project.ridesharing.repository.UserRepository;
import com.project.ridesharing.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public ReviewController(ReviewRepository reviewRepository, RideRepository rideRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.reviewRepository = reviewRepository;
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> submitReview(@RequestHeader("Authorization") String authHeader,
                                          @RequestBody ReviewRequest request) {
        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromToken(token);
        User passenger = userRepository.findByUsername(username).orElseThrow();

        if (reviewRepository.existsByReviewerIdAndRideId(passenger.getId(), request.getRideId())) {
            return ResponseEntity.badRequest().body("You have already reviewed this ride.");
        }

        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        Review review = new Review();
        review.setReviewer(passenger);
        review.setReviewee(ride.getDriver());
        review.setRide(ride);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewRepository.save(review);

        return ResponseEntity.ok("Review submitted successfully!");
    }
}