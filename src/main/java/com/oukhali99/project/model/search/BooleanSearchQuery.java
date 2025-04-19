package com.oukhali99.project.model.search;

import lombok.Data;

@Data
public class BooleanSearchQuery implements SearchQuery<Boolean> {
    private Boolean value;

    @Override
    public boolean match(Boolean entity) {
        if (value == null) return true;
        return entity == value;
    }
}
