package com.agrolink.identity.application;

import com.agrolink.common.exception.ErrorCode;
import com.agrolink.common.exception.ResourceNotFoundException;
import com.agrolink.identity.application.dto.UpdateProfileRequest;
import com.agrolink.identity.application.dto.UserDto;
import com.agrolink.identity.domain.User;
import com.agrolink.identity.infrastructure.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDto getMyProfile(String userId) {
        User user = findOrThrow(userId);
        return toDto(user);
    }

    @Override
    public UserDto updateMyProfile(String userId, UpdateProfileRequest request) {
        User user = findOrThrow(userId);

        if (request.getFullName()         != null) user.setFullName(request.getFullName());
        if (request.getPhone()            != null) user.setPhone(request.getPhone());
        if (request.getOrganizationName() != null) user.setOrganizationName(request.getOrganizationName());

        userRepository.save(user);
        log.info("Profile updated for userId={}", userId);
        return toDto(user);
    }

    // ── Private helpers ──────────────────────────────────────
    private User findOrThrow(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .organizationName(user.getOrganizationName())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .status(user.getStatus() != null ? user.getStatus().name() : null)
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
