package com.example.hackvault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CreateIdeaRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String domain;

    @NotBlank
    private String description;

    private List<String> tags = new ArrayList<>();

    @NotNull
    private Long createdByUserId;
}
