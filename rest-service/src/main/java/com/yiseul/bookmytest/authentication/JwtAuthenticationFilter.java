/**
 * Developer Name: Yiseul Ko
 * Date: 2023 April 30
 */

package com.yiseul.bookmytest.authentication;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;

import com.yiseul.bookmytest.services.UserDetailsService;
import com.yiseul.bookmytest.utils.JwtUtil;

import io.jsonwebtoken.Claims;
import reactor.core.publisher.Mono;

public class JwtAuthenticationFilter implements ServerSecurityContextRepository {
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService){
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    /**
     * The save method is not supported in this implementation.
     *
     * @param exchange the ServerWebExchange instance
     * @param context the SecurityContext to be saved
     * @throws UnsupportedOperationException if this method is called
     */
    @Override
    public Mono<Void> save(ServerWebExchange exchange, SecurityContext context) {

        throw new UnsupportedOperationException("Not supported");
    }

    /**
     * Extracts the JWT token from the authorization header of the ServerWebExchange.
     *
     * @param exchange the ServerWebExchange instance containing the request
     * @return the JWT token as a string, or null if not present or invalid
     */
    private String extractToken(ServerWebExchange exchange) {
        String authorizationHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        
        if (authorizationHeader != null && authorizationHeader.toLowerCase().startsWith("bearer ")) {
            return authorizationHeader.substring(7);
        }
        
        return null;
    }

    /**
     * Loads the SecurityContext from the ServerWebExchange by extracting the JWT token,
     * validating it, and creating a SecurityContext with the appropriate Authentication object.
     *
     * @param exchange the ServerWebExchange instance containing the request
     * @return a Mono<SecurityContext> containing the authenticated SecurityContext,
     *         or an error if the token is invalid or expired
     */
    @Override
    public Mono<SecurityContext> load(ServerWebExchange exchange) {
        String token =  extractToken(exchange);

        if (token != null) {
            try {
                Claims claims = jwtUtil.getAllClaimsFromToken(token);
                String username = claims.getSubject();
    
                // Extracting roles from the claims
                List<SimpleGrantedAuthority> authorities = ((List<String>) claims.get("roles")).stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
    
                if (username != null) {
                    return userDetailsService.findByUsername(username)
                            .flatMap(userDetails -> {
                                if (jwtUtil.validateToken(token, userDetails)) {
                                    Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails,
                                            null, authorities);
                                    return Mono.just(new SecurityContextImpl(authentication));
                                } else {
                                return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token"));
                            }
                            });
                }
            } catch (Exception e) {
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Error processing token", e));
        }
    }
    return Mono.empty();
    }
}
