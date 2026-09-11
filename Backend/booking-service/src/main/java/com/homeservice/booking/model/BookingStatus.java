package com.homeservice.booking.model;

import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;

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

    @JsonCreator
    public static BookingStatus fromValue(String value) {
        for (BookingStatus status : values()) {
            if (status.displayName.equalsIgnoreCase(value) || status.name().equalsIgnoreCase(value.replace(' ', '_'))) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown booking status: " + value);
    }
}
