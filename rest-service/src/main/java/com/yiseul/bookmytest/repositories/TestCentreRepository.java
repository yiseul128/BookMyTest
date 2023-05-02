/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 1
 */

package com.yiseul.bookmytest.repositories;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.yiseul.bookmytest.models.TestCentre;

public interface TestCentreRepository extends ReactiveMongoRepository<TestCentre, String> {
    
}
