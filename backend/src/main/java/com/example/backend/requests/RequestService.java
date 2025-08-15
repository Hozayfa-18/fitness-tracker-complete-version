package com.example.backend.requests;

import com.example.backend.friends.Friendship;
import com.example.backend.friends.FriendshipRepository;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.email.emailService;

import java.util.List;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private emailService emailService;


    public List<Request> getRequests(String username) {

        List<Request> requests = requestRepository.findByReceiverUsername(username);


        for (Request request : requests) {
            if (request.getSender() != null) {
                System.out.println("Sender Username: " + request.getSender().getUsername());
            }
        }

        return requests;
    }




    public void sendRequest(String senderUsername, String receiverUsername) {
        User sender = userRepository.findByUsername(senderUsername);
        User receiver = userRepository.findByUsername(receiverUsername);

        if (sender == null || receiver == null) {
            throw new IllegalStateException("Sender oder Empfänger existiert nicht.");
        }

        // Prüfen, ob bereits eine Freundschaft besteht
        if (friendshipRepository.findByUser1AndUser2(sender, receiver) != null
                || friendshipRepository.findByUser1AndUser2(receiver, sender) != null
        ) {
            throw new IllegalStateException("Benutzer sind bereits Freunde.");
        }

        // Prüfen, ob eine Anfrage in eine Richtung existiert
        if (requestRepository.findBySenderAndReceiver(sender, receiver) != null ||
                requestRepository.findBySenderAndReceiver(receiver, sender) != null) {
            throw new IllegalStateException("Eine Freundschaftsanfrage existiert bereits.");
        }

        // Freundschaftsanfrage erstellen
        Request request = new Request(sender, receiver);
        requestRepository.save(request);


        // Versende die Freundschaftsanfrage per E-Mail
        emailService.sendFriendshipRequestEmail(sender.getUsername(), receiver.getEmail());
    }




    public void acceptRequest(String senderUsername, String receiverUsername) {
        User sender = userRepository.findByUsername(senderUsername);
        User receiver = userRepository.findByUsername(receiverUsername);

        if (sender != null && receiver != null) {
            // Freundschaftsanfrage löschen
            Request request = requestRepository.findBySenderAndReceiver(sender, receiver);


            if (request != null) {
                requestRepository.delete(request);
            } else {
                System.out.println("Keine Anfrage zum Löschen gefunden.");
            }

            // Freundschaft hinzufügen
            if (friendshipRepository.findByUser1AndUser2(sender, receiver) == null) {
                Friendship friendship = new Friendship(sender, receiver);
                friendshipRepository.save(friendship);


            }
        }
    }




    public void rejectRequest(String senderUsername, String receiverUsername) {
        User sender = userRepository.findByUsername(senderUsername);
        User receiver = userRepository.findByUsername(receiverUsername);

        if (sender != null && receiver != null) {
            Request request = requestRepository.findBySenderAndReceiver(sender, receiver);

            if (request != null) {
                requestRepository.delete(request);
            } else {
                System.out.println("Keine Anfrage gefunden, die abgelehnt werden kann.");
            }
        }
    }


}
