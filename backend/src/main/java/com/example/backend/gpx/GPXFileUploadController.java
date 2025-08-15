package com.example.backend.gpx;

import com.example.backend.activity.Activity;
import com.example.backend.activity.ActivityService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/gpx")
@CrossOrigin(origins = "http://localhost:4200") // Erlaubt Anfragen vom Frontend
public class GPXFileUploadController {

    @Autowired
    private GPXService gpxService;

    @Autowired
    private ActivityService activityService;

    // Endpunkt zum Hochladen einer GPX-Datei und Verknüpfen mit einer Aktivität
    @PostMapping("/upload")
    public ResponseEntity<?> uploadGPXFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("activityId") Long activityId) {

        // Überprüfen, ob die Datei und die Aktivitäts-ID vorhanden sind
        if (file.isEmpty()) {
            return new ResponseEntity<>("GPX-Datei ist erforderlich.", HttpStatus.BAD_REQUEST);
        }

        // Suche die Aktivität anhand der ID
        Optional<Activity> activityOpt = activityService.findActivityById(activityId);
        if (activityOpt.isEmpty()) {
            return new ResponseEntity<>("Aktivität mit der angegebenen ID wurde nicht gefunden.", HttpStatus.NOT_FOUND);
        }

        Activity activity = activityOpt.get();

        try {
            // Verarbeiten und Speichern der GPX-Daten mit der gefundenen Aktivität
            gpxService.processAndSaveGPXFile(file, activity);

            return new ResponseEntity<>("GPX-Datei erfolgreich hochgeladen und verarbeitet.", HttpStatus.OK);

        } catch (IOException e) {
            return new ResponseEntity<>("Fehler beim Verarbeiten der GPX-Datei.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Endpunkt zum Abrufen der GPS-Koordinaten einer bestimmten Aktivität.
     *
     * @param activityId Die ID der Aktivität, deren GPS-Daten benötigt werden.
     * @return Eine Liste von GPS-Daten oder eine Fehlermeldung, falls keine Daten gefunden werden.
     */
    @GetMapping("/activities/{activityId}/gpx-coordinates")
    public ResponseEntity<?> getGPSCoordinatesByActivity(@PathVariable Long activityId) {
        Optional<Activity> activityOpt = activityService.findActivityById(activityId);
        if (activityOpt.isEmpty()) {
            return new ResponseEntity<>("Aktivität nicht gefunden.", HttpStatus.NOT_FOUND);
        }

        Activity activity = activityOpt.get();
        List<GPXData> gpxDataList = gpxService.findByActivity(activity);

        if (gpxDataList.isEmpty()) {
            return new ResponseEntity<>("Keine GPS-Daten gefunden.", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(gpxDataList, HttpStatus.OK);
    }

}

