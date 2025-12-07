package com.project.ridesharing.service;

import com.project.ridesharing.dto.RideRequest;
import com.project.ridesharing.dto.RideResponse;
import com.project.ridesharing.model.Ride;
import com.project.ridesharing.model.User;
import com.project.ridesharing.model.Vehicle;
import com.project.ridesharing.repository.RideRepository;
import com.project.ridesharing.repository.UserRepository;
import com.project.ridesharing.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class RideServiceImpl implements RideService {
    private final UserRepository userRepository;
    private final RideRepository rideRespository;
    private final VehicleRepository vehicleRepository;
    private final GoogleMapsService googleMapsService;

    public RideServiceImpl(UserRepository userRepository,
                           RideRepository rideRespository,
                           VehicleRepository vehicleRepository,
                           GoogleMapsService googleMapsService) {
        this.userRepository = userRepository;
        this.rideRespository = rideRespository;
        this.vehicleRepository = vehicleRepository;
        this.googleMapsService = googleMapsService;
    }

    @Override
    public RideResponse postRide(String username, RideRequest request) {
        User driver = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("user not found"));

        List<Vehicle> vehicles = vehicleRepository.findByOwnerId(driver.getId());

        if(vehicles.isEmpty()) {
            throw new RuntimeException("Driver has no registered vehicles");
        }

        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setSource(request.getSource());
        ride.setDestination(request.getDestination());
        ride.setDate(LocalDate.parse(request.getDate()));
        ride.setTime(LocalTime.parse(request.getTime()));
        ride.setAvailableSeats(request.getAvailableSeats());
        ride.setVehicle(vehicles.get(0));
        ride.setStops(request.getStops());

        Double distanceKm = googleMapsService.getDistanceInKm(request.getSource(), request.getDestination());
        ride.setDistanceKm(distanceKm);

        ride.setPricePerKm(request.getPricePerKm());

        double totalFare = distanceKm * request.getPricePerKm();
        ride.setTotalFare(Math.round(totalFare * 100.0) / 100.0);

        Ride savedRide = rideRespository.save(ride);

        return mapToResponse(savedRide);
    }

    @Override
    public List<RideResponse> searchRides(String source, String destination, String date) {
        LocalDate rideDate = LocalDate.parse(date);

        List<Ride> allRides = rideRespository.findByDate(rideDate);
        List<RideResponse> matches = new ArrayList<>();

        for (Ride ride : allRides) {
            if (isRouteMatch(ride, source, destination)) {

                RideResponse res = mapToResponse(ride);

                try {
                    Double specificDistance = googleMapsService.getDistanceInKm(source, destination);

                    res.setDistanceKm(specificDistance);

                    Double specificFare = specificDistance * ride.getPricePerKm();
                    res.setTotalFare(Math.round(specificFare * 100.0) / 100.0);

                } catch (Exception e) {
                    System.err.println("Failed to calculate segment distance: " + e.getMessage());
                }

                res.setSource(source);
                res.setDestination(destination);

                matches.add(res);
            }
        }
        return matches;
    }

    private boolean isRouteMatch(Ride ride, String userSource, String userDest) {
        String rSource = ride.getSource().toLowerCase().trim();
        String rDest = ride.getDestination().toLowerCase().trim();
        String uSource = userSource.toLowerCase().trim();
        String uDest = userDest.toLowerCase().trim();
        String stopsStr = ride.getStops() != null ? ride.getStops().toLowerCase().trim() : "";

        List<String> fullRoute = new ArrayList<>();
        fullRoute.add(rSource);

        if (!stopsStr.isEmpty()) {
            String[] stops = stopsStr.split(",");
            for (String stop : stops) {
                fullRoute.add(stop.trim());
            }
        }

        fullRoute.add(rDest);

        int startIndex = fullRoute.indexOf(uSource);
        int endIndex = fullRoute.indexOf(uDest);

        if (startIndex == -1 || endIndex == -1) {
            return false;
        }

        return startIndex < endIndex;
    }

    private RideResponse mapToResponse(Ride ride) {
        RideResponse res = new RideResponse();
        res.setId(ride.getId());
        res.setDriverName(ride.getDriver().getName());
        res.setDriverPhone(ride.getDriver().getPhone());

        if (ride.getVehicle() != null) {
            res.setVehicleModel(ride.getVehicle().getModel());
            res.setVehiclePlate(ride.getVehicle().getLicensePlate());
        }

        res.setSource(ride.getSource());
        res.setDestination(ride.getDestination());
        res.setDate(ride.getDate().toString());
        res.setTime(ride.getTime().toString());
        res.setAvailableSeats(ride.getAvailableSeats());
        res.setDistanceKm(ride.getDistanceKm());
        res.setPricePerKm(ride.getPricePerKm());
        res.setTotalFare(ride.getTotalFare());

        return res;
    }

    @Override
    public List<RideResponse> getMyRides(String driverUsername) {
        User driver = userRepository.findByUsername(driverUsername)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        List<Ride> rides = rideRespository.findByDriverId(driver.getId());
        List<RideResponse> responses = new ArrayList<>();

        for(Ride ride : rides) {
            responses.add(mapToResponse(ride));
        }

        return responses;
    }
}