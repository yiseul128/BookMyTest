/**
 * Developer Name: Yiseul Ko
 * Date: 2023 April 30
 */

package com.yiseul.bookmytest.repositories;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.yiseul.bookmytest.models.Certification;

public interface CertificationRepository  extends ReactiveMongoRepository<Certification, String>{
    
}
