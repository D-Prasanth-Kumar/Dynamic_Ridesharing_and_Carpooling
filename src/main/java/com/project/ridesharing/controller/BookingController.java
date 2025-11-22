package com.project.ridesharing.controller;


import com.project.ridesharing.dto.BookingRequest;
import com.project.ridesharing.dto.RideResponse;
import com.project.ridesharing.security.JwtUtil;
import com.project.ridesharing.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final JwtUtil jwtUtil;

    public BookingController(BookingService bookingService, JwtUtil jwtUtil) {
        this.bookingService = bookingService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> bookRide(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody BookingRequest request) {

        String token = authHeader.substring(7);

        String passengerUsername = jwtUtil.getUsernameFromToken(token);

        RideResponse response = bookingService.bookRide(passengerUsername, request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);

        String passengerUsername = jwtUtil.getUsernameFromToken(token);

        return ResponseEntity.ok(
                bookingService.getPassengerBookings(passengerUsername)
        );
    }
}
