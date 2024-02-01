package com.oukhali99.project.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Embeddable
@NoArgsConstructor
@Data
public class Price {

    private Long dollars;

    private Integer cents;

    public Price(Long dollars, int cents) {
        this.dollars = dollars + cents / 100;
        this.cents = cents % 100;

    }

    public Price(Long dollars) {
        this(dollars, 0);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();

        if (dollars != null) {
            sb.append('$');
            sb.append(dollars);
        }
        if (cents != null) {
            sb.append(".");
            sb.append(cents);
        }

        return sb.toString();
    }
}
