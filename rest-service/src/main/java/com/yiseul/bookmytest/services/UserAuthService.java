/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 3
 */

package com.yiseul.bookmytest.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.yiseul.bookmytest.authentication.Credentials;
import com.yiseul.bookmytest.authentication.Role;
import com.yiseul.bookmytest.models.User;
import com.yiseul.bookmytest.repositories.UserRepository;

import reactor.core.publisher.Mono;

/**
 * Service for handling authentication and authorization of candidates.
 */
@Service
public class UserAuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired 
    private UserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    public Mono<User> signUp(User user){
        return userRepository.findByUsername(user.getUsername())
        .flatMap(existingUser -> Mono.error(new ResponseStatusException(HttpStatus.CONFLICT, "User already exists")))
        .switchIfEmpty(createNewUser(user)).cast(User.class);
    }

    private Mono<User> createNewUser(User user) {
        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setRole(Role.valueOf(user.getRole().name()));
        return userRepository.save(newUser);
    }

    public Mono<Credentials> checkCredential(String reqUserName, String reqPassword) {
        Mono<UserDetails> monoDetail = userDetailsService.findByUsername(reqUserName);

        return monoDetail
        .flatMap(detail -> {
            if(!passwordEncoder.matches(reqPassword, detail.getPassword())){
                return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Password doesn't match"));
            }
            return userService.findByUsername(detail.getUsername())
                .map(user -> new Credentials(detail, user));
        })
        .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Username doesn't exist")));
    };

    public Mono<User> updateUser(String id, User user) {
        Mono<User> monoExistingUser = userRepository.findById(id).switchIfEmpty(Mono.error(new RuntimeException("User doesn't exist")));

        return monoExistingUser.flatMap(existingUser-> {
            return checkCredential(user.getUsername(), user.getPassword())
            .flatMap(credential -> {
                existingUser.setFirstName(user.getFirstName());
                existingUser.setLastName(user.getLastName());
                return userRepository.save(existingUser);
            });
            
        });
    }

}
