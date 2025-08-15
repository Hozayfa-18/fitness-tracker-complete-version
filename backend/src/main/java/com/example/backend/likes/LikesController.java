package com.example.backend.likes;

import com.example.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/likes")
@CrossOrigin(origins = "http://localhost:4200")


public class LikesController {

    @Autowired
    private LikesService likesService;

    // Like einer Aktivität hinzufügen
    @PostMapping("/{activityId}/like")
    public ResponseEntity<Void> likeActivity(@PathVariable Long activityId, @RequestParam String username) {
         likesService.likeActivity(activityId, username);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Like einer Aktivität entfernen
    @PostMapping("/{activityId}/unlike")
    public ResponseEntity<Void> unlikeActivity(@PathVariable Long activityId, @RequestParam String username) {
        likesService.unlikeActivity(activityId, username);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Überprüfen, ob der Benutzer die Aktivität geliked hat
    @GetMapping("/{activityId}/isLiked")
    public ResponseEntity<Boolean> isActivityLiked(@PathVariable Long activityId, @RequestParam String username) {
        boolean isLiked = likesService.getIfLiked(activityId, username);
        return ResponseEntity.ok(isLiked);
    }

    // Zählt die Anzahl der Likes für eine Aktivität
    @GetMapping("/{activityId}/count")
    public ResponseEntity<Integer> countLikesForActivity(@PathVariable Long activityId) {
        int count = likesService.countLikesForActivity(activityId);
        return ResponseEntity.ok(count);
    }

    // Zählt die Anzahl der Likes für einen Benutzer
    @GetMapping("/user/{username}/count")
    public ResponseEntity<Integer> countLikesForUser(@PathVariable String username) {
        int count = likesService.countLikesForUser(username);
        return ResponseEntity.ok(count);
    }


}
