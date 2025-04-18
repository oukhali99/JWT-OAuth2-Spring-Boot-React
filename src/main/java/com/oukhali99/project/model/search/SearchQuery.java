package com.oukhali99.project.model.search;

public interface SearchQuery<T> {

    boolean match(T entity);

}
