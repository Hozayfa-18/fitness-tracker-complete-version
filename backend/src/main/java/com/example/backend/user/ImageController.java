/* package com.example.backend.user;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Optional;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "image")
public class ImageController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/uploadPP")
    public ResponseEntity<Void> uploadImage(
            @RequestParam("imageFile") MultipartFile file,
            @RequestParam String username) {
        if(file.isEmpty()){
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        try {
            // Log file and username information for debugging
            System.out.println("Received file: " + file.getOriginalFilename());
            System.out.println("File type: " + file.getContentType());
            System.out.println("Username: " + username);

            if (file.isEmpty() || username == null || username.isEmpty()) {
                System.out.println("File is empty or username is missing.");
                return ResponseEntity.badRequest().build();
            }

            // Compress file bytes if necessary
            byte[] compressedBytes = compressBytes(file.getBytes());

            // Call repository method to update the user's profile picture
            userRepository.updateUserPicture(
                    username,
                    file.getOriginalFilename(),
                    file.getContentType(),
                    compressedBytes
            );

            return ResponseEntity.status(HttpStatus.CREATED).build();

        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error occurred: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(path = { "/get/username" })
    public User getImage(@RequestParam("username") String username) throws IOException {

        final Optional<User> retrievedImage = userRepository.findByUsername2(username);
        User img = new User(retrievedImage.get().getPic_name(), retrievedImage.get().getPic_type(),
                decompressBytes(retrievedImage.get().getPic_byte()));
        return img;
    }

    @GetMapping("/username")
    public ResponseEntity<byte[]> getImage2(@RequestParam String username) {
        try {
            // Retrieve the user directly
            User foundUser = userRepository.findByUsername(username);  // Replace with your service call

            if (foundUser == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Decode from Base64, then decompress
            byte[] decodedBytes = Base64.getDecoder().decode(foundUser.getPic_byte());
            byte[] imageBytes = decompressBytes(decodedBytes);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(foundUser.getPic_type()));
            headers.setContentLength(imageBytes.length);
            headers.set("Content-Disposition", "inline; filename=\"" + foundUser.getPic_name() + "\"");

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            System.err.println("Failed to decode Base64 image: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            System.err.println("Failed to decompress image bytes: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private static byte[] compressBytes(byte[] data) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length)) {
            Deflater deflater = new Deflater();
            deflater.setInput(data);
            deflater.finish();

            byte[] buffer = new byte[1024];
            while (!deflater.finished()) {
                int count = deflater.deflate(buffer);
                outputStream.write(buffer, 0, count);
            }
            return outputStream.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to compress image bytes", e);
        }
    }

    private static byte[] decompressBytes(byte[] data) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length)) {
            Inflater inflater = new Inflater();
            inflater.setInput(data);

            byte[] buffer = new byte[1024];
            while (!inflater.finished()) {
                int count = inflater.inflate(buffer);
                outputStream.write(buffer, 0, count);
            }
            return outputStream.toByteArray();
        } catch (IOException | DataFormatException e) {
            throw new RuntimeException("Failed to decompress image bytes", e);
        }
    }
} */

