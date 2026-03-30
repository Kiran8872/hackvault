package com.example.hackvault.repository;

import com.example.hackvault.entity.Idea;
import com.example.hackvault.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByIdeaIdAndUserId(Long ideaId, Long userId);

    long deleteByIdeaIdAndUserId(Long ideaId, Long userId);

    long countByIdeaIdAndVotedAtAfter(Long ideaId, Instant since);

    long countByUserId(Long userId);

    @Query("select coalesce(sum(v.weight), 0) from Vote v where v.idea.id = :ideaId")
    int totalWeightForIdea(@Param("ideaId") Long ideaId);

    List<Vote> findByIdea(Idea idea);
}
