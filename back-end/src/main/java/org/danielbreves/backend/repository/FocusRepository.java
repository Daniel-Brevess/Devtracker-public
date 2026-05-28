package org.danielbreves.backend.repository;

import org.danielbreves.backend.entity.Focus;
import org.danielbreves.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FocusRepository extends JpaRepository<Focus, Long> {

    List<Focus> findAllByUser(User user);

    long countByUser(User user);

    Optional<Focus> findByIdAndUser(Long id, User user);
}
