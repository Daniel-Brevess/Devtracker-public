package org.danielbreves.backend.repository;

import org.danielbreves.backend.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findAllByIdUser(Long idUser);

    Optional<Goal> findByIdAndIdUser(Long id, Long idUser);
}
