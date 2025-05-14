package com.oukhali99.project.config;

import javax.sql.DataSource;

import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;
import software.amazon.awssdk.regions.Region;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Optional;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.host}")
    private String host;

    @Value("${spring.datasource.port}")
    private String port;

    @Value("${spring.datasource.database}")
    private String database;

    @Value("${spring.datasource.aws-db-secret-arn}")
    private String awsDbSecretArn;

    @Value("${aws.region}")
    private String awsRegion;

    @Bean
    public DataSource dataSource() {
        String password = this.password;
        if (password.isEmpty()) {
            password = getPasswordFromAwsSecret(awsDbSecretArn);
        }        

        String jdbcUrl = String.format("jdbc:postgresql://%s:%s/%s?client_encoding=utf8", host, port, database);

        return DataSourceBuilder.create()
            .url(jdbcUrl)
            .username(username)
            .password(password)
            .driverClassName("org.postgresql.Driver")
            .build();
    }

    private String getPasswordFromAwsSecret(String awsDbSecretArn) {
        SecretsManagerClient secretManagerClient = SecretsManagerClient.builder()
            .region(Region.of(awsRegion))
            .build();

        GetSecretValueRequest getSecretValueRequest = GetSecretValueRequest.builder()
            .secretId(awsDbSecretArn)
            .build();

        GetSecretValueResponse getSecretValueResponse = secretManagerClient.getSecretValue(getSecretValueRequest);

        String secretString = getSecretValueResponse.secretString();
        if (secretString == null) {
            throw new RuntimeException("Secret string is null");
        }

        // Parse JSON to get the password
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode secretJson = objectMapper.readTree(secretString);
            JsonNode passwordNode = secretJson.get("password");

            if (passwordNode == null || passwordNode.isNull()) {
                throw new RuntimeException("Password not found in secret JSON");
            }

            return passwordNode.asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse secret JSON", e);
        }
    }

}
