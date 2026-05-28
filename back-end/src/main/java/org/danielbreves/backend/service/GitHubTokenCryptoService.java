package org.danielbreves.backend.service;

import org.danielbreves.backend.exception.ValidationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class GitHubTokenCryptoService {

    private static final String CIPHER_TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;
    private static final int IV_LENGTH = 12;

    private final SecureRandom secureRandom = new SecureRandom();
    private final SecretKeySpec secretKey;

    public GitHubTokenCryptoService(
            @Value("${github.token.encryption-secret}") String encryptionSecret
    ) {
        this.secretKey = buildSecretKey(encryptionSecret);
    }

    public String encrypt(String plainText) {
        if (plainText == null || plainText.isBlank()) {
            return null;
        }

        try {
            byte[] iv = new byte[IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    secretKey,
                    new GCMParameterSpec(GCM_TAG_LENGTH, iv)
            );

            byte[] encrypted = cipher.doFinal(
                    plainText.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getEncoder().encodeToString(iv) + ":" +
                    Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception exception) {
            throw new ValidationException("Could not encrypt GitHub token");
        }
    }

    public String decrypt(String encryptedText) {
        if (encryptedText == null || encryptedText.isBlank()) {
            return null;
        }

        try {
            String[] parts = encryptedText.split(":", 2);
            byte[] iv = Base64.getDecoder().decode(parts[0]);
            byte[] encrypted = Base64.getDecoder().decode(parts[1]);

            Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
            cipher.init(
                    Cipher.DECRYPT_MODE,
                    secretKey,
                    new GCMParameterSpec(GCM_TAG_LENGTH, iv)
            );

            return new String(
                    cipher.doFinal(encrypted),
                    StandardCharsets.UTF_8
            );
        } catch (Exception exception) {
            throw new ValidationException("Could not decrypt GitHub token");
        }
    }

    private SecretKeySpec buildSecretKey(String encryptionSecret) {
        if (encryptionSecret == null || encryptionSecret.isBlank()) {
            throw new ValidationException("GitHub token encryption is not configured");
        }

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] key = digest.digest(
                    encryptionSecret.getBytes(StandardCharsets.UTF_8)
            );

            return new SecretKeySpec(key, "AES");
        } catch (Exception exception) {
            throw new ValidationException("Could not configure GitHub token encryption");
        }
    }
}
