package com.project.ridesharing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "reviewee_id")
    private User reviewee;

    @ManyToOne
    @JoinColumn(name = "ride_id")
    private Ride ride;

    private int rating;
    private String comment;
    private LocalDateTime timestamp = LocalDateTime.now();

    public Review() {}

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public User getReviewer() { return reviewer; }

    public void setReviewer(User reviewer) { this.reviewer = reviewer; }

    public User getReviewee() { return reviewee; }

    public void setReviewee(User reviewee) { this.reviewee = reviewee; }

    public Ride getRide() { return ride; }

    public void setRide(Ride ride) { this.ride = ride; }

    public int getRating() { return rating; }

    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }

    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getTimestamp() { return timestamp; }

    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}