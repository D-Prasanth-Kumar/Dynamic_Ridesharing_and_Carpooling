package com.project.ridesharing.service;

import com.project.ridesharing.dto.RideResponse;
import com.project.ridesharing.model.Ride;
import com.project.ridesharing.model.RideStatus;
import com.project.ridesharing.model.User;
import com.project.ridesharing.repository.BookingRepository;
import com.project.ridesharing.repository.RideRepository;
import com.project.ridesharing.repository.UserRepository;
import com.project.ridesharing.dto.ReportDTO;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.Locale;
import java.time.LocalDate;
import java.util.ArrayList;
import org.springframework.data.domain.Sort;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;

    public AdminService(UserRepository userRepository, RideRepository rideRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
        this.bookingRepository = bookingRepository;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalRides = rideRepository.count();
        long totalBookings = bookingRepository.count();

        // Total Revenue
        double totalRevenue = bookingRepository.findAll().stream()
                .filter(b -> b.getAmountPaid() != null)
                .mapToDouble(b -> b.getAmountPaid())
                .sum();

        stats.put("totalUsers", totalUsers);
        stats.put("totalRides", totalRides);
        stats.put("totalBookings", totalBookings);
        stats.put("totalRevenue", totalRevenue);

        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<RideResponse> getAllRidesHistory() {

        List<Ride> rides = rideRepository.findAll(Sort.by(Sort.Direction.DESC, "date", "time"));

        return rides.stream().map(this::mapToResponse).collect(Collectors.toList());
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
        res.setStatus(ride.getStatus().name());

        return res;
    }

    public String toggleBlockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBlocked(!user.isBlocked());
        userRepository.save(user);

        return user.isBlocked() ? "User blocked" : "User unblocked";
    }

    public List<Map<String, Object>> getRideActivityChart() {

        LocalDate sevenDaysAgo = LocalDate.now().minusDays(6);
        List<Object[]> results = rideRepository.countRidesPerDay(sevenDaysAgo);

        List<Map<String, Object>> chartData = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate date = sevenDaysAgo.plusDays(i);
            String dayName = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            long count = 0;
            for (Object[] row : results) {
                if (row[0].equals(date)) {
                    count = (Long) row[1];
                    break;
                }
            }

            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("name", dayName);
            dataPoint.put("rides", count);
            chartData.add(dataPoint);
        }

        return chartData;
    }

    public ReportDTO getReport(LocalDate startDate, LocalDate endDate) {
        List<Ride> rides = rideRepository.findByDateBetween(startDate, endDate);

        double revenue = 0;
        List<RideResponse> rideResponses = new ArrayList<>();

        for (Ride ride : rides) {

            if (ride.getStatus() == RideStatus.COMPLETED) {
                revenue += ride.getTotalFare();
            }
            rideResponses.add(mapToResponse(ride));
        }

        ReportDTO report = new ReportDTO();
        report.setTotalRides(rides.size());
        report.setTotalRevenue(revenue);
        report.setRides(rideResponses);

        return report;
    }

}