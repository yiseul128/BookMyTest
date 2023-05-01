/**
 * Developer Name: Yiseul Ko
 * Date: 2023 April 30
 */

package com.yiseul.bookmytest.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.yiseul.bookmytest.repositories.UserRepository;

import reactor.core.publisher.Mono;

/**
 * Service for handling the loading of user details for authentication.
 * Implements the ReactiveUserDetailsService interface, allowing it to be used with reactive
 * Spring Security.
 */
@Service
public class UserDetailsService implements ReactiveUserDetailsService {
    
    @Autowired UserRepository userRepository;

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return userRepository.findByUsername(username)
        .map(user -> User.withUsername(user.getUsername())
        .password(user.getPassword())
        .authorities(user.getRole().name())
        .accountExpired(false)
        .credentialsExpired(false)
        .disabled(false)
        .accountLocked(false)
        .build());
    }
}
