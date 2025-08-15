package com.example.backend.user;


import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usersSearch")
@CrossOrigin(origins = "http://localhost:4200")
public class TeilnehmerController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    public TeilnehmerController(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Transactional
    @GetMapping("/username")
    public User getUserByUsername(@RequestParam String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
