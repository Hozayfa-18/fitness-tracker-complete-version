package com.example.backend.likes;

import com.example.backend.activity.Activity;
import com.example.backend.activity.ActivityRepository;
import com.example.backend.activity.ActivityService;
import com.example.backend.friends.Friendship;
import com.example.backend.friends.FriendshipRepository;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class LikesService {

    @Autowired
    private LikesRepository likesRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;


    public void likeActivity(Long activityId, String username) {
        User user = userRepository.findByUsername(username);
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new IllegalStateException("Aktivität nicht gefunden"));

        if (user == null) {
            throw new IllegalStateException("Benutzer nicht gefunden.");
        }

        // Admin-Status prüfen
        boolean isAdmin = user.getRole().equals("admin");

        // Sichtbarkeit prüfen
        switch (activity.getVisibility()) {
            case PUBLIC:
                break;

            case FRIENDS:
                boolean areFriends = checkIfFriends(user, activity.getUser());
                if (!areFriends && !isAdmin) {
                    throw new IllegalStateException("Diese Aktivität kann nur von Freunden geliked werden.");
                }
                break;

            case PRIVATE:
                if (!isAdmin) {
                    throw new IllegalStateException("Diese Aktivität kann nur von einem Admin geliked werden.");
                }
                break;

            default:
                throw new IllegalStateException("Ungültige Sichtbarkeit.");
        }

        // Überprüfen, ob der Benutzer die Aktivität bereits geliked hat
        if (likesRepository.existsByUserAndActivity(user, activity)) {
            return;
        }

        // Like erstellen und speichern
        Likes like = new Likes(user, activity);
        likesRepository.save(like);
    }

    // Prüfen, ob zwei Benutzer Freunde sind
    private boolean checkIfFriends(User user1, User user2) {
        Friendship friendship = friendshipRepository.findByUser1AndUser2(user1, user2);


        if (friendship == null) {
            friendship = friendshipRepository.findByUser1AndUser2(user2, user1);
        }

        return friendship != null; // Wenn eine Freundschaft existiert, zurückgeben
    }



    // Like entfernen
    public void unlikeActivity(Long activityId, String username) {
        User user = userRepository.findByUsername(username);
        Activity activity = activityRepository.findById(activityId).orElseThrow(() -> new IllegalStateException("Aktivität nicht gefunden"));

        if (user == null) {
            throw new IllegalStateException("Kein User");
        }
        // Finde das Like
        Likes like = likesRepository.findByUserAndActivity(user, activity).orElseThrow(() -> new IllegalStateException("Like nicht gefunden"));

        // Like entfernen
        likesRepository.delete(like);
    }

    // Überprüfen, ob der Benutzer die Aktivität geliked hat
    public boolean getIfLiked(Long activityId, String username) {
        User user = userRepository.findByUsername(username);
        Activity activity = activityRepository.findById(activityId).orElseThrow(() -> new IllegalStateException("Aktivität nicht gefunden"));

        if (user == null) {
            throw new IllegalStateException("Kein User");
        }
        return likesRepository.existsByUserAndActivity(user, activity);
    }

    // Zählt die Anzahl der Likes für eine bestimmte Aktivität
    public int countLikesForActivity(Long activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new IllegalStateException("Aktivität nicht gefunden"));
        return likesRepository.countByActivity(activity);
    }

    // Zählt die Anzahl der Likes eines bestimmten Benutzers
    public int countLikesForUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalStateException("Benutzer nicht gefunden.");
        }

        // Hole alle Aktivitäten des Benutzers
        List<Activity> activities = activityRepository.findByUser(user);

        // Summiere die Likes für alle Aktivitäten
        int totalLikes = 0;
        for (Activity activity : activities) {
            totalLikes += likesRepository.countByActivity(activity);
        }

        return totalLikes;
    }
    }



