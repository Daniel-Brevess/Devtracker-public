package org.danielbreves.backend.repository;

import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.entity.enums.AuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByGithubId(String githubId);

    long countByAuthProvider(AuthProvider authProvider);

    long countByCreatedAtGreaterThanEqual(Date createdAt);

    long countByLastSeenAtGreaterThanEqual(Date lastSeenAt);

}
