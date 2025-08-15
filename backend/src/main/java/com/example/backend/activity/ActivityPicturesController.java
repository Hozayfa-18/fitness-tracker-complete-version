package com.example.backend.activity;

import com.example.backend.gpx.GPXData;
import com.example.backend.gpx.GPXDataRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/activities/pictures")
@CrossOrigin(origins = "http://localhost:4200")
public class ActivityPicturesController {

    @Autowired
    private ActivityPicturesService activityPicturesService;

    @Autowired
    private GPXDataRepository gpxDataRepository;

    /**
     * Endpunkt zum Hochladen eines Bildes, das mit einer Aktivität verknüpft ist.
     *
     * @param activityPictureData Metadaten des Bildes (z. B. Bildunterschrift und zugehörige GPX-Daten-ID).
     * @param file Das hochgeladene Bild als Datei (optional).
     *
     * @return Erfolgs- oder Fehlermeldung.
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadActivityPicture(
            @RequestPart("activityPictureData") ActivityPictureDTO activityPictureData,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            activityPicturesService.saveActivityPicture(activityPictureData, file);
            return ResponseEntity.ok("Bild erfolgreich hochgeladen!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler beim Hochladen des Bildes: " + e.getMessage());
        }
    }

    /**
     * Endpunkt zum Abrufen eines Bildes als Base64-String basierend auf der GPX-Daten-ID.
     *
     * @param gpxDataId Die ID der GPX-Daten, zu denen das Bild gehört.
     * @return Das Bild als Base64-String oder ein Fehler, falls das Bild nicht gefunden wird.
     */
    @GetMapping("/{gpxDataId}/photo")
    public ResponseEntity<String> getPicture(@PathVariable Long gpxDataId) {
        try {
            String base64Image = activityPicturesService.getPictureBase64(gpxDataId);
            return ResponseEntity.ok(base64Image);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Endpunkt zum Abrufen eines Bild-Datenobjekts basierend auf der GPX-Daten-ID.
     *
     * @param gpxDataId Die ID der GPX-Daten, zu denen das Bild gehört.
     * @return Ein Datenobjekt (DTO), das die Bilddaten repräsentiert, oder ein Fehler.
     */
    @GetMapping("/{gpxDataId}")
    public ResponseEntity<?> getPictureByGpxDataId(@PathVariable Long gpxDataId) {
        try {
            ActivityPictureDTO dto = activityPicturesService.getPictureDTOByGpxDataId(gpxDataId);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Fehler beim Abrufen des Bildes: " + e.getMessage());
        }
    }

    /**
     * Endpunkt zum Löschen eines Aktivitätsbildes basierend auf der Bild-ID.
     *
     * @param pictureId Die ID des zu löschenden Bildes.
     * @return Erfolgs- oder Fehlermeldung.
     */
    @DeleteMapping("/{pictureId}")
    public ResponseEntity<?> deletePicture(@PathVariable Long pictureId) {
        try {
            activityPicturesService.deletePicture(pictureId);
            return ResponseEntity.ok("Foto erfolgreich gelöscht.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Fehler beim Löschen des Bildes: " + e.getMessage());
        }
    }
}
