package com.agrolink.security.jwt;

import com.agrolink.common.logging.MdcUtils;
import com.agrolink.common.util.HttpRequestUtils;
import com.agrolink.config.AgroLinkProperties;
import com.agrolink.security.UserPrincipal;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AgroLinkProperties properties;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String headerName = properties.getSecurity().getJwt().getHeader();
        if (headerName == null || headerName.isBlank()) {
            headerName = HttpHeaders.AUTHORIZATION;
        }

        String token = HttpRequestUtils.bearerToken(
                request,
                headerName,
                properties.getSecurity().getJwt().getPrefix());

        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null
                && jwtService.isValid(token)) {
            Claims claims = jwtService.parseClaims(token);
            UserPrincipal principal = jwtService.toPrincipal(claims);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            MdcUtils.setUserId(principal.getId());
        }

        filterChain.doFilter(request, response);
    }
}
