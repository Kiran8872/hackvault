package com.example.hackvault.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class DomainTrendResponse {
    String domain;
    long ideasCount;
    long voteWeight;
    long recentVotesLastHour;
}
