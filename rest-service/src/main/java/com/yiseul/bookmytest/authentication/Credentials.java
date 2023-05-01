package com.yiseul.bookmytest.authentication;

import org.springframework.security.core.userdetails.UserDetails;

import com.yiseul.bookmytest.models.User;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Credentials {
    private UserDetails userDetails;
    private User user;
}
