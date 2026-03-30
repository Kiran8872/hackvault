package com.example.hackvault.dto;

import com.example.hackvault.entity.IdeaStatus;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class SelectionHistoryResponse {
    Long id;
    Long ideaId;
    Long changedByUserId;
    String changedByName;
    IdeaStatus fromStatus;
    IdeaStatus toStatus;
    String rationale;
    Instant changedAt;
}
