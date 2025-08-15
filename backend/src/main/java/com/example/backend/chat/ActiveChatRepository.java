package com.example.backend.chat;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActiveChatRepository extends JpaRepository<ActiveChat, Long> {

    @Query("SELECT a FROM ActiveChat a WHERE a.username = :username")
    Optional<ActiveChat> findByUsername(@Param("username") String username);

    @Transactional
    @Modifying
    @Query("UPDATE ActiveChat a SET a.chatWith = :chatWith, a.lastUpdated = CURRENT_TIMESTAMP WHERE a.username = :username")
    void updateChatWith(@Param("username") String username, @Param("chatWith") String chatWith);

}
