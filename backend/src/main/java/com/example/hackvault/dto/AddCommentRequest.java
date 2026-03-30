package com.example.hackvault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddCommentRequest {

    @NotNull
    private Long userId;

    private Long parentCommentId;

    @NotBlank
    private String content;
}
