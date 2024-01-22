package com.oukhali99.project.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Embeddable
@NoArgsConstructor
public class Price {

    private Long dollars;

}
