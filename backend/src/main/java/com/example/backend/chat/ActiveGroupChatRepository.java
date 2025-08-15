package com.example.backend.chat;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ActiveGroupChatRepository extends JpaRepository<ActiveGroupChat, Long> {

    @Query("SELECT a FROM ActiveChat a WHERE a.username = :username")
    Optional<ActiveGroupChat> findByUsername(@Param("username") String username);

    @Transactional
    @Modifying
    @Query("UPDATE ActiveGroupChat a SET a.group_id = :group_id, a.lastUpdated = CURRENT_TIMESTAMP WHERE a.username = :username")
    void updateGroupChatWith(@Param("username") String username, @Param("group_id") Long group_id);


}
