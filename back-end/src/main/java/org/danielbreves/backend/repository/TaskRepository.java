package org.danielbreves.backend.repository;

import org.danielbreves.backend.entity.Focus;
import org.danielbreves.backend.entity.Task;
import org.danielbreves.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByFocus(Focus focus);

    List<Task> findAllByFocus_User(User user);

    long countByFocus(Focus focus);

    Optional<Task> findByIdAndFocus(Long id, Focus focus);
}
