package com.example.hackvault.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class CommentResponse {
    Long id;
    Long ideaId;
    Long userId;
    String userName;
    Long parentCommentId;
    String content;
    Instant createdAt;
}
