package com.oukhali99.project.util;

import com.oukhali99.project.exception.MyExceptionWrapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GoogleSecretRetriever {

    @Value("${spring.google.client-secret.value}")
    private String googleClientSecret;

    @Value("${spring.google.client-secret.aws-secret-arn}")
    private String awsSecretGoogleArn;

    private AWSSecretRetriever awsSecretRetriever;

    public GoogleSecretRetriever() {
        awsSecretRetriever = new AWSSecretRetriever(awsSecretGoogleArn);
    }

    public String getGoogleClientSecret() throws MyExceptionWrapper {
        if (!googleClientSecret.isEmpty()) return googleClientSecret;
        return awsSecretRetriever.getSecret("client_secret");
    };

}
