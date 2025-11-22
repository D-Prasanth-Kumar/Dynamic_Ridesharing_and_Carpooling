package com.project.ridesharing.dto;

public class BookingResponse {
    private Long bookingId;
    private String passengerName;
    private String passengerPhone;
    private int seatsBooked;

    public BookingResponse() { }

    public BookingResponse(Long bookingId, String passengerName, String passengerPhone, int seatsBooked) {
        this.bookingId = bookingId;
        this.passengerName = passengerName;
        this.passengerPhone = passengerPhone;
        this.seatsBooked = seatsBooked;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public String getPassengerPhone() {
        return passengerPhone;
    }

    public void setPassengerPhone(String passengerPhone) {
        this.passengerPhone = passengerPhone;
    }

    public int getSeatsBooked() {
        return seatsBooked;
    }

    public void setSeatsBooked(int seatsBooked) {
        this.seatsBooked = seatsBooked;
    }
}
