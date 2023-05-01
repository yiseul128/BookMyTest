/**
 * Developer Name: Yiseul Ko
 * Date: 2023 April 30
 */

package com.yiseul.bookmytest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

import com.yiseul.bookmytest.authentication.JwtAuthenticationFilter;
import com.yiseul.bookmytest.services.UserDetailsService;
import com.yiseul.bookmytest.utils.JwtUtil;

/**
 * SecurityConfig is a configuration class for the web application's security settings.
 * It configures the security settings for handling authentication and authorization.
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtUtil jwtUtil, UserDetailsService userDetailsService){
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Configures the security settings for the application, including disabling CSRF protection,
     * setting up authentication, and defining authorized routes for USER and ADMIN.
     *
     * @param http the ServerHttpSecurity instance to configure
     * @return a SecurityWebFilterChain object with the configured security settings
     */
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf().disable()
                .authorizeExchange(exchange -> exchange
                        .pathMatchers("/api/login", "/api/signup").permitAll()
                        .pathMatchers("/api/user/**").hasAnyAuthority("USER", "ADMIN")
                        .pathMatchers("/api/admin/**").hasAuthority("ADMIN")
                        .anyExchange().authenticated())
                .httpBasic().disable()
                .formLogin().disable()
                .logout().disable()
                .exceptionHandling().and()
                .securityContextRepository(new JwtAuthenticationFilter(jwtUtil, userDetailsService))
                .build();
    }

    /**
     * Provides a PasswordEncoder bean for encoding and verifying passwords of 
     * all new registered users.
     *
     * @return a PasswordEncoder instance for encoding and verifying passwords
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
