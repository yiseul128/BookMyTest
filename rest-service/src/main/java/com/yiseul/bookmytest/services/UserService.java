/**
 * Developer Name: Yiseul Ko
 * Date: 2023 April 30
 */

package com.yiseul.bookmytest.services;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yiseul.bookmytest.models.User;
import com.yiseul.bookmytest.repositories.UserRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service for managing users, including CRUD operations.
 */
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Flux<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Mono<User> getUser(String id) {
        return userRepository.findById(id);
    }

    public Mono<User> addUser(User user) {

        Mono<User> monoAddUser = userRepository.findByUsername(user.getUsername()).switchIfEmpty(userRepository.save(user));

        return monoAddUser.flatMap(addedUser -> {
            if(user.getUserId() == addedUser.getUserId()){
                return monoAddUser;
            }
            return Mono.error(new RuntimeException("Username already exist"));
        });
    }

    public Mono<User> updateUser(String id, User user) {
        Mono<User> monoExistingUser = userRepository.findById(id).switchIfEmpty(Mono.error(new RuntimeException("User doesn't exist")));

        return monoExistingUser.flatMap(existingUser-> {
            existingUser.setFirstName(user.getFirstName());
            existingUser.setLastName(user.getLastName());
            return userRepository.save(existingUser);
        });
    }

    public Mono<User> deletUser(String id) {

        final Mono<User> dbUser = userRepository.findById(id).switchIfEmpty(Mono.error(new RuntimeException("User doesn't exist")));

		return dbUser
        .switchIfEmpty(Mono.empty())
        .filter(Objects::nonNull)
        .flatMap(userToDelete -> userRepository.delete(userToDelete).then(Mono.just(userToDelete)));
    }

    public Mono<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

}
