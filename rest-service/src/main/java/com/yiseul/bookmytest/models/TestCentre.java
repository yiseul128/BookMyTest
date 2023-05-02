/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 1
 */

package com.yiseul.bookmytest.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
public class TestCentre {

    @Id
    @Pattern(regexp = "^TC\\d{3}$", message = "Invalid Centre Code format. Example of Test Centre Code: TC001")  
    @NotNull(message = "Centre Code is required")
    private String centreCode;

    @NotBlank
    @NotNull(message = "Centre Name is required")
    private String centreName;

    @NotBlank(message = "Postal Code is required")
    @Pattern(regexp = "^[A-Z]{1}\\d{1}[A-Z]{1}\\d{1}[A-Z]{1}\\d{1}$", message = "Postal Code should be in M1M1M1 format.")
    private String postalCode;

    public TestCentre() {}
}
