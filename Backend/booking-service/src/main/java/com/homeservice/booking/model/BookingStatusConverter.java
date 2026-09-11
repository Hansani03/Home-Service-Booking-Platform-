package com.homeservice.booking.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class BookingStatusConverter implements AttributeConverter<BookingStatus, String> {

    @Override
    public String convertToDatabaseColumn(BookingStatus status) {
        if (status == null) {
            return null;
        }
        return status.getDisplayName();
    }

    @Override
    public BookingStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        for (BookingStatus status : BookingStatus.values()) {
            if (status.getDisplayName().equals(dbData)) {
                return status;
            }
        }
        return BookingStatus.valueOf(dbData);
    }
}
