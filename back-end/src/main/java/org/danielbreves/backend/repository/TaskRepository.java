package org.danielbreves.backend.repository;

import org.danielbreves.backend.entity.Focus;
import org.danielbreves.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByFocus(Focus focus);
}
