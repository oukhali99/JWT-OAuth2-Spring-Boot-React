package com.oukhali99.project.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Embeddable
@NoArgsConstructor
@Data
public class Price implements Comparable<Price> {

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

    @Override
    public int compareTo(Price o) {
        if (this.dollars == null || this.cents == null) return -1;
        if (o.dollars == null || o.cents == null) return 1;

        if (this.equals(o)) return 0;
        if (this.dollars > o.dollars) return 1;
        if (this.dollars.equals(o.dollars) && this.cents > o.cents) return 1;

        return -1;
    }

    public boolean equals(Price o) {
        if (this.dollars == null || this.cents == null) return false;
        if (o.dollars == null || o.cents == null) return false;

        return this.dollars.equals(o.dollars) && this.cents.equals(o.cents);
    }
}
