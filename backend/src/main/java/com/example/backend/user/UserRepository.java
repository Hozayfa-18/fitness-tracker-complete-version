package com.example.backend.user;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Override
    <S extends User> List<S> findAll(Example<S> example);

    @Transactional
    @Query("SELECT u FROM User u WHERE u.username = ?1")
    User findByUsername(String username);

    @Query("SELECT a.username FROM User a WHERE a.id = ?1")
    String findUsernameByUserId(Long userId);


    @Modifying
    @Transactional
    @Query("UPDATE User u SET " +
            "u.firstName = COALESCE(:newFirstName, u.firstName), " +
            "u.lastName = COALESCE(:newLastName, u.lastName), " +
            "u.weight = COALESCE(:newWeight, u.weight), " +
            "u.height = COALESCE(:newHeight, u.height), " +
            "u.gender = COALESCE(:newGender, u.gender)" +
            "WHERE u.username = :oldUsername")
    void updateUserProfile(
            @Param("oldUsername") String oldUsername,
            @Param("newFirstName") String newFirstName,
            @Param("newLastName") String newLastName,
            @Param("newWeight") String newWeight,
            @Param("newHeight") String newHeight,
            @Param("newGender") String newGender
    );

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}