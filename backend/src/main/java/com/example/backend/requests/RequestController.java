package com.example.backend.requests;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friendshipRequests")
@CrossOrigin(origins = "http://localhost:4200")
public class RequestController {

    @Autowired
    private RequestService requestService;

    // Alle Freundschaftsanfragen eines Benutzers abrufen
    @GetMapping
    public ResponseEntity<List<Request>> getRequests(@RequestParam String username) {
        try {
            List<Request> requests = requestService.getRequests(username);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Freundschaftsanfrage erstellen
    @PostMapping("/send")
    public ResponseEntity<?> sendRequest(@RequestParam String senderUsername,
                                            @RequestParam String receiverUsername) {
        try {
            requestService.sendRequest(senderUsername, receiverUsername);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.getMessage();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Freundschaftsanfrage annehmen
    @PostMapping("/accept")
    public ResponseEntity<Void> acceptRequest(@RequestParam String senderUsername,
                                              @RequestParam String receiverUsername) {
        try {
            requestService.acceptRequest(senderUsername, receiverUsername);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Freundschaftsanfrage ablehnen
    @DeleteMapping("/reject")
    public ResponseEntity<Void> rejectRequest(@RequestParam String senderUsername,
                                              @RequestParam String receiverUsername) {
        try {
            requestService.rejectRequest(senderUsername, receiverUsername);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
