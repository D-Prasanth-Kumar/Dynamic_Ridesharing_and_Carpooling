package com.project.ridesharing.service;

import com.project.ridesharing.dto.BookingRequest;
import com.project.ridesharing.dto.BookingResponse;
import com.project.ridesharing.dto.RideResponse;

import java.util.List;

public interface BookingService {
    RideResponse bookRide(String passengerUsername, BookingRequest request);

    List<RideResponse> getPassengerBookings(String passengerUsername);

    List<BookingResponse> getBookingsForRide(Long rideId, String driverUsername);
}
