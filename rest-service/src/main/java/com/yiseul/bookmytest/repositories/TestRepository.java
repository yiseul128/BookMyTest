/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 1
 */

package com.yiseul.bookmytest.repositories;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.yiseul.bookmytest.models.Test;

import reactor.core.publisher.Flux;

public interface TestRepository extends ReactiveMongoRepository <Test,String>{
    /**
     * Retrieves a Flux of Test documents filtered by a candidate's ID and a specified date range.
     * this method will run when a date conflict exist.
     *
     * @param candidateId the candidate's ID
     * @param startDate   the start date of the range
     * @param endDate     the end date of the range
     * @return a Flux of Test documents that match the given candidateId and date range
     */
    @Query("{'candidateId': ?0, 'dateAndTime': {$gte: ?1, $lt: ?2}}")
    Flux<Test> findByCandidateIdAndDate(String candidateId, LocalDateTime startDate, LocalDateTime endDate);

    Flux<Test> findByCandidateId(String candidateId);
}
