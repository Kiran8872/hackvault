package com.example.hackvault.service;

import com.example.hackvault.dto.*;
import com.example.hackvault.entity.*;
import com.example.hackvault.exception.BadRequestException;
import com.example.hackvault.exception.NotFoundException;
import com.example.hackvault.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IdeaService {

    private final IdeaRepository ideaRepository;
    private final AppUserRepository appUserRepository;
    private final TagRepository tagRepository;
    private final VoteRepository voteRepository;
    private final SelectionHistoryRepository selectionHistoryRepository;
    private final CommentRepository commentRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Value("${hackvault.vote.moderator-weight:2}")
    private int moderatorVoteWeight;

    @Transactional
    public IdeaResponse createIdea(CreateIdeaRequest request) {
        AppUser createdBy = appUserRepository.findById(request.getCreatedByUserId())
                .orElseThrow(() -> new NotFoundException("User not found: " + request.getCreatedByUserId()));

        Idea idea = new Idea();
        idea.setTitle(request.getTitle().trim());
        idea.setDomain(request.getDomain().trim());
        idea.setDescription(request.getDescription().trim());
        idea.setStatus(IdeaStatus.SUBMITTED);
        idea.setCreatedBy(createdBy);
        idea.setTags(resolveTags(request.getTags()));

        return toIdeaResponse(ideaRepository.save(idea));
    }

    @Transactional(readOnly = true)
    public List<IdeaResponse> listIdeas(String domain, String sortBy) {
        List<IdeaResponse> ideas = ideaRepository.findAll().stream()
                .filter(i -> domain == null || domain.isBlank() || i.getDomain().equalsIgnoreCase(domain.trim()))
                .map(this::toIdeaResponse)
                .collect(Collectors.toList());

        Comparator<IdeaResponse> comparator;
        String sort = sortBy == null ? "recency" : sortBy.trim().toLowerCase();
        switch (sort) {
            case "votes" -> comparator = Comparator.comparingInt(IdeaResponse::getTotalVoteWeight).reversed();
            case "trending" -> comparator = Comparator.comparingLong(IdeaResponse::getRecentVotesLastHour).reversed();
            case "recency" -> comparator = Comparator.comparing(IdeaResponse::getCreatedAt).reversed();
            default -> throw new BadRequestException("Unsupported sortBy: " + sortBy + ". Use votes|recency|trending");
        }
        ideas.sort(comparator.thenComparing(IdeaResponse::getId, Comparator.reverseOrder()));
        return ideas;
    }

    @Transactional(readOnly = true)
    public List<IdeaResponse> shortlistIdeas(Integer minScore, String domain, Integer limit, String sortBy) {
        int scoreThreshold = minScore == null ? 1 : Math.max(0, minScore);
        int max = limit == null ? 10 : Math.max(1, limit);

        return listIdeas(domain, sortBy == null || sortBy.isBlank() ? "votes" : sortBy).stream()
                .filter(idea -> idea.getStatus() == IdeaStatus.SHORTLISTED || idea.getStatus() == IdeaStatus.SELECTED || idea.getTotalVoteWeight() >= scoreThreshold)
                .limit(max)
                .toList();
    }

    @Transactional(readOnly = true)
    public IdeaDashboardResponse getDashboard() {
        List<IdeaResponse> ideas = ideaRepository.findAll().stream().map(this::toIdeaResponse).toList();

        long submitted = ideas.stream().filter(i -> i.getStatus() == IdeaStatus.SUBMITTED).count();
        long shortlisted = ideas.stream().filter(i -> i.getStatus() == IdeaStatus.SHORTLISTED).count();
        long selected = ideas.stream().filter(i -> i.getStatus() == IdeaStatus.SELECTED).count();
        long archived = ideas.stream().filter(i -> i.getStatus() == IdeaStatus.ARCHIVED).count();
        long totalRecentVotes = ideas.stream().mapToLong(IdeaResponse::getRecentVotesLastHour).sum();

        String topDomain = ideas.stream()
                .collect(Collectors.groupingBy(IdeaResponse::getDomain, Collectors.summingInt(IdeaResponse::getTotalVoteWeight)))
                .entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("-");

        return IdeaDashboardResponse.builder()
                .totalIdeas(ideas.size())
                .submittedIdeas(submitted)
                .shortlistedIdeas(shortlisted)
                .selectedIdeas(selected)
                .archivedIdeas(archived)
                .totalVotesLastHour(totalRecentVotes)
                .topDomain(topDomain)
                .build();
    }

    @Transactional(readOnly = true)
    public List<SimilarIdeaPairResponse> detectPotentialDuplicates(double threshold) {
        double safeThreshold = Math.min(1.0, Math.max(0.1, threshold));
        List<Idea> ideas = ideaRepository.findAll();
        List<SimilarIdeaPairResponse> result = new ArrayList<>();

        for (int i = 0; i < ideas.size(); i++) {
            for (int j = i + 1; j < ideas.size(); j++) {
                Idea a = ideas.get(i);
                Idea b = ideas.get(j);
                double similarity = cosineSimilarity(tokenize(a.getDescription()), tokenize(b.getDescription()));
                if (similarity >= safeThreshold) {
                    result.add(SimilarIdeaPairResponse.builder()
                            .ideaIdA(a.getId())
                            .ideaTitleA(a.getTitle())
                            .ideaIdB(b.getId())
                            .ideaTitleB(b.getTitle())
                            .similarity(Math.round(similarity * 1000.0) / 1000.0)
                            .build());
                }
            }
        }

        result.sort(Comparator.comparingDouble(SimilarIdeaPairResponse::getSimilarity).reversed());
        return result;
    }

    @Transactional(readOnly = true)
    public IdeaResponse getIdea(Long ideaId) {
        return toIdeaResponse(getIdeaEntity(ideaId));
    }

    @Transactional
    public VoteResultResponse castVote(Long ideaId, Long userId) {
        Idea idea = getIdeaEntity(ideaId);
        AppUser user = getUserEntity(userId);

        if (user.getRole() == Role.VIEWER) {
            throw new BadRequestException("VIEWER role cannot vote");
        }

        voteRepository.findByIdeaIdAndUserId(ideaId, userId).ifPresent(v -> {
            throw new BadRequestException("User has already voted for this idea");
        });

        Vote vote = new Vote();
        vote.setIdea(idea);
        vote.setUser(user);
        vote.setWeight(user.getRole() == Role.MODERATOR ? moderatorVoteWeight : 1);
        voteRepository.save(vote);

        VoteResultResponse result = buildVoteResult(ideaId);
        messagingTemplate.convertAndSend("/topic/ideas/" + ideaId + "/votes", result);
        sendNotification("VOTE_CAST", ideaId, "New vote received on idea #" + ideaId);
        return result;
    }

    @Transactional
    public VoteResultResponse removeVote(Long ideaId, Long userId) {
        getIdeaEntity(ideaId);
        getUserEntity(userId);

        long deleted = voteRepository.deleteByIdeaIdAndUserId(ideaId, userId);
        if (deleted == 0) {
            throw new NotFoundException("Vote not found for user " + userId + " on idea " + ideaId);
        }

        VoteResultResponse result = buildVoteResult(ideaId);
        messagingTemplate.convertAndSend("/topic/ideas/" + ideaId + "/votes", result);
        sendNotification("VOTE_REMOVED", ideaId, "A vote was removed from idea #" + ideaId);
        return result;
    }

    @Transactional
    public StatusUpdateResponse updateIdeaStatus(Long ideaId, UpdateIdeaStatusRequest request) {
        Idea idea = getIdeaEntity(ideaId);
        AppUser moderator = getUserEntity(request.getModeratorUserId());

        if (moderator.getRole() != Role.MODERATOR) {
            throw new BadRequestException("Only MODERATOR can update idea status");
        }

        IdeaStatus fromStatus = idea.getStatus();
        IdeaStatus toStatus = request.getStatus();
        if (fromStatus == toStatus) {
            throw new BadRequestException("Idea is already in status " + toStatus);
        }

        idea.setStatus(toStatus);
        ideaRepository.save(idea);

        SelectionHistory history = new SelectionHistory();
        history.setIdea(idea);
        history.setChangedBy(moderator);
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        history.setRationale(request.getRationale().trim());
        selectionHistoryRepository.save(history);

        StatusUpdateResponse response = StatusUpdateResponse.builder()
                .ideaId(ideaId)
                .status(toStatus)
                .rationale(history.getRationale())
                .totalVoteWeight(voteRepository.totalWeightForIdea(ideaId))
                .build();

        messagingTemplate.convertAndSend("/topic/ideas/" + ideaId + "/status", response);
        sendNotification("STATUS_UPDATED", ideaId, "Idea #" + ideaId + " status changed to " + toStatus);
        return response;
    }

    @Transactional
    public CommentResponse addComment(Long ideaId, AddCommentRequest request) {
        Idea idea = getIdeaEntity(ideaId);
        AppUser user = getUserEntity(request.getUserId());

        Comment parent = null;
        if (request.getParentCommentId() != null) {
            parent = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new NotFoundException("Parent comment not found: " + request.getParentCommentId()));
            if (!parent.getIdea().getId().equals(ideaId)) {
                throw new BadRequestException("Parent comment belongs to a different idea");
            }
        }

        Comment comment = new Comment();
        comment.setIdea(idea);
        comment.setUser(user);
        comment.setParentComment(parent);
        comment.setContent(request.getContent().trim());

        CommentResponse saved = toCommentResponse(commentRepository.save(comment));
        sendNotification("COMMENT_ADDED", ideaId, "New comment added to idea #" + ideaId);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<ContributorStatsResponse> getContributorStats() {
        return appUserRepository.findAll().stream()
                .map(user -> ContributorStatsResponse.builder()
                        .userId(user.getId())
                        .userName(user.getName())
                        .role(user.getRole().name())
                        .ideasSubmitted(ideaRepository.countByCreatedById(user.getId()))
                        .votesCast(voteRepository.countByUserId(user.getId()))
                        .commentsPosted(commentRepository.countByUserId(user.getId()))
                        .build())
                .sorted(Comparator.comparingLong(ContributorStatsResponse::getIdeasSubmitted).reversed()
                        .thenComparingLong(ContributorStatsResponse::getVotesCast).reversed())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DomainTrendResponse> getDomainTrends() {
        List<IdeaResponse> ideas = ideaRepository.findAll().stream().map(this::toIdeaResponse).toList();
        Map<String, List<IdeaResponse>> byDomain = ideas.stream().collect(Collectors.groupingBy(i -> i.getDomain().toLowerCase()));

        return byDomain.entrySet().stream()
                .map(e -> DomainTrendResponse.builder()
                        .domain(e.getKey())
                        .ideasCount(e.getValue().size())
                        .voteWeight(e.getValue().stream().mapToInt(IdeaResponse::getTotalVoteWeight).sum())
                        .recentVotesLastHour(e.getValue().stream().mapToLong(IdeaResponse::getRecentVotesLastHour).sum())
                        .build())
                .sorted(Comparator.comparingLong(DomainTrendResponse::getVoteWeight).reversed())
                .toList();
    }

    @Transactional(readOnly = true)
    public byte[] exportShortlistCsv(Integer minScore, String domain, Integer limit, String sortBy) {
        List<IdeaResponse> data = shortlistIdeas(minScore, domain, limit, sortBy);
        StringBuilder sb = new StringBuilder();
        sb.append("id,title,domain,status,totalVoteWeight,recentVotesLastHour,createdBy,tags\n");
        for (IdeaResponse i : data) {
            sb.append(i.getId()).append(",")
                    .append(csv(i.getTitle())).append(",")
                    .append(csv(i.getDomain())).append(",")
                    .append(i.getStatus()).append(",")
                    .append(i.getTotalVoteWeight()).append(",")
                    .append(i.getRecentVotesLastHour()).append(",")
                    .append(csv(i.getCreatedByName())).append(",")
                    .append(csv(String.join("|", i.getTags())))
                    .append("\n");
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long ideaId) {
        getIdeaEntity(ideaId);
        return commentRepository.findByIdeaIdOrderByCreatedAtAsc(ideaId).stream()
                .map(this::toCommentResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SelectionHistoryResponse> getSelectionHistory(Long ideaId) {
        getIdeaEntity(ideaId);
        return selectionHistoryRepository.findByIdeaIdOrderByChangedAtDesc(ideaId).stream()
                .map(this::toSelectionHistoryResponse)
                .toList();
    }

    private Idea getIdeaEntity(Long ideaId) {
        return ideaRepository.findById(ideaId)
                .orElseThrow(() -> new NotFoundException("Idea not found: " + ideaId));
    }

    private AppUser getUserEntity(Long userId) {
        return appUserRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));
    }

    private Set<Tag> resolveTags(List<String> rawTags) {
        if (rawTags == null || rawTags.isEmpty()) {
            return new HashSet<>();
        }

        return rawTags.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .distinct()
                .map(name -> tagRepository.findByNameIgnoreCase(name)
                        .orElseGet(() -> {
                            Tag tag = new Tag();
                            tag.setName(name);
                            return tagRepository.save(tag);
                        }))
                .collect(Collectors.toCollection(HashSet::new));
    }

    private IdeaResponse toIdeaResponse(Idea idea) {
        long recentVotes = voteRepository.countByIdeaIdAndVotedAtAfter(idea.getId(), Instant.now().minus(1, ChronoUnit.HOURS));
        return IdeaResponse.builder()
                .id(idea.getId())
                .title(idea.getTitle())
                .domain(idea.getDomain())
                .description(idea.getDescription())
                .status(idea.getStatus())
                .createdByUserId(idea.getCreatedBy().getId())
                .createdByName(idea.getCreatedBy().getName())
                .tags(idea.getTags().stream().map(Tag::getName).sorted().toList())
                .totalVoteWeight(voteRepository.totalWeightForIdea(idea.getId()))
                .recentVotesLastHour(recentVotes)
                .createdAt(idea.getCreatedAt())
                .updatedAt(idea.getUpdatedAt())
                .build();
    }

    private CommentResponse toCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .ideaId(comment.getIdea().getId())
                .userId(comment.getUser().getId())
                .userName(comment.getUser().getName())
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    private SelectionHistoryResponse toSelectionHistoryResponse(SelectionHistory history) {
        return SelectionHistoryResponse.builder()
                .id(history.getId())
                .ideaId(history.getIdea().getId())
                .changedByUserId(history.getChangedBy().getId())
                .changedByName(history.getChangedBy().getName())
                .fromStatus(history.getFromStatus())
                .toStatus(history.getToStatus())
                .rationale(history.getRationale())
                .changedAt(history.getChangedAt())
                .build();
    }

    private VoteResultResponse buildVoteResult(Long ideaId) {
        return VoteResultResponse.builder()
                .ideaId(ideaId)
                .totalVoteWeight(voteRepository.totalWeightForIdea(ideaId))
                .recentVotesLastHour(voteRepository.countByIdeaIdAndVotedAtAfter(ideaId, Instant.now().minus(1, ChronoUnit.HOURS)))
                .build();
    }

    private Map<String, Integer> tokenize(String text) {
        Map<String, Integer> freq = new HashMap<>();
        if (text == null || text.isBlank()) {
            return freq;
        }

        String normalized = text.toLowerCase().replaceAll("[^a-z0-9\\s]", " ");
        for (String token : normalized.split("\\s+")) {
            if (token.length() < 3) continue;
            freq.merge(token, 1, (existing, one) -> existing + one);
        }
        return freq;
    }

    private double cosineSimilarity(Map<String, Integer> a, Map<String, Integer> b) {
        if (a.isEmpty() || b.isEmpty()) return 0.0;

        Set<String> terms = new HashSet<>();
        terms.addAll(a.keySet());
        terms.addAll(b.keySet());

        double dot = 0;
        double magA = 0;
        double magB = 0;

        for (String t : terms) {
            double va = a.getOrDefault(t, 0);
            double vb = b.getOrDefault(t, 0);
            dot += va * vb;
            magA += va * va;
            magB += vb * vb;
        }

        if (magA == 0 || magB == 0) return 0.0;
        return dot / (Math.sqrt(magA) * Math.sqrt(magB));
    }

    private void sendNotification(String type, Long ideaId, String message) {
        NotificationResponse event = NotificationResponse.builder()
                .type(type)
                .ideaId(ideaId)
                .message(message)
                .timestamp(Instant.now())
                .build();
        messagingTemplate.convertAndSend("/topic/notifications", event);
    }

    private String csv(String value) {
        String safe = value == null ? "" : value.replace("\"", "\"\"");
        return "\"" + safe + "\"";
    }
}
