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

import com.yiseul.bookmytest.models.TestCentre;
import com.yiseul.bookmytest.services.TestCentreService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@AllArgsConstructor
@RestController
@RequestMapping("api")
public class TestCentreController {

    @Autowired
    private TestCentreService testCentreService;

	@GetMapping( value = "/user/testcentres",  produces = MediaType.APPLICATION_JSON_VALUE)
	public Flux<TestCentre> getAllTestCentres() {
		return testCentreService.getAllTestCentres();
	}
	
	@GetMapping( value = "/user/testcentre/{id}",  produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<TestCentre> getTestCentre(@PathVariable String id) {
		return testCentreService.getTestCentre(id);
	}
	
	@PostMapping( value = "/admin/testcentre",  produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<TestCentre> addTestCentre(@Valid @RequestBody TestCentre TestCentre) {
		return testCentreService.addTestCentre(TestCentre);
	}
	
	@PutMapping( value = "/admin/testcentre/{id}",  produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<TestCentre> updateTestCentre(@Valid @RequestBody TestCentre TestCentre, @PathVariable String id) {
		return testCentreService.updateTestCentre(id, TestCentre);
	}
	
	@DeleteMapping( value = "/admin/testcentre/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<TestCentre> deleteTestCentre(@PathVariable String id) {
		return testCentreService.deleteTestCentre(id);
	}
}
