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
                .orElseThrow(() -> new IllegalStateException("Aktivit�t nicht gefunden"));

        if (user == null) {
            throw new IllegalStateException("Benutzer nicht gefunden.");
        }

        // Admin-Status pr�fen
        boolean isAdmin = user.getRole().equals("admin");

        // Sichtbarkeit pr�fen
        switch (activity.getVisibility()) {
            case PUBLIC:
                break;

            case FRIENDS:
                boolean areFriends = checkIfFriends(user, activity.getUser());
                if (!areFriends && !isAdmin) {
                    throw new IllegalStateException("Diese Aktivit�t kann nur von Freunden geliked werden.");
                }
                break;

            case PRIVATE:
                if (!isAdmin) {
                    throw new IllegalStateException("Diese Aktivit�t kann nur von einem Admin geliked werden.");
                }
                break;

            default:
                throw new IllegalStateException("Ung�ltige Sichtbarkeit.");
        }

        // �berpr�fen, ob der Benutzer die Aktivit�t bereits geliked hat
        if (likesRepository.existsByUserAndActivity(user, activity)) {
            return;
        }

        // Like erstellen und speichern
        Likes like = new Likes(user, activity);
        likesRepository.save(like);
    }

    // Pr�fen, ob zwei Benutzer Freunde sind
    private boolean checkIfFriends(User user1, User user2) {
        Friendship friendship = friendshipRepository.findByUser1AndUser2(user1, user2);


        if (friendship == null) {
            friendship = friendshipRepository.findByUser1AndUser2(user2, user1);
        }

        return friendship != null; // Wenn eine Freundschaft existiert, zur�ckgeben
    }



    // Like entfernen
    public void unlikeActivity(Long activityId, String username) {
        User user = userRepository.findByUsername(username);
        Activity activity = activityRepository.findById(activityId).orElseThrow(() -> new IllegalStateException("Aktivit�t nicht gefunden"));

        if (user == null) {
            throw new IllegalStateException("Kein User");
        }
        // Finde das Like
        Likes like = likesRepository.findByUserAndActivity(user, activity).orElseThrow(() -> new IllegalStateException("Like nicht gefunden"));

        // Like entfernen
        likesRepository.delete(like);
    }

    // �berpr�fen, ob der Benutzer die Aktivit�t geliked hat
    public boolean getIfLiked(Long activityId, String username) {
        User user = userRepository.findByUsername(username);
        Activity activity = activityRepository.findById(activityId).orElseThrow(() -> new IllegalStateException("Aktivit�t nicht gefunden"));

        if (user == null) {
            throw new IllegalStateException("Kein User");
        }
        return likesRepository.existsByUserAndActivity(user, activity);
    }

    // Z�hlt die Anzahl der Likes f�r eine bestimmte Aktivit�t
    public int countLikesForActivity(Long activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new IllegalStateException("Aktivit�t nicht gefunden"));
        return likesRepository.countByActivity(activity);
    }

    // Z�hlt die Anzahl der Likes eines bestimmten Benutzers
    public int countLikesForUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalStateException("Benutzer nicht gefunden.");
        }

        // Hole alle Aktivit�ten des Benutzers
        List<Activity> activities = activityRepository.findByUser(user);

        // Summiere die Likes f�r alle Aktivit�ten
        int totalLikes = 0;
        for (Activity activity : activities) {
            totalLikes += likesRepository.countByActivity(activity);
        }

        return totalLikes;
    }
    }



