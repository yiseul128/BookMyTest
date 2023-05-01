package com.yiseul.bookmytest.utils;

import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.yiseul.bookmytest.authentication.Credentials;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    /**
     * The JWT token validity in seconds.
     */
    public static final long JWT_TOKEN_VALIDITY = 5 * 60 * 60;

    /**
     * The secret key used to sign the JWT.
     */
    private final Key secret = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    /**
     * Returns the username (subject) from the JWT token.
     *
     * @param token the JWT token
     * @return the username (subject) of the token
     */
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    /**
     * Returns the expiration date of the JWT token.
     *
     * @param token the JWT token
     * @return the expiration date of the token
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    /**
     * Retrieves a specific claim from the JWT token using a claims resolver.
     *
     * @param token the JWT token
     * @param claimsResolver the function to retrieve the claim
     * @param <T> the type of the claim
     * @return the requested claim from the token
     */
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Returns all claims from the JWT token.
     *
     * @param token the JWT token
     * @return the claims from the token
     */
    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(secret).build().parseClaimsJws(token).getBody();
    }

    /**
     * Checks if the JWT token is expired.
     *
     * @param token the JWT token
     * @return true if the token is expired, false otherwise
     */
    public Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    /**
     * Generates a new JWT token for the given user details.
     *
     * @param credentials for user obj and user details
     * @return the generated JWT token
     */
    public String generateToken(Credentials credentials) {
        Map<String, Object> claims = new HashMap<>();
        Collection<? extends GrantedAuthority> roles = credentials.getUserDetails().getAuthorities();

        // Adding roles to the claims
        claims.put("roles", roles.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
        claims.put("userId", credentials.getUser().getUserId());
        claims.put("username", credentials.getUser().getUsername());
        claims.put("firstName", credentials.getUser().getFirstName());
        claims.put("lastName", credentials.getUser().getLastName());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(credentials.getUserDetails().getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    /**
     * Validates the given JWT token against the user details.
     *
     * @param token the JWT token
     * @param userDetails the user details
     * @return true if the token is valid, false otherwise
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
