/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 4
 */

package com.yiseul.bookmytest.models;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Document
public class ChangePasswordRequest {
    @NotBlank
    private String oldPassword;

    @NotBlank
    private String newPassword;

    public ChangePasswordRequest() {};
}
