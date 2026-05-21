package org.danielbreves.backend.repository;

import org.danielbreves.backend.entity.Focus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FocusRepository extends JpaRepository<Focus, Long> {
}
