package com.project.ridesharing.service;

import com.project.ridesharing.dto.RideRequest;
import com.project.ridesharing.dto.RideResponse;
import java.util.List;

import java.time.LocalDate;

public interface RideService {
    RideResponse postRide(String username, RideRequest request);
    List<RideResponse> searchRides(String source, String destination, String date);
}
