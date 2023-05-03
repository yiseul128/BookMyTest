/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 3
 */

package com.yiseul.bookmytest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yiseul.bookmytest.models.User;
import com.yiseul.bookmytest.services.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@AllArgsConstructor
@RestController
@RequestMapping("/api")
public class UserController {
    
    @Autowired
    private UserService userService;

    @GetMapping(value = "/admin/users", produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping(value = "/user/user/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<User> getUser(@PathVariable String id) {
        return userService.getUser(id);
    }

    @PostMapping(value = "/user/user", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<User> addUser(@Valid @RequestBody User user){
        return userService.addUser(user);
    }

    @DeleteMapping(value = "/user/user/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<User> deleteUser(@PathVariable String id) {
        return userService.deletUser(id);
    }
}
