package com.job.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Cho phép frontend gọi
        config.setAllowedOrigins(List.of(
                "http://localhost:8081",      // frontend dev
                "http://127.0.0.1:8081"
        ));

        // Cho phép các phương thức
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Cho phép các header
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));

        // Cho phép gửi cookie / JWT
        config.setAllowCredentials(true);

        // Áp dụng cho toàn bộ API
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
