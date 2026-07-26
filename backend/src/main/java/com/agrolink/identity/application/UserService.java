package com.agrolink.identity.application;

import com.agrolink.identity.application.dto.UpdateProfileRequest;
import com.agrolink.identity.application.dto.UserDto;

/**
 * User profile operations — separate from auth-related operations.
 * Doc ref §13.4 Users & Profile APIs.
 */
public interface UserService {
    /** GET /api/v1/users/me */
    UserDto getMyProfile(String userId);

    /** PUT /api/v1/users/me */
    UserDto updateMyProfile(String userId, UpdateProfileRequest request);
}
