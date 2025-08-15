package com.example.backend.friends;

import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendshipService {

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;


    // Freunde abrufen mit Sichtbarkeitsprüfung
    public List<User> getVisibleFriends(String currentUsername, String profileUsername) {
        User currentUser = userRepository.findByUsername(currentUsername);
        User profileUser = userRepository.findByUsername(profileUsername);

        if (currentUser == null || profileUser == null) {
            return List.of(); // Falls Benutzer nicht existieren
        }

        boolean isAdmin = "admin".equals(currentUser.getRole());
        boolean isUser = "user".equals(currentUser.getRole());

        // Admins dürfen immer die Freundesliste sehen
        if (isAdmin) {
            return getFriends(profileUsername);
        }

        // Sichtbarkeit prüfen
        if (isUser && profileUser.getFriendListPublic()) {
            return getFriends(profileUsername);
        }


        // Freundesliste nicht sichtbar und kein Admin
        return List.of();
    }


     public List<User> getFriends(String username) {
        List<Friendship> friendships = friendshipRepository.findFriendsByUsername(username);

        return friendships.stream()
                .map(f -> f.getUser1().getUsername().equals(username) ? f.getUser2() : f.getUser1())
                .collect(Collectors.toList());
    }


    // Freundschaft entfernen (löschen)
    public void removeFriend(String username1, String username2) {
        User user1 = userRepository.findByUsername(username1);
        User user2 = userRepository.findByUsername(username2);

        if (user1 != null && user2 != null) {
            Friendship friendship1 = friendshipRepository.findByUser1AndUser2(user1, user2);
            Friendship friendship2 = friendshipRepository.findByUser1AndUser2(user2, user1);

            if (friendship1 != null) {
                friendshipRepository.delete(friendship1);
            }

            if (friendship2 != null) {
                friendshipRepository.delete(friendship2);
           }
        }
    }
}
