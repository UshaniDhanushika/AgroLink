package com.agrolink.identity.api;

import com.agrolink.identity.application.UserService;
import com.agrolink.identity.application.dto.UpdateProfileRequest;
import com.agrolink.identity.application.dto.UserDto;
import com.agrolink.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * User management endpoints.
 * See doc §13.4 Users & Profile.
 *
 * All endpoints require a valid Bearer token.
 * Admin-only endpoints require ADMIN role enforced via @PreAuthorize.
 */
@RestController
@RequestMapping("${agrolink.api.base-path:/api/v1}/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Users", description = "User profile management")
public class UserController {

    private final UserService userService;

    // ── Own profile ──────────────────────────────────────────

    @GetMapping("/me")
    @Operation(
        summary = "Get my profile",
        description = "Returns the full profile of the currently authenticated user. See §13.4."
    )
    @ApiResponse(responseCode = "200", description = "Profile returned")
    @ApiResponse(responseCode = "401", description = "Not authenticated")
    public UserDto getMyProfile() {
        return userService.getMyProfile(SecurityUtils.requireCurrentUserId());
    }

    @PutMapping("/me")
    @Operation(
        summary = "Update my profile",
        description = "Partial update: only the fields you supply will be changed. "
                    + "Email and role changes are not permitted here."
    )
    @ApiResponse(responseCode = "200", description = "Profile updated")
    @ApiResponse(responseCode = "400", description = "Validation error")
    public UserDto updateMyProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateMyProfile(SecurityUtils.requireCurrentUserId(), request);
    }

    // ── Admin endpoints ──────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(
        summary = "List all users (ADMIN only)",
        description = "Returns a paginated list of all users on the platform. See §13.4."
    )
    @ApiResponse(responseCode = "200", description = "User list")
    @ApiResponse(responseCode = "403", description = "Requires ADMIN role")
    public String listUsers(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        // Placeholder — full implementation in admin module (Phase 7+)
        return "Admin user listing — coming in Phase 7";
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Suspend or activate user (ADMIN only)",
        description = "Sets the user status to ACTIVE or SUSPENDED. See §13.4 PATCH /admin/users/{id}/status."
    )
    @ApiResponse(responseCode = "204", description = "Status updated")
    @ApiResponse(responseCode = "403", description = "Requires ADMIN role")
    @ApiResponse(responseCode = "404", description = "User not found")
    public void updateUserStatus(
            @PathVariable String id,
            @RequestParam String status) {
        // Placeholder — admin user management (Phase 7+)
    }
}
