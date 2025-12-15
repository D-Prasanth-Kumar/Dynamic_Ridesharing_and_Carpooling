package com.project.ridesharing.repository;

import com.project.ridesharing.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByRevieweeIdOrderByTimestampDesc(Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewee.id = :userId")
    Double getAverageRating(Long userId);

    boolean existsByReviewerIdAndRideId(Long reviewerId, Long rideId);
}