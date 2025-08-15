package com.example.backend.chat;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/messages")
public class ChatMessageController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private ChatMessageService chatMessageService;

    @GetMapping
    public List<ChatMessage> getMessages(
            @RequestParam String sender,
            @RequestParam String receiver) {
        return chatMessageRepository.findMessagesBetweenUsers(sender, receiver);
    }

    @PostMapping
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage chatMessage) {
        ChatMessage savedMessage = chatMessageService.saveMessage(chatMessage);
        return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
    }

    @GetMapping("/private")
    public List<ChatMessage> getPrivateMessages(@RequestParam String sender, @RequestParam String receiver) {
        return chatMessageRepository.findMessagesBetweenUsers(sender, receiver);
    }

    @PostMapping("/createGroup")
    public ResponseEntity<Group> createGroup(@RequestBody Group group) {
        Group savedGroup = chatMessageService.createGroup(group);
        return new ResponseEntity<>(savedGroup, HttpStatus.CREATED);
    }

    @GetMapping("/group")
    public List<ChatMessage> getGroupMessages(@RequestParam Long groupId) {
        return chatMessageService.getGroupMessages(groupId);
    }

    @GetMapping("/userGroups")
    public List<Group> getUserGroups(@RequestParam String username) {
        return groupRepository.findGroupsByMember(username);
    }

    @PutMapping("/editMessage")
    public ResponseEntity<Void> editMessage(@RequestParam Long id, @RequestBody Map<String, String> body) {
        String newContent = body.get("content");
        if (newContent == null || newContent.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        chatMessageService.editMessage(id, newContent);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteMessage")
    public ResponseEntity<Void> deleteMessage(@RequestParam Long id) {
        chatMessageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/updateIsRead")
    public ResponseEntity<Void> updateIsRead(@RequestParam String senderUsername, @RequestParam String receiverUsername) {
        chatMessageService.updateIsReadIfBothActive(senderUsername, receiverUsername);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/updateActiveChat")
    public ResponseEntity<Void> updateActiveChat(@RequestParam String username, @RequestParam String chatWith) {
        chatMessageService.updateChatState(username, chatWith);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/updateActiveGroupChat")
    public ResponseEntity<Void> updateGroupChatState(@RequestParam String username, @RequestParam Long groupId) {
        chatMessageService.updateGroupChatState(username, groupId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/updateGroupIsRead")
    public ResponseEntity<Void> updateGroupIsRead(@RequestParam String senderUsername, @RequestParam Long groupId) {
        chatMessageService.updateGroupIsRead(senderUsername, groupId);
        return ResponseEntity.ok().build();
    }

}
