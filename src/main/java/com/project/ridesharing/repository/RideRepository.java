package com.project.ridesharing.repository;

import com.project.ridesharing.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {

    List<Ride> findBySourceAndDestinationAndDate(String source, String destination, LocalDate date);

    List<Ride> findByDriverIdOrderByStatusDescDateDescTimeDesc(Long driverId);

    List<Ride> findByDate(LocalDate date);

    @Query("SELECT r.date, COUNT(r) FROM Ride r WHERE r.date >= :startDate GROUP BY r.date ORDER BY r.date ASC")
    List<Object[]> countRidesPerDay(@Param("startDate") LocalDate startDate);

    List<Ride> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
