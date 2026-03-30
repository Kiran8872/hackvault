package com.example.hackvault.repository;

import com.example.hackvault.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByIdeaIdOrderByCreatedAtAsc(Long ideaId);

    long countByUserId(Long userId);
}
