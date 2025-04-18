package com.oukhali99.project.model.search;

import lombok.Data;

@Data
public class StringSearchQuery implements SearchQuery<String> {
    private String searchString;

    @Override
    public boolean match(String entity) {
        return entity.contains(searchString);
    }
}
