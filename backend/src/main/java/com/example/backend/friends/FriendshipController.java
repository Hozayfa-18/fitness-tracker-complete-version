package com.example.backend.friends;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend.user.User;

import java.util.List;

@RestController
@RequestMapping("/friendships")
@CrossOrigin(origins = "http://localhost:4200")
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    // Sichtbare Freunde eines Benutzers abrufen
    @GetMapping("/visible-friends")
    public ResponseEntity<List<User>> getVisibleFriends(@RequestParam String currentUsername,
                                                        @RequestParam String profileUsername) {
        try {
            List<User> friends = friendshipService.getVisibleFriends(currentUsername, profileUsername);
            return ResponseEntity.ok(friends);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Alle Freunde eines Benutzers abrufen
    @GetMapping("/friends")
    public ResponseEntity<List<User>> getFriends(@RequestParam String username) {
        try {
            List<User> friends = friendshipService.getFriends(username);
            return ResponseEntity.ok(friends);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Freund entfernen (Löschen der Freundschaft)
    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFriend(@RequestParam String username1,
                                             @RequestParam String username2) {
        try {
            friendshipService.removeFriend(username1, username2);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


}
