package com.example.backend.comments;
import com.example.backend.comments.Comments;
import com.example.backend.comments.CommentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/comments/")
@CrossOrigin(origins = "http://localhost:4200")
public class CommentsController {
    @Autowired
    CommentsService commentsService;

    // Kommentare für eine Aktivität abrufen
    @GetMapping("/activity/{activityId}")
    public ResponseEntity<List<Comments>> getCommentsByActivityId(@PathVariable Long activityId) {
        List<Comments> comments = commentsService.getCommentsByActivityId(activityId);
        return ResponseEntity.ok(comments);
    }

    // Kommentar hinzufügen
    @PostMapping
    public ResponseEntity<Comments> addComment(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        Long activityId = Long.valueOf(payload.get("activityId").toString());
        String content = (String) payload.get("content");

        Comments savedComment = commentsService.addComment(username, activityId, content);
        return ResponseEntity.ok(savedComment);
    }

    // Kommentar "löschen" (Inhalt ändern basierend auf der Rolle)
    @PutMapping("/{id}/delete")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        boolean isAdmin = (boolean) payload.get("isAdmin"); // Admin-Status aus dem Request extrahieren
        commentsService.deleteComment(id, username, isAdmin); // Service aufrufen
        return ResponseEntity.noContent().build();
    }
}
