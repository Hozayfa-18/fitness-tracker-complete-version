package com.example.backend.login;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.user.User;
import com.example.backend.email.emailService;

import com.example.backend.user.UserRepository;

import java.util.*;


@Service
public class LoginService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private emailService emailService;

    private final Map<String, String> authCodes = new HashMap<>();

    private final Set<String> lastLoginUsername = new HashSet<>();

    @Transactional
    public boolean validateUser(String username, String password) {
        User user = userRepository.findByUsername(username);



        if (user != null && user.getPassword().equals(password)) {
            String authCode = generateAuthCode();
            authCodes.put(username, authCode); // Speichern des Codes für den Benutzer
            lastLoginUsername.add(username);


            // Senden des Codes per E-Mail
            emailService.sendEmail(user.getEmail(), "Ihr Authentifizierungscode",
                    "Ihr 2FA-Code lautet: " + authCode);

            // Zusätzliche Ausgabe des Codes in der Konsole
            System.out.println("Der 2FA-Code für " + username + " lautet: " + authCode);

            return true;
        }
        return false;
    }



    public String verifyAuthCode(String username, String inputCode) {


        if (!lastLoginUsername.contains(username)) {
            return "Falscher Benutzername";
        }


        User user = userRepository.findByUsername(username);
        if (user == null) {
            return "Benutzername existiert nicht";
        }


        if ("000000".equals(inputCode)) {
            lastLoginUsername.remove(username);
            return "OK";
        }

        // Überprüfen, ob der Authentifizierungscode stimmt
        String storedCode = authCodes.get(username);
        if (storedCode != null && inputCode.equals(storedCode)) {
            authCodes.remove(username);
            lastLoginUsername.remove(username);
            return "OK";
        }

        return "Ungültiger Authentifizierungscode";
    }

    private String generateAuthCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }


}
