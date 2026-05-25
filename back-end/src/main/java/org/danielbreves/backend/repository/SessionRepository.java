package org.danielbreves.backend.repository;

import org.danielbreves.backend.entity.Session;
import org.danielbreves.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {

    List<Session> findAllByUser(User user);
}
