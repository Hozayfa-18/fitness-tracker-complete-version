package com.example.backend.chat;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m WHERE " +
            "(m.sender = :sender AND m.receiver = :receiver) OR " +
            "(m.sender = :receiver AND m.receiver = :sender) " +
            "ORDER BY m.timestamp ASC")
    List<ChatMessage> findMessagesBetweenUsers(@Param("sender") String sender, @Param("receiver") String receiver);

    @Query("SELECT m FROM ChatMessage m WHERE m.groupId = :groupId ORDER BY m.timestamp ASC")
    List<ChatMessage> findMessagesInGroup(@Param("groupId") Long groupId);

    @Transactional
    @Modifying
    @Query("UPDATE ChatMessage m SET m.content = :content WHERE m.id = :id AND m.isRead = false")
    void editMessage(@Param("id") Long id, @Param("content") String content);

    @Transactional
    @Modifying
    @Query("DELETE FROM ChatMessage m WHERE m.id = :id AND m.isRead = false")
    void deleteUnreadMessage(@Param("id") Long id);

    @Transactional
    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.sender = :senderUsername AND m.receiver = :receiverUsername")
    void updateIsRead(@Param("senderUsername") String senderUsername, @Param("receiverUsername") String receiverUsername);

    @Transactional
    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.sender != :senderUsername AND m.groupId = :groupId")
    void updateGroupIsRead(@Param("senderUsername") String senderUsername, @Param("groupId") Long groupId);

}
