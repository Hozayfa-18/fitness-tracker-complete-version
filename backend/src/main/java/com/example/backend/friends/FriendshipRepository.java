package com.example.backend.friends;

import com.example.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    // Freundschaft anhand der Benutzer abrufen
    Friendship findByUser1AndUser2(User user1, User user2);

    // Alle Freunde eines Benutzers abrufen
    @Query("SELECT f FROM Friendship f WHERE f.user1.username = :username OR f.user2.username = :username")
    List<Friendship> findFriendsByUsername(@Param("username") String username);

}
