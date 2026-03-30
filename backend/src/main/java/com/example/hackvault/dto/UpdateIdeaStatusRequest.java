package com.example.hackvault.dto;

import com.example.hackvault.entity.IdeaStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateIdeaStatusRequest {

    @NotNull
    private Long moderatorUserId;

    @NotNull
    private IdeaStatus status;

    @NotBlank
    private String rationale;
}
