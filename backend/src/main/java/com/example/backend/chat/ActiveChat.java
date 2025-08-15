package com.example.backend.chat;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "active_Chats")
public class ActiveChat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username; // The user

    @Column(nullable = true)
    private String chatWith; // The user they are chatting with

    @Column(nullable = false)
    private LocalDateTime lastUpdated; // For potential session timeout tracking

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getChatWith() {
        return chatWith;
    }

    public void setChatWith(String chatWith) {
        this.chatWith = chatWith;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
