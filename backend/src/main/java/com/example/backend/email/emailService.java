package com.example.backend.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class emailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("sep.move1@gmail.com");
        mailSender.send(message);
    }

    public void sendFriendshipRequestEmail(String senderUsername, String receiverEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(receiverEmail);
        message.setSubject("Freundschaftsanfrage von " + senderUsername);

        String emailText = "Hallo,\n\n" +
                "Der Benutzer " + senderUsername + " hat dir eine Freundschaftsanfrage geschickt.";

        message.setText(emailText);
        message.setFrom("sep.move1@gmail.com");
        mailSender.send(message);
    }

}
