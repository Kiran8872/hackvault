package com.example.hackvault.dto;

import com.example.hackvault.entity.IdeaStatus;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class StatusUpdateResponse {
    Long ideaId;
    IdeaStatus status;
    String rationale;
    int totalVoteWeight;
}
