/**
 * Developer Name: Yiseul Ko
 * Date: 2023 April 30
 */

package com.yiseul.bookmytest.authentication;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import com.yiseul.bookmytest.services.UserDetailsService;
import com.yiseul.bookmytest.utils.JwtUtil;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import reactor.core.publisher.Mono;

/**
 * JwtAuthenticationManager is a custom authentication manager for handling
 * JSON Web Token (JWT) based authentication. It implements the ReactiveAuthenticationManager
 * interface for processing Authentication objects in a reactive, non-blocking way.
 */
@Component
public class JwtAuthenticationManager implements ReactiveAuthenticationManager {
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationManager(JwtUtil jwtUtil, UserDetailsService userDetailsService){
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Authenticates a given Authentication object, which contains the JWT token.
     * Validates the token, extracts the username, and loads the UserDetails.
     * If the token is valid, a new Authentication object is created with the UserDetails.
     *
     * @param authentication the Authentication object to be authenticated
     * @return a Mono<Authentication> containing the authenticated Authentication object,
     *         or an error if the token is invalid or expired
     */
    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        String authToken = authentication.getCredentials().toString();

        try {
            String username = jwtUtil.getUsernameFromToken(authToken);
            Mono<UserDetails> userDetailsMono = userDetailsService.findByUsername(username);

            return userDetailsMono.flatMap(userDetails -> {
                if (jwtUtil.validateToken(authToken, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    return Mono.just(authenticationToken);
                } else {
                    return Mono.empty();
                }
            });

        } catch (MalformedJwtException | ExpiredJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token", e));
        }
    }
}
