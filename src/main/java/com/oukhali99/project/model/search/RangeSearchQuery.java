package com.oukhali99.project.model.search;

import com.oukhali99.project.exception.MyMessageException;

public class RangeSearchQuery<T extends Comparable<T>> implements SearchQuery<T> {
    private T min, max;

    public RangeSearchQuery(T min, T max) throws MyMessageException {
        this.min = min;
        this.max = max;

        if (max.compareTo(min) < 0) throw new MyMessageException("Max must be greater than min");
    }

    @Override
    public boolean match(T entity) {
        if (entity.compareTo(max) > 0) return false;
        if (entity.compareTo(min) < 0) return false;

        return true;
    }
}
