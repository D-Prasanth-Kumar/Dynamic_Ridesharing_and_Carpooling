package com.project.ridesharing.controller;

import com.project.ridesharing.dto.VehicleRequest;
import com.project.ridesharing.model.User;
import com.project.ridesharing.model.Vehicle;
import com.project.ridesharing.repository.UserRepository;
import com.project.ridesharing.repository.VehicleRepository;
import com.project.ridesharing.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public VehicleController(VehicleRepository vehicleRepository,
                             UserRepository userRepository,
                             JwtUtil jwtUtil) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> registerVehicle(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody VehicleRequest request) {

        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromToken(token);

        User driver = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vehicle vehicle = new Vehicle();
        vehicle.setModel(request.getModel());
        vehicle.setLicensePlate(request.getLicensePlate());
        vehicle.setCapacity(request.getCapacity());
        vehicle.setOwner(driver);

        vehicleRepository.save(vehicle);

        return ResponseEntity.status(201).body("Vehicle registered successfully!");
    }
}
