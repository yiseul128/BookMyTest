/**
 * Developer Name: Yiseul Ko
 * Date: 2023 April 30
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

import com.yiseul.bookmytest.models.Certification;
import com.yiseul.bookmytest.services.CertificationService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@AllArgsConstructor
@RestController
@RequestMapping("/api")
public class CertificationController {
    
    @Autowired
	private CertificationService certificationService;
	
	@GetMapping( value = "/user/certifications",  produces = MediaType.APPLICATION_JSON_VALUE)
	public Flux<Certification> getAllCertifications() {
		return certificationService.getAllCertifications();
	}
	
	@GetMapping( value = "/user/certification/{id}",  produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<Certification> getCertification(@PathVariable String id) {
		return certificationService.getCertification(id);
	}

	@PostMapping( value = "/admin/certification",  produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<Certification> addCertification(@Valid @RequestBody Certification certification) {
		return certificationService.addCertification(certification);
	}
	
	@PutMapping( value = "/admin/certification/{id}",  produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<Certification> updatecertification(@Valid @RequestBody Certification certification, @PathVariable String id) {
		return certificationService.updateCertification(id, certification);
	}
	
	@DeleteMapping( value = "/admin/certification/{id}",  produces = MediaType.APPLICATION_JSON_VALUE)
	public Mono<Certification> deleteCertification(@PathVariable String id) {
		return certificationService.deleteCertification(id);        
	}
}
