package com.example.backend.requests;

import com.example.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long>  {

    // Freundschaftsanfragen abrufen, die an den Benutzer gerichtet sind
    List<Request> findByReceiverUsername(String receiverUsername);

    // Freundschaftsanfrage zwischen zwei Benutzern finden
   Request findBySenderAndReceiver(User sender, User receiver);


}
