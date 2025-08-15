package com.example.backend.likes;

import com.example.backend.activity.Activity;
import com.example.backend.user.User;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface LikesRepository extends JpaRepository<Likes, Long>{

    // Pr�fen, ob der Benutzer die Aktivit�t bereits geliked hat
    boolean existsByUserAndActivity(User user, Activity activity);

    // Finde ein Like f�r den Benutzer und die Aktivit�t
    Optional<Likes> findByUserAndActivity(User user, Activity activity);

    // Z�hlt alle Likes f�r eine Aktivit�t
    int countByActivity(Activity activity);


}
