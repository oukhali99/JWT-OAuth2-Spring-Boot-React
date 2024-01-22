package com.oukhali99.project.model;

import jakarta.persistence.Embeddable;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Embeddable
public class Price {

    private final Long dollars;

}
