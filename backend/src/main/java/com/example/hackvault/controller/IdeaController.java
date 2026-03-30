package com.example.hackvault.controller;

import com.example.hackvault.dto.*;
import com.example.hackvault.service.IdeaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ideas")
@RequiredArgsConstructor
public class IdeaController {

    private final IdeaService ideaService;

    @PostMapping
    public IdeaResponse createIdea(@Valid @RequestBody CreateIdeaRequest request) {
        return ideaService.createIdea(request);
    }

    @GetMapping
    public List<IdeaResponse> listIdeas(
            @RequestParam(required = false) String domain,
            @RequestParam(required = false, defaultValue = "recency") String sortBy) {
        return ideaService.listIdeas(domain, sortBy);
    }

    @GetMapping("/{ideaId}")
    public IdeaResponse getIdea(@PathVariable Long ideaId) {
        return ideaService.getIdea(ideaId);
    }

    @GetMapping("/shortlist")
    public List<IdeaResponse> shortlist(
            @RequestParam(required = false) Integer minScore,
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false, defaultValue = "votes") String sortBy) {
        return ideaService.shortlistIdeas(minScore, domain, limit, sortBy);
    }

    @GetMapping("/dashboard")
    public IdeaDashboardResponse dashboard() {
        return ideaService.getDashboard();
    }

    @GetMapping("/duplicates")
    public List<SimilarIdeaPairResponse> duplicates(
            @RequestParam(required = false, defaultValue = "0.55") double threshold) {
        return ideaService.detectPotentialDuplicates(threshold);
    }

    @GetMapping("/contributors")
    public List<ContributorStatsResponse> contributors() {
        return ideaService.getContributorStats();
    }

    @GetMapping("/trends/domains")
    public List<DomainTrendResponse> domainTrends() {
        return ideaService.getDomainTrends();
    }

    @GetMapping("/shortlist/export.csv")
    public ResponseEntity<byte[]> exportShortlistCsv(
            @RequestParam(required = false) Integer minScore,
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false, defaultValue = "votes") String sortBy) {
        byte[] csv = ideaService.exportShortlistCsv(minScore, domain, limit, sortBy);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=hackvault-shortlist.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @PostMapping("/{ideaId}/votes")
    public VoteResultResponse castVote(@PathVariable Long ideaId, @Valid @RequestBody CastVoteRequest request) {
        return ideaService.castVote(ideaId, request.getUserId());
    }

    @DeleteMapping("/{ideaId}/votes/{userId}")
    public VoteResultResponse removeVote(@PathVariable Long ideaId, @PathVariable Long userId) {
        return ideaService.removeVote(ideaId, userId);
    }

    @PatchMapping("/{ideaId}/status")
    public StatusUpdateResponse updateStatus(@PathVariable Long ideaId,
                                             @Valid @RequestBody UpdateIdeaStatusRequest request) {
        return ideaService.updateIdeaStatus(ideaId, request);
    }

    @PostMapping("/{ideaId}/comments")
    public CommentResponse addComment(@PathVariable Long ideaId, @Valid @RequestBody AddCommentRequest request) {
        return ideaService.addComment(ideaId, request);
    }

    @GetMapping("/{ideaId}/comments")
    public List<CommentResponse> getComments(@PathVariable Long ideaId) {
        return ideaService.getComments(ideaId);
    }

    @GetMapping("/{ideaId}/history")
    public List<SelectionHistoryResponse> getHistory(@PathVariable Long ideaId) {
        return ideaService.getSelectionHistory(ideaId);
    }
}
