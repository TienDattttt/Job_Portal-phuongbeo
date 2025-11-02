package com.job.backend.config;

import com.job.backend.service.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1️⃣ Cho phép public endpoints
                        .requestMatchers("/api/auth/**", "/uploads/**").permitAll()

                        // 2️⃣ Ứng viên (role: UNGVIEN)
                        .requestMatchers("/api/profile/**", "/api/applications/**").hasAnyAuthority("UNGVIEN", "ADMIN")

                        // 3️⃣ Nhà tuyển dụng (role: NTD)
                        .requestMatchers("/api/jobs/**", "/api/interviews/**", "/api/statistics/**").hasAnyAuthority("NTD", "ADMIN")

                        // 4️⃣ Quản trị viên
                        .requestMatchers("/api/employers/**").hasAuthority("ADMIN")

                        // 5️⃣ Mặc định
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
