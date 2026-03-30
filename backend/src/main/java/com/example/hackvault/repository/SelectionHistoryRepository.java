package com.example.hackvault.repository;

import com.example.hackvault.entity.SelectionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SelectionHistoryRepository extends JpaRepository<SelectionHistory, Long> {
    List<SelectionHistory> findByIdeaIdOrderByChangedAtDesc(Long ideaId);
}
