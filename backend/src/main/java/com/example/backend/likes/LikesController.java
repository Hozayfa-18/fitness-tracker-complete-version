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

    // Like einer Aktivit�t hinzuf�gen
    @PostMapping("/{activityId}/like")
    public ResponseEntity<Void> likeActivity(@PathVariable Long activityId, @RequestParam String username) {
         likesService.likeActivity(activityId, username);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Like einer Aktivit�t entfernen
    @PostMapping("/{activityId}/unlike")
    public ResponseEntity<Void> unlikeActivity(@PathVariable Long activityId, @RequestParam String username) {
        likesService.unlikeActivity(activityId, username);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // �berpr�fen, ob der Benutzer die Aktivit�t geliked hat
    @GetMapping("/{activityId}/isLiked")
    public ResponseEntity<Boolean> isActivityLiked(@PathVariable Long activityId, @RequestParam String username) {
        boolean isLiked = likesService.getIfLiked(activityId, username);
        return ResponseEntity.ok(isLiked);
    }

    // Z�hlt die Anzahl der Likes f�r eine Aktivit�t
    @GetMapping("/{activityId}/count")
    public ResponseEntity<Integer> countLikesForActivity(@PathVariable Long activityId) {
        int count = likesService.countLikesForActivity(activityId);
        return ResponseEntity.ok(count);
    }

    // Z�hlt die Anzahl der Likes f�r einen Benutzer
    @GetMapping("/user/{username}/count")
    public ResponseEntity<Integer> countLikesForUser(@PathVariable String username) {
        int count = likesService.countLikesForUser(username);
        return ResponseEntity.ok(count);
    }


}
