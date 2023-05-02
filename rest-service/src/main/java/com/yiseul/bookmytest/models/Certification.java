/**
 * Developer Name: Yiseul Ko
 * Date: 2023 April 30
 */

package com.yiseul.bookmytest.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@AllArgsConstructor
@Document
@ToString
public class Certification {
    @Id
    @NotNull(message = "Certification Code cannot be null")
    @Pattern(regexp = "^[A-Z]{3}-\\d{3}$", message = "Invalid Certification Code format. Example of Certification Code: AAA-001")  
    private String certificationCode;

    @NotBlank(message = "Certification name cannot be blank")
    private String certificationName;

    @NotNull(message = "Passing score cannot be blank")
    @DecimalMin(value = "0.00", inclusive = false, message = "Passing score must be greater than {value}")
    @DecimalMax(value = "100.00", message = "Passing score cannot be greater than {value}")
    private double passingScore;

    @NotNull(message = "Fee cannot be blank")
    @DecimalMin(value = "0.01", inclusive = false, message = "Fee cannot be {value}")
    private double fee;

    public Certification() {}
}
