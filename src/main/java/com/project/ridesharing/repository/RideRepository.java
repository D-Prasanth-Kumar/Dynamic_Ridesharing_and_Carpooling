package com.project.ridesharing.repository;

import com.project.ridesharing.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {

    List<Ride> findBySourceAndDestinationAndDate(String source, String destination, LocalDate date);
}
