package com.example.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "/editProfile")
public class EditProfileController {

    @Autowired
    UserRepository userRepository;

    @PutMapping("/editUserProfile")
    public void editUserProfile(
            @RequestParam String oldUsername,
            @RequestParam(required = false) String newFirstName,
            @RequestParam(required = false) String newLastName,
            @RequestParam(required = false) String newWeight,
            @RequestParam(required = false) String newHeight,
            @RequestParam(required = false) String newGender
    ) {
        userRepository.updateUserProfile(
                oldUsername,
                newFirstName,
                newLastName,
                newWeight,
                newHeight,
                newGender
        );
    }
}
