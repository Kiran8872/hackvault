package com.example.hackvault.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class SimilarIdeaPairResponse {
    Long ideaIdA;
    String ideaTitleA;
    Long ideaIdB;
    String ideaTitleB;
    double similarity;
}
