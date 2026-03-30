package com.example.hackvault.repository;

import com.example.hackvault.entity.Idea;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IdeaRepository extends JpaRepository<Idea, Long> {
    long countByCreatedById(Long userId);
}
