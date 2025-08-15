package com.example.backend.chat;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private ActiveChatRepository activeChatRepository;
    @Autowired
    private ActiveGroupChatRepository activeGroupChatRepository;

    public ChatMessage saveMessage(ChatMessage chatMessage) {
        chatMessage.setTimestamp(LocalDateTime.now()); // Set the current timestamp
        return chatMessageRepository.save(chatMessage);
    }

    public List<ChatMessage> getGroupMessages(Long groupId) {
        return chatMessageRepository.findMessagesInGroup(groupId);
    }

    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    public void  editMessage(Long id, String content) {
        ChatMessage message = chatMessageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Message not found"));

        if (message.isRead()) {
            throw new IllegalStateException("Cannot edit a read message");
        }

        chatMessageRepository.editMessage(id, content); // Simply execute the query

    }

    public void deleteMessage(Long id) {
        ChatMessage message = chatMessageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Message not found"));

        if (message.isRead()) {
            throw new IllegalStateException("Cannot delete a read message");
        }

        chatMessageRepository.deleteUnreadMessage(id); // Execute the query

    }

    public void updateMessageContent(Long id, String newContent) {
        ChatMessage message = chatMessageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Message not found"));
        message.setContent(newContent);
        chatMessageRepository.save(message);
    }

    public void updateIsRead(String senderUsername, String receiverUsername) {
        System.out.println("Updating read status for messages from " + senderUsername + " to " + receiverUsername);
        chatMessageRepository.updateIsRead(senderUsername, receiverUsername);
    }

    public void updateChatState(String username, String chatWith) {
        Optional<ActiveChat> activeChat = activeChatRepository.findByUsername(username);
        if (activeChat.isPresent()) {
            activeChatRepository.updateChatWith(username, chatWith);
        } else {
            ActiveChat newChat = new ActiveChat();
            newChat.setUsername(username);
            newChat.setChatWith(chatWith);
            newChat.setLastUpdated(LocalDateTime.now());
            activeChatRepository.save(newChat);
        }
    }

    public boolean areBothUsersChatting(String user1, String user2) {
        Optional<ActiveChat> user1Chat = activeChatRepository.findByUsername(user1);
        Optional<ActiveChat> user2Chat = activeChatRepository.findByUsername(user2);

        return user1Chat.isPresent() && user2Chat.isPresent() &&
                user1Chat.get().getChatWith().equals(user2) &&
                user2Chat.get().getChatWith().equals(user1);
    }

    public void updateIsReadIfBothActive(String sender, String receiver) {
        System.out.println("are both users chatting?? " + areBothUsersChatting(sender, receiver));
        if (areBothUsersChatting(sender, receiver)) {
            chatMessageRepository.updateIsRead(sender, receiver);
        }
    }

    public void updateGroupChatState(String username, Long groupId) {
        Optional<ActiveGroupChat> activeGroupChat = activeGroupChatRepository.findByUsername(username);
        if (activeGroupChat.isPresent()) {
            activeGroupChatRepository.updateGroupChatWith(username, groupId);
        } else {
            ActiveGroupChat newChat = new ActiveGroupChat();
            newChat.setUsername(username);
            newChat.setGroup_id(groupId);
            newChat.setLastUpdated(LocalDateTime.now());
            activeGroupChatRepository.save(newChat);
        }
    }

    public void updateGroupIsRead(String sender, Long groupId){
        chatMessageRepository.updateGroupIsRead(sender, groupId);
    }
}
