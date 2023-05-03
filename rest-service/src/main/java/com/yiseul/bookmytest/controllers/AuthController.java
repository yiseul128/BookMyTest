/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 3
 */

package com.yiseul.bookmytest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.yiseul.bookmytest.authentication.AuthenticationRequest;
import com.yiseul.bookmytest.authentication.AuthenticationResponse;
import com.yiseul.bookmytest.authentication.JwtAuthenticationManager;
import com.yiseul.bookmytest.models.User;
import com.yiseul.bookmytest.services.UserAuthService;
import com.yiseul.bookmytest.utils.JwtUtil;

import jakarta.validation.Valid;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
public class AuthController {
    
    @Autowired
    private UserAuthService userAuthService;

    @Autowired
    private JwtAuthenticationManager jwtAuthenticationManager;

    @Autowired
    private JwtUtil jwtTokenUtil;
    
    @PostMapping("/signup")
    public Mono<ResponseEntity<User>> processSignUp(@RequestBody User user) {
        return userAuthService.signUp(user)
        .map(savedUser -> ResponseEntity.ok(savedUser))
        .defaultIfEmpty(ResponseEntity.badRequest().build());

    }

    @PostMapping("/login")
    public Mono<ResponseEntity<?>> processLogin(@RequestBody AuthenticationRequest authenticationRequest) {
        try{
            return Mono.fromCallable(()-> jwtAuthenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword())))
            .then(userAuthService.checkCredential(authenticationRequest.getUsername(), authenticationRequest.getPassword()))
            .map(credentials -> {
                final String jwt = jwtTokenUtil.generateToken(credentials);
                return ResponseEntity.ok(new AuthenticationResponse(jwt));
            });
        }
        catch(Exception e){
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication failed", e));
        }
    }

    @PutMapping(value = "/user/update-profile/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<User> updateUser(@PathVariable String id, @Valid @RequestBody User user) {
        return userAuthService.updateUser(id, user);
    }
}
