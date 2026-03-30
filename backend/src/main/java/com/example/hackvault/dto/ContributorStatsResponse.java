package com.example.hackvault.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ContributorStatsResponse {
    Long userId;
    String userName;
    String role;
    long ideasSubmitted;
    long votesCast;
    long commentsPosted;
}
