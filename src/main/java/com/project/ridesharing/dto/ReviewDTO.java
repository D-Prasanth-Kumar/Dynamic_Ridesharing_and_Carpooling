package com.project.ridesharing.dto;

import com.project.ridesharing.model.Review;

public class ReviewDTO {
    private Long id;
    private String reviewerName;
    private int rating;
    private String comment;
    private String timestamp;

    public ReviewDTO(Review review) {
        this.id = review.getId();

        if (review.getReviewer() != null) {
            this.reviewerName = review.getReviewer().getName() != null
                    ? review.getReviewer().getName()
                    : review.getReviewer().getUsername();
        } else {
            this.reviewerName = "Anonymous";
        }

        this.rating = review.getRating();
        this.comment = review.getComment();
        this.timestamp = review.getTimestamp().toString();
    }

    public Long getId() { return id; }

    public String getReviewerName() { return reviewerName; }

    public int getRating() { return rating; }

    public String getComment() { return comment; }

    public String getTimestamp() { return timestamp; }
}