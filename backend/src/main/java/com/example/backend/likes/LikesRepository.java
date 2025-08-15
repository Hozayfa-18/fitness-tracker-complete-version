package com.example.backend.likes;

import com.example.backend.activity.Activity;
import com.example.backend.user.User;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface LikesRepository extends JpaRepository<Likes, Long>{

    // Prüfen, ob der Benutzer die Aktivität bereits geliked hat
    boolean existsByUserAndActivity(User user, Activity activity);

    // Finde ein Like für den Benutzer und die Aktivität
    Optional<Likes> findByUserAndActivity(User user, Activity activity);

    // Zählt alle Likes für eine Aktivität
    int countByActivity(Activity activity);


}
