package org.danielbreves.backend.service;

import org.danielbreves.backend.dto.user.UserDeleteRequestDTO;
import org.danielbreves.backend.dto.user.UserDeleteResponseDTO;
import org.danielbreves.backend.dto.user.UserPasswordUpdateRequestDTO;
import org.danielbreves.backend.dto.user.UserUpdateRequestDTO;
import org.danielbreves.backend.entity.User;
import org.danielbreves.backend.entity.enums.AuthProvider;
import org.danielbreves.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserServiceTest {

    @Test
    void updateUserRejectsGitHubAccounts() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        UserService userService = new UserService(userRepository, passwordEncoder);
        User user = githubUser();

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.updateUser(
                        user.getEmail(),
                        new UserUpdateRequestDTO(
                                "Updated Name",
                                "updated-username",
                                "updated@test.com",
                                "current-password"
                        )
                )
        );

        assertEquals(
                "GitHub accounts cannot be updated in DevTracker. Update your profile on GitHub.",
                exception.getMessage()
        );
        verify(userRepository, never()).save(user);
    }

    @Test
    void updateUserRequiresCurrentPasswordForLocalAccounts() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        UserService userService = new UserService(userRepository, passwordEncoder);
        User user = new User(
                1L,
                "Local User",
                "local-user",
                "encoded-password",
                "local@test.com",
                null
        );
        user.setAuthProvider(AuthProvider.LOCAL);

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", user.getPassword())).thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.updateUser(
                        user.getEmail(),
                        new UserUpdateRequestDTO(
                                "Updated Name",
                                "updated-username",
                                "updated@test.com",
                                "wrong-password"
                        )
                )
        );

        assertEquals("Current password is invalid", exception.getMessage());
        verify(userRepository, never()).save(user);
    }

    @Test
    void updateUserUpdatesLocalAccountWhenCurrentPasswordMatches() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        UserService userService = new UserService(userRepository, passwordEncoder);
        User user = new User(
                1L,
                "Local User",
                "local-user",
                "encoded-password",
                "local@test.com",
                null
        );
        user.setAuthProvider(AuthProvider.LOCAL);

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("current-password", user.getPassword())).thenReturn(true);
        when(userRepository.save(user)).thenReturn(user);

        userService.updateUser(
                user.getEmail(),
                new UserUpdateRequestDTO(
                        "Updated Name",
                        "updated-username",
                        "updated@test.com",
                        "current-password"
                )
        );

        assertEquals("Updated Name", user.getName());
        assertEquals("updated-username", user.getUsername());
        assertEquals("updated@test.com", user.getEmail());
        verify(userRepository).save(user);
    }

    @Test
    void updatePasswordRejectsGitHubAccounts() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        UserService userService = new UserService(userRepository, passwordEncoder);
        User user = githubUser();

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.updatePassword(
                        user.getEmail(),
                        new UserPasswordUpdateRequestDTO("old-password", "new-password")
                )
        );

        assertEquals(
                "GitHub accounts do not use a local DevTracker password.",
                exception.getMessage()
        );
        verify(userRepository, never()).save(user);
    }

    @Test
    void updatePasswordIncrementsTokenVersionForLocalAccounts() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        UserService userService = new UserService(userRepository, passwordEncoder);
        User user = new User(
                1L,
                "Local User",
                "local-user",
                "encoded-password",
                "local@test.com",
                null
        );
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setTokenVersion(2L);

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old-password", user.getPassword())).thenReturn(true);
        when(passwordEncoder.encode("new-password")).thenReturn("new-encoded-password");

        userService.updatePassword(
                user.getEmail(),
                new UserPasswordUpdateRequestDTO("old-password", "new-password")
        );

        assertEquals("new-encoded-password", user.getPassword());
        assertEquals(3L, user.getTokenVersion());
        verify(userRepository).save(user);
    }

    @Test
    void deleteUserDeletesGitHubAccountWhenConfirmationEmailMatches() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        UserService userService = new UserService(userRepository, passwordEncoder);
        User user = githubUser();

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        UserDeleteResponseDTO responseDTO = userService.deleteUser(
                user.getEmail(),
                new UserDeleteRequestDTO(null, "github@test.com")
        );

        verify(userRepository).delete(user);
        assertEquals("Account deleted successfully", responseDTO.message());
    }

    @Test
    void deleteUserRejectsGitHubAccountWhenConfirmationEmailDoesNotMatch() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        UserService userService = new UserService(userRepository, passwordEncoder);
        User user = githubUser();

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.deleteUser(
                        user.getEmail(),
                        new UserDeleteRequestDTO(null, "other@test.com")
                )
        );

        assertEquals(
                "Confirmation email does not match this GitHub account",
                exception.getMessage()
        );
        verify(userRepository, never()).delete(user);
    }

    @Test
    void deleteUserKeepsPasswordConfirmationForLocalAccounts() {
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        UserService userService = new UserService(userRepository, passwordEncoder);
        User user = new User(
                1L,
                "Local User",
                "local-user",
                "encoded-password",
                "local@test.com",
                null
        );
        user.setAuthProvider(AuthProvider.LOCAL);

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("plain-password", user.getPassword())).thenReturn(true);

        UserDeleteResponseDTO responseDTO = userService.deleteUser(
                user.getEmail(),
                new UserDeleteRequestDTO("plain-password", null)
        );

        verify(userRepository).delete(user);
        assertEquals("Account deleted successfully", responseDTO.message());
    }

    private User githubUser() {
        User user = new User(
                1L,
                "GitHub User",
                "github-user-123",
                null,
                "github@test.com",
                null
        );
        user.setAuthProvider(AuthProvider.GITHUB);
        user.setGithubId("123");
        user.setGithubUsername("github-user");

        return user;
    }
}
