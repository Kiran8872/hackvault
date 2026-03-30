package com.example.hackvault.dto;

import com.example.hackvault.entity.Role;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class UserResponse {
    Long id;
    String name;
    String email;
    Role role;
    Instant createdAt;
}
