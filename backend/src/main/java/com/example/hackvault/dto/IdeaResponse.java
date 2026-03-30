package com.example.hackvault.dto;

import com.example.hackvault.entity.IdeaStatus;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.List;

@Value
@Builder
public class IdeaResponse {
    Long id;
    String title;
    String domain;
    String description;
    IdeaStatus status;
    Long createdByUserId;
    String createdByName;
    List<String> tags;
    int totalVoteWeight;
    long recentVotesLastHour;
    Instant createdAt;
    Instant updatedAt;
}
