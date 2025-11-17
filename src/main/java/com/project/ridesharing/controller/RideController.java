package com.project.ridesharing.controller;

import com.project.ridesharing.dto.RideRequest;
import com.project.ridesharing.dto.RideResponse;
import com.project.ridesharing.security.JwtUtil;
import com.project.ridesharing.service.RideService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rides")
public class RideController {
    private final RideService rideService;
    private final JwtUtil jwtUtil;

    public RideController(RideService rideService, JwtUtil jwtUtil) {
        this.rideService = rideService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> postRide(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody RideRequest request) {

        String token = authHeader.substring(7);

        String username = jwtUtil.getUsernameFromToken(token);

        RideResponse response = rideService.postRide(username, request);

        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchRides(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String date) {

        return ResponseEntity.ok(
                rideService.searchRides(source, destination, date)
        );
    }
}
