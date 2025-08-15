package com.example.backend.chat;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="active_group_Chats")
public class ActiveGroupChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = false)
    private Long group_id;

    @Column(nullable = false, unique = true)
    private String username; // The user

    @Column(nullable = false)
    private LocalDateTime lastUpdated; // For potential session timeout tracking

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGroup_id() {
        return group_id;
    }

    public void setGroup_id(Long group_id) {
        this.group_id = group_id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
