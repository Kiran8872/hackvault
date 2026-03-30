package com.example.hackvault.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class NotificationResponse {
    String type;
    Long ideaId;
    String message;
    Instant timestamp;
}
