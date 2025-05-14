package com.oukhali99.project.config;

import javax.sql.DataSource;

import com.oukhali99.project.exception.MyExceptionWrapper;
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
import com.oukhali99.project.util.AWSSecretRetriever;

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
    public DataSource dataSource() throws MyExceptionWrapper {
        String password = this.password;
        if (password.isEmpty()) {
            AWSSecretRetriever awsSecretRetriever = new AWSSecretRetriever(awsDbSecretArn);
            password = awsSecretRetriever.getSecret("password");
        }        

        String jdbcUrl = String.format("jdbc:postgresql://%s:%s/%s?client_encoding=utf8", host, port, database);

        return DataSourceBuilder.create()
            .url(jdbcUrl)
            .username(username)
            .password(password)
            .driverClassName("org.postgresql.Driver")
            .build();
    }

}
