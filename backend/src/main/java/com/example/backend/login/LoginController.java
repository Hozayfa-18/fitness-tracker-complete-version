package com.example.backend.login;


import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/authentification")
@CrossOrigin(origins = "http://localhost:4200")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login loginData) {
        try {
            boolean isValid = loginService.validateUser(loginData.getUsername(), loginData.getPassword());
            if (isValid) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return ResponseEntity.status(401).body("Ungültige Anmeldeinformationen");
            }
        } catch (Exception e) {
            // Protokolliert den Fehler und gibt eine verständliche Antwort zurück
            e.printStackTrace();
            return ResponseEntity.status(500).body("Interner Serverfehler: " + e.getMessage());
        }
    }


    @Transactional
    @PostMapping("/zweifaktor")
    public ResponseEntity<?> verifyTwoFactor(@RequestBody Map<String, String> twoFactorData) {
        String username = twoFactorData.get("username");
        String authCode = twoFactorData.get("authCode");

        String verificationResult = loginService.verifyAuthCode(username, authCode);
        switch (verificationResult) {
            case "OK":
                return ResponseEntity.ok(Map.of("username", username));
            case "Falscher Benutzername":
                return ResponseEntity.status(400).body("Falscher Benutzername. Bitte verwenden Sie denselben Benutzernamen wie beim Login.");
            case "Benutzername existiert nicht":
                return ResponseEntity.status(404).body("Der Benutzername existiert nicht.");
            case "Ungültiger Authentifizierungscode":
                return ResponseEntity.status(401).body("Ungültiger Authentifizierungscode");
            case "Der Code ist abgelaufen":
                return ResponseEntity.status(403).body("Der Authentifizierungscode ist abgelaufen.");
            default:
                return ResponseEntity.status(500).body("Interner Fehler");
        }


    }
}
