package com.example.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary  // Markiere diesen Bean als "Primary"
    public ObjectMapper jsonObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        // Registriere das Modul für Java-Zeit-Unterstützung
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }

    @Bean
    public XmlMapper xmlMapper() {
        XmlMapper mapper = new XmlMapper();
        // Registriere das Modul für Java-Zeit-Unterstützung
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }
}
