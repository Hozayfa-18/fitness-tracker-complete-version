package com.example.backend.comments;

import com.example.backend.activity.Activity;
import com.example.backend.comments.Comments;
import com.example.backend.comments.CommentsRepository;
import com.example.backend.friends.Friendship;
import com.example.backend.friends.FriendshipRepository;
import com.example.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.user.UserRepository;
import com.example.backend.activity.ActivityRepository;
import java.util.List;

@Service
public class CommentsService {
    @Autowired
    CommentsRepository commentsRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ActivityRepository activityRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;


    @Autowired
    public CommentsService(CommentsRepository commentsRepository) {
        this.commentsRepository = commentsRepository;
    }

    public List<Comments> getCommentsByActivityId(Long activityId) {
        return commentsRepository.findByActivityId(activityId);
    }
  /*public List<Comments> getCommentsByActivityId(Long activityId, String username) {
      // Prüfen, ob die Aktivität existiert
      Activity activity = activityRepository.findById(activityId)
              .orElseThrow(() -> new IllegalStateException("Aktivität nicht gefunden"));

      User requestingUser = userRepository.findByUsername(username);
      if (requestingUser == null) {
          throw new IllegalStateException("Benutzer nicht gefunden.");
      }

      boolean isAdmin = requestingUser.getRole().equals("admin");
      boolean isOwner = activity.getUsername().equals(username);

      // Sichtbarkeit prüfen
      switch (activity.getVisibility()) {
          case PUBLIC:
              // Öffentliche Aktivitäten: Jeder kann die Kommentare sehen
              return commentsRepository.findByActivityId(activityId);

          case FRIENDS:
              // Nur Freunde und der Ersteller dürfen die Kommentare sehen
              boolean areFriends = checkIfFriends(requestingUser, activity.getUser());
              if (!areFriends && !isOwner && !isAdmin) {
                  throw new IllegalStateException("Sie sind nicht berechtigt, die Kommentare dieser Aktivität zu sehen.");
              }
              break;

          case PRIVATE:
              // Nur der Ersteller oder ein Admin darf die Kommentare sehen
              if (!isOwner && !isAdmin) {
                  throw new IllegalStateException("Diese Aktivität ist privat. Sie können die Kommentare nicht sehen.");
              }
              break;

          default:
              throw new IllegalStateException("Ungültige Sichtbarkeit.");
      }

      // Kommentare zurückgeben, wenn die Sichtbarkeitsprüfung bestanden ist
      return commentsRepository.findByActivityId(activityId);
  } */

    public Comments addComment(String username, Long activityId, String content) {
        Activity activity = activityRepository.findById(activityId).orElseThrow(() -> new IllegalStateException("Aktvitität nicht gefunden"));

        User user = userRepository.findByUsername(username);
        if(user == null) {
            throw new IllegalStateException("User not found");
        }

        boolean isAdmin = user.getRole().equals("admin");
        boolean isOwner = activity.getUsername().equals(username);

        // Sichtbarkeit prüfen
        switch (activity.getVisibility()) {
            case PUBLIC:
                // Öffentliche Aktivitäten können von jedem kommentiert werden
                break;

            case FRIENDS:
                // Überprüfen, ob der Benutzer ein Freund des Erstellers der Aktivität ist
                boolean areFriends = checkIfFriends(user, activity.getUser());
                if (!areFriends && !isAdmin && !isOwner) {
                    throw new IllegalStateException("Diese Aktivität kann nur von Freunden kommentiert werden.");
                }
                break;

            case PRIVATE:
                // Nur Admins oder der Ersteller dürfen kommentieren
                if (!isAdmin && !isOwner && !isCommentAuthor(user, activity)) {
                    throw new IllegalStateException("Diese Aktivität ist privat. Sie können sie nicht kommentieren.");
                }
                break;

            default:
                throw new IllegalStateException("Ungültige Sichtbarkeit.");
        }

        // Kommentar erstellen und speichern
        Comments comment = new Comments(user, activity, content);
        return commentsRepository.save(comment);
    }

    // Prüfen, ob zwei Benutzer Freunde sind
    private boolean checkIfFriends(User user1, User user2) {
        Friendship friendship = friendshipRepository.findByUser1AndUser2(user1, user2);

        if (friendship == null) {
            friendship = friendshipRepository.findByUser1AndUser2(user2, user1);
        }

        return friendship != null;
    }
    private boolean isCommentAuthor(User user, Activity activity) {
        // Prüfen, ob der Benutzer die Aktivität erstellt hat
        return activity.getUsername().equals(user.getUsername());
    }

   /* public void deleteComment(Long id) {
        if (!commentsRepository.existsById(id)) {
            throw new IllegalStateException("Comment with ID " + id + " does not exist.");
        }
        commentsRepository.deleteById(id);
    }*/

    public void deleteComment(Long id, String username, boolean isAdmin) {
        // Überprüfen, ob der Kommentar existiert
        Comments comment = commentsRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Kommentar mit ID " + id + " existiert nicht."));

        // Überprüfen, ob der Benutzer autorisiert ist, den Kommentar zu löschen
        if (!isAdmin && !comment.getUser().getUsername().equals(username)) {
            throw new IllegalStateException("Nicht autorisiert, diesen Kommentar zu löschen.");
        }

        // Überprüfen, ob der Kommentar bereits als gelöscht markiert ist
        if ("[Vom Autor entfernt.]".equals(comment.getContent()) || "[Vom Admin entfernt.]".equals(comment.getContent())) {
            //throw new IllegalStateException("Dieser Kommentar wurde bereits entfernt und kann nicht erneut gelöscht werden.");
            String errorMessage = "Dieser Kommentar wurde bereits entfernt und kann nicht erneut gelöscht werden.";
            System.out.println("Fehler: " + errorMessage + " Kommentar-ID: " + id);
            throw new IllegalStateException(errorMessage);
        }

        // Inhalt basierend auf der Rolle des Löschenden setzen
        if (isAdmin) {
            comment.setContent("[Vom Admin entfernt.]");
        } else {
            comment.setContent("[Vom Autor entfernt.]");
        }

        // Kommentar aktualisieren, anstatt ihn zu löschen
        commentsRepository.save(comment);
    }

}
