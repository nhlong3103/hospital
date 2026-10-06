package com.hospital.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI hospitalManagementOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hospital Material Management API")
                        .description("API Documentation")
                        .version("1.0.0"));
    }
}