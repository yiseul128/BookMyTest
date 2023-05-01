/**
 * Developer Name: Yiseul Ko
 * Date: 2023 April 30
 */

package com.yiseul.bookmytest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.server.WebFilter;

/**
 * WebConfig is a configuration class for the web application.
 * It sets up CORS configurations and logging filters.
 */
@Configuration
@EnableWebFlux
public class WebConfig {

    /**
     * Configures CORS for the application, allowing specified origins, headers, and methods.
     *
     * @return a CorsConfigurationSource object with the configured CORS settings
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowCredentials(true);
        corsConfig.addAllowedOrigin("http://localhost:3000");
        corsConfig.addAllowedHeader("*");
        corsConfig.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return source;
    }

    /**
     * Creates a WebFilter to add CORS headers to the response.
     *
     * @return a WebFilter that adds CORS headers to the response
     */
    @Bean
    public WebFilter corsFilter() {
        return (exchange, chain) -> {
            if (exchange.getRequest().getHeaders().getAccessControlRequestMethod() != null) {
                exchange.getResponse().getHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
                exchange.getResponse().getHeaders().add("Access-Control-Allow-Headers", "*");
            }
            return chain.filter(exchange);
        };
    }

    /**
     * Creates a WebFilter to log incoming requests.
     *
     * @return a WebFilter that logs the method and URI of each incoming request
     */
    @Bean
    public WebFilter loggingFilter() {
        return (exchange, chain) -> {
            System.out.println("Request: " + exchange.getRequest().getMethod() + " " + exchange.getRequest().getURI());
            return chain.filter(exchange);
        };
    }
}
