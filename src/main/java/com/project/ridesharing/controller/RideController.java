package com.project.ridesharing.controller;

import com.project.ridesharing.dto.RideRequest;
import com.project.ridesharing.dto.RideResponse;
import com.project.ridesharing.security.JwtUtil;
import com.project.ridesharing.service.BookingService;
import com.project.ridesharing.service.RideService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rides")
public class RideController {
    private final RideService rideService;
    private final JwtUtil jwtUtil;
    private final BookingService bookingService;

    public RideController(RideService rideService,BookingService bookingService, JwtUtil jwtUtil) {
        this.rideService = rideService;
        this.bookingService = bookingService;
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

    @GetMapping("/my-rides")
    public ResponseEntity<?> getMyRides(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);

        String driverUsername = jwtUtil.getUsernameFromToken(token);

        return ResponseEntity.ok(rideService.getMyRides(driverUsername));
    }

    @GetMapping("/{rideId}/bookings")
    public ResponseEntity<?> getBookingsForRide(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long rideId) {

        String token = authHeader.substring(7);

        String driverUsername = jwtUtil.getUsernameFromToken(token);

        return ResponseEntity.ok(
                bookingService.getBookingsForRide(rideId, driverUsername)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRide(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody RideRequest request) {

        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromToken(token);

        RideResponse response = rideService.updateRide(id, request, username);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeRide(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {

        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromToken(token);

        rideService.completeRide(id, username);
        return ResponseEntity.ok("Ride completed. Review emails sent.");
    }

    @PutMapping("/{rideId}/cancel")
    public ResponseEntity<?> cancelRide(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long rideId) {

        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromToken(token);

        rideService.cancelRide(rideId, username);
        return ResponseEntity.ok("Ride cancelled successfully. Passengers notified.");
    }
}
