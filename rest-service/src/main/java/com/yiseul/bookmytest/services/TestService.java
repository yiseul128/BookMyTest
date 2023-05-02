/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 1
 */

package com.yiseul.bookmytest.services;

import java.time.LocalDateTime;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yiseul.bookmytest.models.Certification;
import com.yiseul.bookmytest.models.Test;
import com.yiseul.bookmytest.models.TestCentre;
import com.yiseul.bookmytest.models.User;
import com.yiseul.bookmytest.repositories.CertificationRepository;
import com.yiseul.bookmytest.repositories.TestCentreRepository;
import com.yiseul.bookmytest.repositories.TestRepository;
import com.yiseul.bookmytest.repositories.UserRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service for managing tests, including CRUD operations.
 */
@Service
public class TestService {
    @Autowired
	private TestRepository testRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CertificationRepository certificationRepository;

	@Autowired
	private TestCentreRepository testCentreRepository;

    public Flux<Test> getAllTests() {
		return testRepository.findAll();
	}

    public Flux<Test> getAllTestsByCandidateId(String candidateId) {
		return testRepository.findByCandidateId(candidateId);
	}

    public Mono<Test> getTest(String testCode) {
		return testRepository.findById(testCode);
	}

    public Mono<Boolean> checkDateConflicts(String candidateId, LocalDateTime bookedTestDate) {
		LocalDateTime dayPlus7d = LocalDateTime.now().plusDays(7);

		// Check if the selected test date is at least 7 days from the current date
		if (bookedTestDate.isAfter(dayPlus7d)) {
			// Find the start and end of the day for the bookedTestDate
			LocalDateTime startOfDay = bookedTestDate.toLocalDate().atStartOfDay();
			LocalDateTime endOfDay = startOfDay.plusDays(1);

			// Find conflicts by candidateId and date
			Flux<Test> foundConflicts = testRepository.findByCandidateIdAndDate(candidateId, startOfDay, endOfDay);

			return foundConflicts.hasElements().map(hasElements -> !hasElements);
		} else {
			// If the new date is less than or equal to seven days from the current date,
			// return a Mono<Boolean> with a value false
			return Mono.just(false);
		}

	}

    public Mono<Test> addTest(Test test) {

		// enforce relationships
		String candidateId = test.getCandidateId();
		String certificationCode = test.getCertificationCode();
		String testCentreCode = test.getCentreCode();

		Mono<User> monoRepoCandidate = userRepository.findById(candidateId);
		Mono<TestCentre> monoRepoTestCentre = testCentreRepository.findById(testCentreCode);
		Mono<Certification> monoRepoCertification = certificationRepository.findById(certificationCode);

		return Mono.zip(monoRepoCandidate, monoRepoTestCentre, monoRepoCertification)
				.switchIfEmpty(
						Mono.error(new RuntimeException("Certification, Test centre, or Candidate does not exist")))
				.flatMap(tuple -> {
					// Call the checkDateConflicts method and return a Mono<Boolean>
					return checkDateConflicts(candidateId, test.getDateAndTime())
							.flatMap(isDateAvailable -> {
								// If the date is available (no conflicts), save the test
								if (isDateAvailable) {
									// Set the result
									test.setResult(test.getScore());
									return testRepository.save(test);
								} else {
									// If the date is not available, return an error
									return Mono.error(
											new RuntimeException("Date conflict or invalid date detected"));
								}
							});
				});
	}

    public Mono<Test> updateTest(String testCode, Test test) {

		// attach provided id to the input test obj
		test.setTestCode(testCode);

		// enforce relationships
		Mono<Test> monoRepoTest = testRepository.findById(testCode);

		String candidateId = test.getCandidateId();
		String certificationCode = test.getCertificationCode();
		String testCentreCode = test.getCentreCode();

		Mono<User> monoRepoCandidate = userRepository.findById(candidateId);
		Mono<TestCentre> monoRepoTestCentre = testCentreRepository.findById(testCentreCode);
		Mono<Certification> monoRepoCertification = certificationRepository.findById(certificationCode);

		return Mono.zip(monoRepoCandidate, monoRepoTestCentre, monoRepoCertification, monoRepoTest)
				.switchIfEmpty(Mono
						.error(new RuntimeException("Test, Certification, Test centre, or Candidate does not exist")))
				.flatMap(tuple -> {
					if (test.getStatus().equals("Completed")) {
						// Set the result
						test.setResult(test.getScore());
						return testRepository.save(test);
					} else {
						// Call the checkDateConflicts method and return a Mono<Boolean>
						return checkDateConflicts(candidateId, test.getDateAndTime())
								.flatMap(isDateAvailable -> {
									// If the date is available (no conflicts), save the test
									if (isDateAvailable) {
										// Set the result
										test.setResult(test.getScore());
										return testRepository.save(test);
									} else {
										// If the date is not available, return an error
										return Mono.error(new RuntimeException(
												"Date conflict or invalid date detected"));
									}
								});
					}

				});
	}

    public Mono<Test> deleteTest(String id) {
		final Mono<Test> dbTest = testRepository.findById(id);
		if (Objects.isNull(dbTest)) {
			return Mono.error(new RuntimeException("Test doesn't exist"));
		}

		return dbTest
				.switchIfEmpty(Mono.empty())
				.filter(Objects::nonNull)
				.flatMap(testToDelete -> testRepository.delete(testToDelete).then(Mono.just(testToDelete)));
	}
    
}
