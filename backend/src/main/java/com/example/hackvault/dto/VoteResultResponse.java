package com.example.hackvault.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class VoteResultResponse {
    Long ideaId;
    int totalVoteWeight;
    long recentVotesLastHour;
}
