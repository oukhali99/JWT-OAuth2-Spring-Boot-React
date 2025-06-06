package com.oukhali99.project.model.search;

import lombok.Data;

@Data
public class StringSearchQuery implements SearchQuery<String> {
    private String searchString;

    @Override
    public boolean match(String entity) {
        if (searchString == null) return true;
        if (entity == null) return false;
        return entity.contains(searchString);
    }
}
