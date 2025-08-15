package com.example.backend.login;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.user.User;


@Repository
public interface LoginRepository extends JpaRepository<User, Long> {
     User findByUsername(String username);
}
