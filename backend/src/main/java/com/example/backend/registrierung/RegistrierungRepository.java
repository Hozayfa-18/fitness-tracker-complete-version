package com.example.backend.registrierung;

import com.example.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface RegistrierungRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}