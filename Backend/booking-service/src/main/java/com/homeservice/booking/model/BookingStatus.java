package com.homeservice.booking.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum BookingStatus {
    Pending,
    Accepted,
    Rejected,
    In_Progress("In Progress"),
    Completed,
    Cancelled;

    private final String displayName;

    BookingStatus() {
        this.displayName = name();
    }

    BookingStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }
}
