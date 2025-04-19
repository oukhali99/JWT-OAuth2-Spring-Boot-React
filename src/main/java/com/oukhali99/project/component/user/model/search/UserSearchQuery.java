package com.oukhali99.project.component.user.model.search;

import com.oukhali99.project.component.user.User;
import com.oukhali99.project.model.search.SearchQuery;
import com.oukhali99.project.model.search.StringSearchQuery;
import lombok.Data;

@Data
public class UserSearchQuery implements SearchQuery<User> {
    private StringSearchQuery firstNameSearchQuery;
    private StringSearchQuery lastNameSearchQuery;
    private StringSearchQuery emailSearchQuery;

    @Override
    public boolean match(User entity) {
        if (firstNameSearchQuery != null && !firstNameSearchQuery.match(entity.getFirstName())) return false;
        if (lastNameSearchQuery != null && !lastNameSearchQuery.match(entity.getLastName())) return false;
        if (emailSearchQuery != null && !emailSearchQuery.match(entity.getEmail())) return false;

        return true;
    }
}
