package com.example.backend.activity;

import com.example.backend.gpx.GPXData;
import com.example.backend.gpx.GPXDataRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Optional;

@Service
public class ActivityPicturesService {

    @Autowired
    private ActivityPicturesRepository activityPicturesRepository;

    @Autowired
    private GPXDataRepository gpxDataRepository;

    /**
     * Speichert ein ActivityPicture mit den angegebenen Daten aus DTO.
     */
    @Transactional
    public void saveActivityPicture(ActivityPictureDTO dto, MultipartFile file) throws Exception {
        // Validierung der Eingabedaten
        if (dto.getCaption() == null || dto.getCaption().isEmpty()) {
            throw new Exception("Bildunterschrift darf nicht leer sein.");
        }

        if (dto.getGpxDataId() == null) {
            throw new Exception("GPX-Daten-ID darf nicht leer sein.");
        }

        // Überprüfen, ob die GPX-Daten existieren
        GPXData gpxData = gpxDataRepository.findById(dto.getGpxDataId())
                .orElseThrow(() -> new Exception("GPS-Daten mit der ID " + dto.getGpxDataId() + " wurden nicht gefunden."));

        // Neues ActivityPictures-Objekt erstellen
        ActivityPictures activityPicture = new ActivityPictures();
        activityPicture.setGpxData(gpxData);
        activityPicture.setCaption(dto.getCaption());

        // Bild verarbeiten
        if (file != null && !file.isEmpty()) {
            //activityPicture.setPhoto(file.getBytes());
            String base64String = Base64.getEncoder().encodeToString(file.getBytes());
            activityPicture.setPhoto(base64String);
            activityPicture.setPhotoUrl("uploads/" + file.getOriginalFilename());
        } else {
            throw new Exception("Es wurde kein Bild hochgeladen.");
        }

        // Speichern des Bildes in der Datenbank
        activityPicturesRepository.save(activityPicture);
    }


    /**
     * Konvertiert ein ActivityPictures-Objekt in ein DTO.
     */
    private ActivityPictureDTO convertToDTO(ActivityPictures picture) {
        ActivityPictureDTO dto = new ActivityPictureDTO();
        dto.setId(picture.getId());
        dto.setCaption(picture.getCaption());
        dto.setGpxDataId(picture.getGpxData().getId());
        dto.setPhotoBase64(picture.getPhoto());
        return dto;
    }

    /**
     * Holt ein Bild-Datenobjekt basierend auf der GPX-Daten-ID.
     */
    public ActivityPictureDTO getPictureDTOByGpxDataId(Long gpxDataId) {
        return activityPicturesRepository.findByGpxData_Id(gpxDataId)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Kein Bild für diese GPX-Daten-ID gefunden: " + gpxDataId));
    }


    /**
     * Holt ein Bild als Base64-String basierend auf der GPX-Daten-ID.
     */
    public String getPictureBase64(Long gpxDataId) {
        return activityPicturesRepository.findByGpxData_Id(gpxDataId)
                .map(activityPicture -> {
                    if (activityPicture.getPhoto() == null) {
                        throw new RuntimeException("Bilddaten fehlen für GPX-Daten-ID: " + gpxDataId);
                    }
                    return activityPicture.getPhoto();
                })
                .orElseThrow(() -> new RuntimeException("Kein Bild gefunden für GPX-Daten-ID: " + gpxDataId));
    }


    /**
     * Löscht ein ActivityPicture basierend auf der ID.
     */
    @Transactional
    public void deletePicture(Long pictureId) {
        if (!activityPicturesRepository.existsById(pictureId)) {
            throw new RuntimeException("Kein Bild mit dieser ID gefunden: " + pictureId);
        }

        activityPicturesRepository.deleteById(pictureId);
    }


}
