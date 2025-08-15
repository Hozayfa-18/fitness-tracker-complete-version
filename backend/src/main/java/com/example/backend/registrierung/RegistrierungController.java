package com.example.backend.registrierung;

import com.example.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.backend.registrierung.Registrierung;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;


@RestController
@RequestMapping("/registration")
@CrossOrigin(origins = "http://localhost:4200")
public class RegistrierungController {

    @Autowired
    private RegistrierungService registrierungService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @RequestPart("registrationData") Registrierung registrationData,
            @RequestPart(value = "profilePicture", required = false) MultipartFile file) {
        try {
            registrierungService.registerUser(registrationData, file);
            return ResponseEntity.ok("Registrierung erfolgreich!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


   @GetMapping("/{username}/profile-picture")
    public ResponseEntity<String> getProfilePicture(@PathVariable String username) {
        try {
            String base64Image = registrierungService.getProfilePictureBase64(username);
            return ResponseEntity.ok(base64Image);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}




