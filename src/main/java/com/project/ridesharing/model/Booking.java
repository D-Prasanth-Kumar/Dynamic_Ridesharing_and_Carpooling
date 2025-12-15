package com.project.ridesharing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "passenger_id")
    private User passenger;

    @ManyToOne
    @JoinColumn(name = "ride_id")
    private Ride ride;

    private int seatsBooked = 1;

    private LocalDateTime bookingTime = LocalDateTime.now();

    private String bookingSource;
    private String bookingDestination;
    private String paymentId;

    private Double amountPaid;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status")
    private BookingStatus bookingStatus = BookingStatus.CONFIRMED;

    public Booking() { }

    public Long getId() {
        return id;
    }

    public void setId(Long id) { this.id = id; }

    public User getPassenger() {
        return passenger;
    }

    public void setPassenger(User passenger) {
        this.passenger = passenger;
    }

    public Ride getRide() {
        return ride;
    }

    public void setRide(Ride ride) {
        this.ride = ride;
    }

    public int getSeatsBooked() {
        return seatsBooked;
    }

    public void setSeatsBooked(int seatsBooked) {
        this.seatsBooked = seatsBooked;
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public String getBookingSource() { return bookingSource; }

    public void setBookingSource(String bookingSource) { this.bookingSource = bookingSource; }

    public String getBookingDestination() { return bookingDestination; }

    public void setBookingDestination(String bookingDestination) { this.bookingDestination = bookingDestination; }

    public String getPaymentId() { return paymentId; }

    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public Double getAmountPaid() { return amountPaid; }

    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }

    public BookingStatus getBookingStatus() { return bookingStatus; }

    public void setBookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; }
}
