package com.example.hackvault.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class IdeaDashboardResponse {
    long totalIdeas;
    long submittedIdeas;
    long shortlistedIdeas;
    long selectedIdeas;
    long archivedIdeas;
    long totalVotesLastHour;
    String topDomain;
}
