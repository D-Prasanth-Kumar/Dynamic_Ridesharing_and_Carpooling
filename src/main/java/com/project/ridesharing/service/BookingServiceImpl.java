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
import com.project.ridesharing.service.NotificationService;
import com.project.ridesharing.service.EmailService;
import com.project.ridesharing.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class BookingServiceImpl implements BookingService {

    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final ReviewRepository reviewRepository;

    public BookingServiceImpl(UserRepository userRepository,
                              RideRepository rideRepository,
                              BookingRepository bookingRepository,
                              EmailService emailService,
                              NotificationService notificationService,
                              ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
        this.notificationService = notificationService;
        this.reviewRepository = reviewRepository;
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
        booking.setPaymentId(request.getPaymentId());
        booking.setBookingSource(request.getSource());
        booking.setBookingDestination(request.getDestination());
        booking.setAmountPaid(request.getAmountPaid());

        bookingRepository.save(booking);

        String driverMsg = "New Booking: " + passenger.getName() + " booked " + request.getSeatsBooked() + " seat(s) for " + request.getDestination();
        notificationService.createNotification(ride.getDriver(), driverMsg);

        String passengerMsg = "Booking Confirmed: Your ride to " + request.getDestination() + " is scheduled.";
        notificationService.createNotification(passenger, passengerMsg);

        try {

            String driverEmail = ride.getDriver().getEmail();
            String passengerEmail = passenger.getEmail();

            String driverName = ride.getDriver().getName();
            String passengerName = passenger.getName();


            String from = booking.getBookingSource() != null ? booking.getBookingSource() : ride.getSource();
            String to = booking.getBookingDestination() != null ? booking.getBookingDestination() : ride.getDestination();

            String date = ride.getDate().toString();
            String time = ride.getTime().toString();

            long amountForEmail = Math.round(booking.getAmountPaid());
            double finalCleanAmount = (double) amountForEmail;

            double amountPaid = ride.getPricePerKm() != null
                    ? ride.getPricePerKm() * ride.getDistanceKm() * request.getSeatsBooked()
                    : 0.0;

            double amount = request.getAmountPaid() != null ? request.getAmountPaid() : 0.0;

            emailService.sendDriverBookingAlert(
                    driverEmail, driverName, passengerName, from, to, request.getSeatsBooked(), date, time
            );

            emailService.sendPassengerBookingConfirmation(
                    passengerEmail, passengerName, driverName, from, to, request.getSeatsBooked(),
                    finalCleanAmount,
                    ride.getVehicle().getModel(),
                    ride.getVehicle().getLicensePlate(),
                    date, time
            );

        } catch (Exception e) {
            System.err.println("Email notification failed: " + e.getMessage());
            e.printStackTrace();
        }

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

        List<Booking> bookings = bookingRepository.findByPassengerIdOrderByIdDesc(passenger.getId());
        List<RideResponse> responses = new ArrayList<>();

        for(Booking booking : bookings) {
            Ride ride = booking.getRide();
            RideResponse res = new RideResponse();

            res.setId(ride.getId());
            res.setDriverName(ride.getDriver().getName());
            res.setDriverPhone(ride.getDriver().getPhone());
            res.setBookingStatus(booking.getBookingStatus().name());

            if (ride.getVehicle() != null) {
                res.setVehicleModel(ride.getVehicle().getModel());
                res.setVehiclePlate(ride.getVehicle().getLicensePlate());
            }

            if (booking.getBookingSource() != null && !booking.getBookingSource().isEmpty()) {
                res.setSource(booking.getBookingSource());
            } else {
                res.setSource(ride.getSource());
            }

            if (booking.getBookingDestination() != null && !booking.getBookingDestination().isEmpty()) {
                res.setDestination(booking.getBookingDestination());
            } else {
                res.setDestination(ride.getDestination());
            }

            res.setDate(ride.getDate().toString());
            res.setTime(ride.getTime().toString());

            if (booking.getAmountPaid() != null) {
                res.setTotalFare(booking.getAmountPaid());
            } else {
                res.setTotalFare(ride.getTotalFare());
            }

            boolean reviewed = reviewRepository.existsByReviewerIdAndRideId(passenger.getId(), ride.getId());
            res.setHasReviewed(reviewed);

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
