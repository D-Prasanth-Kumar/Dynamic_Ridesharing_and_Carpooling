package com.project.ridesharing.service;

import com.project.ridesharing.dto.BookingRequest;
import com.project.ridesharing.dto.BookingResponse;
import com.project.ridesharing.dto.RideResponse;
import com.project.ridesharing.model.Booking;
import com.project.ridesharing.model.Ride;
import com.project.ridesharing.model.User;
import com.project.ridesharing.repository.BookingRepository;
import com.project.ridesharing.repository.RideRepository;
import com.project.ridesharing.repository.UserRepository;
import org.hibernate.sql.ast.tree.expression.Over;
import org.springframework.stereotype.Service;

import java.awt.print.Book;
import java.util.ArrayList;
import java.util.List;


@Service
public class BookingServiceImpl implements BookingService {

    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;

    public BookingServiceImpl(UserRepository userRepository,
                              RideRepository rideRepository,
                              BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public RideResponse bookRide(String passengerUsername, BookingRequest request) {
        User passenger = userRepository.findByUsername(passengerUsername)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if(ride.getAvailableSeats() < request.getSeatsBooked()) {
            throw new RuntimeException("No seats available");
        }

        ride.setAvailableSeats(ride.getAvailableSeats() - request.getSeatsBooked());
        rideRepository.save(ride);

        Booking booking = new Booking();
        booking.setPassenger(passenger);
        booking.setRide(ride);
        booking.setSeatsBooked(request.getSeatsBooked());

        bookingRepository.save(booking);

        RideResponse response = new RideResponse();
        response.setId(ride.getId());
        response.setDriverName(ride.getDriver().getName());
        response.setSource(ride.getSource());
        response.setDestination(ride.getDestination());
        response.setDate(ride.getDate().toString());
        response.setTime(ride.getTime().toString());
        response.setAvailableSeats(ride.getAvailableSeats());

        return response;
    }

    @Override
    public List<RideResponse> getPassengerBookings(String passengerUsername) {
        User passenger = userRepository.findByUsername(passengerUsername)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        List<Booking> bookings = bookingRepository.findByPassengerId(passenger.getId());

        List<RideResponse> responses = new ArrayList<>();

        for(Booking booking : bookings) {
            Ride ride = booking.getRide();

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

    @Override
    public List<BookingResponse> getBookingsForRide(Long rideId, String driverUsername) {
        User driver = userRepository.findByUsername(driverUsername)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if(!ride.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("You are not the owner of this ride");
        }

        List<Booking> bookings = bookingRepository.findByRideId(rideId);

        List<BookingResponse> responses = new ArrayList<>();

        for(Booking booking : bookings) {
            BookingResponse res = new BookingResponse();

            res.setBookingId(booking.getId());
            res.setPassengerName(booking.getPassenger().getName());
            res.setPassengerPhone(booking.getPassenger().getPhone());
            res.setSeatsBooked(booking.getSeatsBooked());

            responses.add(res);
        }

        return responses;
    }
}
