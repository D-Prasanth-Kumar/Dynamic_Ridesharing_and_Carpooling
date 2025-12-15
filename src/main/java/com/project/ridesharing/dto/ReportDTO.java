package com.project.ridesharing.dto;

import java.util.List;

public class ReportDTO {
    private long totalRides;
    private double totalRevenue;
    private List<RideResponse> rides;

    public long getTotalRides() { return totalRides; }
    public void setTotalRides(long totalRides) { this.totalRides = totalRides; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<RideResponse> getRides() { return rides; }
    public void setRides(List<RideResponse> rides) { this.rides = rides; }
}