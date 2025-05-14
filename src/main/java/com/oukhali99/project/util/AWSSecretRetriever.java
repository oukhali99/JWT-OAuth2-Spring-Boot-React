package com.oukhali99.project.util;

import com.oukhali99.project.exception.MyExceptionWrapper;
import org.springframework.beans.factory.annotation.Value;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

public class AWSSecretRetriever {

    @Value("${aws.region}")
    private String awsRegion;

    private String secretArn;

    public AWSSecretRetriever(String secretArn) {
        this.secretArn = secretArn;
    }

    public String getSecret(String secretName) throws MyExceptionWrapper {
        SecretsManagerClient secretsManagerClient = SecretsManagerClient.builder()
            .region(Region.of(awsRegion))
            .build();

        GetSecretValueRequest getSecretValueRequest = GetSecretValueRequest.builder()
            .secretId(this.secretArn)
            .build();

        GetSecretValueResponse getSecretValueResponse = secretsManagerClient.getSecretValue(getSecretValueRequest);

        String secretString = getSecretValueResponse.secretString();
        if (secretString == null) throw new RuntimeException("Secret string is null");

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode secretJson = objectMapper.readTree(secretString);
            JsonNode secretNode = secretJson.get(secretName);

            if (secretNode == null || secretNode.isNull()) throw new RuntimeException("Secret not found in secret JSON");

            return secretNode.asText();
        } catch (Exception e) {
            throw new MyExceptionWrapper(e);
        }
    }

}
