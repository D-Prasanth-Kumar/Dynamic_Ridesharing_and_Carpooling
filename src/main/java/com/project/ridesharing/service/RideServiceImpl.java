package com.project.ridesharing.service;

import com.project.ridesharing.dto.RideRequest;
import com.project.ridesharing.dto.RideResponse;
import com.project.ridesharing.model.Ride;
import com.project.ridesharing.model.User;
import com.project.ridesharing.repository.RideRepository;
import com.project.ridesharing.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class RideServiceImpl implements RideService {
    private final UserRepository userRepository;
    private final RideRepository rideRespository;

    public RideServiceImpl(UserRepository userRepository, RideRepository rideRespository) {
        this.userRepository = userRepository;
        this.rideRespository = rideRespository;
    }

    @Override
    public RideResponse postRide(String username, RideRequest request) {
        User driver = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("user not found"));

        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setSource(request.getSource());
        ride.setDestination(request.getDestination());
        ride.setDate(LocalDate.parse(request.getDate()));
        ride.setTime(LocalTime.parse(request.getTime()));
        ride.setAvailableSeats(request.getAvailableSeats());

        Ride savedRide = rideRespository.save(ride);

        RideResponse response = new RideResponse();
        response.setId(savedRide.getId());
        response.setDriverName(driver.getName());
        response.setSource(savedRide.getSource());
        response.setDestination(savedRide.getDestination());
        response.setDate(savedRide.getDate().toString());
        response.setTime(savedRide.getTime().toString());
        response.setAvailableSeats(savedRide.getAvailableSeats());

        return response;
    }

    @Override
    public List<RideResponse> searchRides(String source, String destination, String date) {
        LocalDate rideDate = LocalDate.parse(date);

        List<Ride> rides = rideRespository
                .findBySourceAndDestinationAndDate(source, destination, rideDate);

        List<RideResponse> responses = new ArrayList<>();

        for(Ride ride : rides) {
            RideResponse res = new RideResponse();
            res.setId(ride.getId());
            res.setDriverName(ride.getDriver().getName());
            res.setSource(ride.getSource());
            res.setDestination(ride.getDestination());
            res.setDate(ride.getDate().toString());
            res.setTime(ride.getTime().toString());
            res.setAvailableSeats(ride.getAvailableSeats());
            responses.add(res);
        }

        return responses;
    }
}
