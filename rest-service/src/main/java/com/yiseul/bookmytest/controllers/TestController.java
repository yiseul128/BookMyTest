/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 1
 */

package com.yiseul.bookmytest.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yiseul.bookmytest.models.Test;
import com.yiseul.bookmytest.services.TestService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@AllArgsConstructor
@RestController
@RequestMapping("/api/user")
public class TestController {
    @Autowired
	TestService testService;

    @GetMapping(value = "/tests", produces = MediaType.APPLICATION_JSON_VALUE)
	public Flux<Test> getAllTests() {
		return testService.getAllTests();
	}

	@GetMapping(value= "/tests/bycandidate/{candidateId}")
	public Flux<Test> getAllTestsByCandidateId(@PathVariable String candidateId) {
		return testService.getAllTestsByCandidateId(candidateId);
	}
	
	@GetMapping(value = "/test/{id}",  produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<Test> getTest(@PathVariable String id) {
		return testService.getTest(id);
	}
	
	@PostMapping(value = "/test",  produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<Test> addTest(@Valid @RequestBody Test test) {
		return testService.addTest(test);
	}
	
	@PutMapping(value = "/test/{id}",  produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<Test> updateTest(@Valid @RequestBody Test test, @PathVariable String id) {
		return testService.updateTest(id, test);
	}

	@DeleteMapping( value = "/test/{id}",  produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<Test> deleteTest(@PathVariable String id) {
		return testService.deleteTest(id);
	}
    
}
