package com.agrolink.identity.email;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MockEmailService implements EmailService {

    @Override
    public void sendVerificationEmail(String to, String token) {
        log.info("===============================================================");
        log.info("MOCK EMAIL SERVICE");
        log.info("Sending Verification Email to: {}", to);
        log.info("Verification Token: {}", token);
        log.info("Verification Link: http://localhost:8080/api/v1/auth/verify-email?token={}", token);
        log.info("===============================================================");
    }

    @Override
    public void sendPasswordResetEmail(String to, String token) {
        log.info("===============================================================");
        log.info("MOCK EMAIL SERVICE");
        log.info("Sending Password Reset Email to: {}", to);
        log.info("Reset Token: {}", token);
        log.info("===============================================================");
    }
}
