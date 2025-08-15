package com.example.backend.registrierung;

import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import com.example.backend.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import javax.imageio.ImageIO;

@Service
public class RegistrierungService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Transactional
    public void registerUser(Registrierung registrationData, MultipartFile file) throws Exception {
        // Prüfen, ob der Benutzername oder die E-Mail bereits existieren
        if (userRepository.existsByUsername(registrationData.getUsername())) {
            throw new Exception("Benutzername ist bereits vergeben.");
        }
        if (userRepository.existsByEmail(registrationData.getEmail())) {
            throw new Exception("E-Mail ist bereits vergeben.");
        }

        // Überprüfen, ob das Geburtsdatum nur für Benutzer der Rolle 'user' vorhanden ist
        LocalDate birthDate = null;
        if ("user".equals(registrationData.getRole())) {
            // Für 'user' ist das Geburtsdatum erforderlich
            if (registrationData.getBirthDate() == null || registrationData.getBirthDate().isEmpty()) {
                throw new Exception("Geburtsdatum ist für Benutzer der Rolle 'user' erforderlich.");
            }
            birthDate = LocalDate.parse(registrationData.getBirthDate());
        } else if ("admin".equals(registrationData.getRole())) {
            // Für 'admin' wird das Geburtsdatum ignoriert
            birthDate = null;
        }

        // Neuer Benutzer wird erstellt
        User newUser = new User();
        newUser.setUsername(registrationData.getUsername());
        newUser.setFirstName(registrationData.getFirstName());
        newUser.setLastName(registrationData.getLastName());
        newUser.setEmail(registrationData.getEmail());
        newUser.setPassword(registrationData.getPassword());  // Passwort wird im Klartext gespeichert
        newUser.setRole(registrationData.getRole());
        newUser.setBirthDate(birthDate);
        newUser.setHeight(registrationData.getHeight());
        newUser.setWeight(registrationData.getWeight());
        newUser.setGender(registrationData.getGender());

        // Profilbild speichern
        if (file != null && !file.isEmpty()) {
            String base64String = Base64.getEncoder().encodeToString(file.getBytes());
            newUser.setProfilePictureBase64(base64String);
        }

        System.out.println("Registrierungsdaten: " + registrationData);
        System.out.println("profilePicture: " + (file != null ? file.getOriginalFilename() : "Kein Bild"));

        // Speichern des neuen Benutzers in der Datenbank
        userRepository.save(newUser);
    }

    public String getProfilePictureBase64(String username) throws Exception {
        User user = userRepository.findByUsername(username);

        // Überprüfen, ob der Benutzer existiert
        if (user == null) {
            throw new Exception("Benutzer nicht gefunden");
        }

        // Überprüfen, ob ein Profilbild vorhanden ist
        if (user.getProfilePictureBase64() == null || user.getProfilePictureBase64().isEmpty()) {
            throw new Exception("Kein Profilbild vorhanden");
        }

        // Rückgabe des Base64-Strings
        return user.getProfilePictureBase64();
    }

}