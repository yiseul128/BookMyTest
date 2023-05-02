/**
 * Developer Name: Yiseul Ko
 * Date: 2023 April 30
 */

package com.yiseul.bookmytest.services;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yiseul.bookmytest.models.Certification;
import com.yiseul.bookmytest.repositories.CertificationRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service for managing certifications, including CRUD operations.
 */
@Service
public class CertificationService {

    @Autowired
    private CertificationRepository certificationRepository;

    public Flux<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    public Mono<Certification> getCertification(String certificationCode) {
        return certificationRepository.findById(certificationCode);
    }

    public Mono<Certification> addCertification(Certification certification) {
        Mono<Certification> monoAddedCertification = certificationRepository.findById(certification.getCertificationCode()).switchIfEmpty(certificationRepository.save(certification));
        
        return monoAddedCertification.flatMap(addedcertification -> {
            if(certification.getCertificationCode() == addedcertification.getCertificationCode()){
                return monoAddedCertification;
            }
            return Mono.error(new RuntimeException("Certification already exists"));
        });
    }

    public Mono<Certification> updateCertification(String certificationCode, Certification certification) {
        Mono<Certification> monoExistingCertification = certificationRepository.findById(certificationCode).switchIfEmpty(Mono.error(new RuntimeException("Certification doesn't exist")));
        
        return monoExistingCertification.flatMap(existingCertification -> {
            certification.setCertificationCode(certificationCode);
            return certificationRepository.save(certification);
        });
    }   

    public Mono<Certification> deleteCertification(String certificationCode) {
        certificationRepository.deleteById(certificationCode);
        final Mono<Certification> dbCertification = certificationRepository.findById(certificationCode).switchIfEmpty(Mono.error(new RuntimeException("Certification doesn't exist")));

		return dbCertification
        .switchIfEmpty(Mono.empty())
        .filter(Objects::nonNull)
        .flatMap(certificationToDelete -> certificationRepository.delete(certificationToDelete).then(Mono.just(certificationToDelete)));
    }
}
