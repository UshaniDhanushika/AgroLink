package com.agrolink.identity.api;

import com.agrolink.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${agrolink.api.base-path:/api/v1}/users")
@Tag(name = "Users", description = "User management APIs")
public class UserController {

    @GetMapping("/me")
    @Operation(summary = "Get current user profile", description = "Returns information about the currently authenticated user")
    @ApiResponse(responseCode = "200", description = "User profile retrieved successfully")
    public UserPrincipal getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        return principal;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users (Admin only)", description = "Example protected endpoint that requires ADMIN role")
    @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    public String getAllUsers() {
        return "This endpoint requires ADMIN role.";
    }
}
