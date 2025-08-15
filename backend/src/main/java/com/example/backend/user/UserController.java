package com.example.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.zip.DataFormatException;
import java.util.zip.Inflater;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    public UserController(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id){
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/username")
    public User getUserByUsername(@RequestParam String username) {
        return userRepository.findByUsername(username);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Sichtbarkeitsstatus abrufen
    @GetMapping("/{username}/visibility")
    public ResponseEntity<Boolean> getFriendListVisibility(@PathVariable String username) {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(user.getFriendListPublic());
    }

    // Sichtbarkeitsstatus aktualisieren
    @PutMapping("/{username}/visibility")
    public ResponseEntity<String> updateFriendListVisibility(
            @PathVariable String username,
            @RequestParam boolean isPublic
    ) {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Benutzer nicht gefunden");
        }

        if (!user.getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Benutzername stimmt nicht überein");
        }

        user.setFriendListPublic(isPublic);
        userRepository.save(user);

        return ResponseEntity.ok("Sichtbarkeit erfolgreich aktualisiert");
    }
}
