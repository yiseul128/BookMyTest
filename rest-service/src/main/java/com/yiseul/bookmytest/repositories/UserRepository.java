/**
 * Developer Name: Yiseul Ko
 * Date: 2023 April 30
 */

package com.yiseul.bookmytest.repositories;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.yiseul.bookmytest.models.User;

import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveMongoRepository<User, String>{
    Mono<User> findByUsername(String username);
}
