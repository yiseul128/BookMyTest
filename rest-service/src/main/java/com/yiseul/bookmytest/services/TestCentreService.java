/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 1
 */

package com.yiseul.bookmytest.services;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yiseul.bookmytest.models.TestCentre;
import com.yiseul.bookmytest.repositories.TestCentreRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service for managing test centres, including CRUD operations.
 */
@Service
public class TestCentreService {

    @Autowired
    private TestCentreRepository testCentreRepository;

    public Flux<TestCentre> getAllTestCentres() {
        return testCentreRepository.findAll();  
    }

    public Mono<TestCentre> getTestCentre(String centreCode) { 
        return testCentreRepository.findById(centreCode);
    }

    public Mono<TestCentre> addTestCentre(TestCentre testCentre) {
        Mono<TestCentre> monoAddedTestCentre = testCentreRepository.findById(testCentre.getCentreCode()).switchIfEmpty(testCentreRepository.save(testCentre));
        
        return monoAddedTestCentre.flatMap(addedTestCentre -> {
            if(testCentre.getCentreCode() == addedTestCentre.getCentreCode()){
                return monoAddedTestCentre;
            }
            return Mono.error(new RuntimeException("Test Centre already exists"));
        });
    }

    public Mono<TestCentre> updateTestCentre(String centreCode, TestCentre testCentre) {
        Mono<TestCentre> monoExistingTestCentre = testCentreRepository.findById(centreCode).switchIfEmpty(Mono.error(new RuntimeException("Test Centre doesn't exist")));

        return monoExistingTestCentre.flatMap(existingTestCentre -> {
            testCentre.setCentreCode(centreCode);
            
            return testCentreRepository.save(testCentre);
        });
    }

    public Mono<TestCentre> deleteTestCentre(String id) {
        testCentreRepository.deleteById(id);

        final Mono<TestCentre> dbTestCentre = testCentreRepository.findById(id).switchIfEmpty(Mono.error(new RuntimeException("Test Centre doesn't exist")));
		
		return dbTestCentre
        .switchIfEmpty(Mono.empty())
        .filter(Objects::nonNull)
        .flatMap(testCentreToDelete -> testCentreRepository.delete(testCentreToDelete).then(Mono.just(testCentreToDelete)));
    }
}
