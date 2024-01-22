package com.oukhali99.project.component.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user")
public class User implements UserDetails {

    @Id
    @GeneratedValue
    private Long id;

    private String firstName;

    private String lastName;

    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String passwordHash;

    private List<String> authorityStringList;

    @ManyToMany
    private List<User> receivedFriendRequests;

    @ManyToMany
    private List<User> friends;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorityList = new LinkedList<>();

        for (String authorityString : authorityStringList) {
            authorityList.add(new SimpleGrantedAuthority(authorityString));
        }

        return authorityList;
    }

    public void addAuthorityString(String authorityString) {
        if (authorityStringList == null) {
            authorityStringList = new LinkedList<>();
        }

        authorityStringList.add(authorityString);
    }

    public void addFriend(User user) {
        if (receivedFriendRequests.contains(user)) {
            receivedFriendRequests.remove(user);
        }

        if (!friends.contains(user)) {
            friends.add(user);
        }
    }

    public void addReceivedFriendRequest(User user) {
        if (!receivedFriendRequests.contains(user)) {
            receivedFriendRequests.add(user);
        }
    }

    public void removeFriend(User user) {
        if (friends.contains(user)) {
            friends.remove(user);
        }
        if (receivedFriendRequests.contains(user)) {
            receivedFriendRequests.remove(user);
        }
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id.equals(user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}
