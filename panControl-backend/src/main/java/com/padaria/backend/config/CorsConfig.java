package com.padaria.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Libera todos os endpoints da API
                .allowedOrigins("http://localhost:5173") // O endereço do front
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Os métodos permitidos
                .allowedHeaders("*"); // Permite qualquer tipo de cabeçalho
    }
}