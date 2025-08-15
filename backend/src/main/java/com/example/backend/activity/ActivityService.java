package com.example.backend.activity;
import com.example.backend.friends.FriendshipService;
import com.example.backend.gpx.GPXData;
import com.example.backend.gpx.GPXService;
import com.example.backend.statistics.ActivityStatisticsService;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.io.IOException;
import java.util.stream.Collectors;

@Service
public class ActivityService {
    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ActivityStatisticsService statisticsService; // Hier wird statisticsService injiziert
    @Autowired
    private GPXService gpxService; // GPXService-Interface wird injiziert
    @Autowired
    private FriendshipService friendshipService;

    public Activity createActivityWithoutGPXData(Activity activity) {
        // Setzt das aktuelle Datum mit UTC-Offset, falls `activityDate` null ist
        if (activity.getActivityDate() == null) {
            activity.setActivityDate(OffsetDateTime.now(ZoneOffset.UTC)); // Setzt UTC-Offset
        }
        if (activity.getActivityName() == null || activity.getActivityName().isEmpty() || activity.getActivityType() == null) {
            throw new IllegalArgumentException("Fehler: Aktivitätsname und Aktivitätstyp müssen ausgefüllt sein.");
        }
        return activityRepository.save(activity);
    }

    /**
     * Prozessiert die GPX-Datei, speichert die Daten und berechnet die Statistiken.
     *
     * @param file       Die hochgeladene GPX-Datei
     * @param activityId Die ID der Aktivität
     * @param weight     Das Gewicht des Benutzers zur Berechnung der Kalorien
     * @throws IOException Wenn ein Fehler bei der Verarbeitung der Datei auftritt
     */
    public void processGPXAndCalculateStatistics(MultipartFile file, Long activityId, double weight) throws IOException {
        // Finde die gespeicherte Aktivität
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Aktivität nicht gefunden"));

        // Prozessiere und speichere die GPX-Daten
        List<GPXData> gpxDataList = gpxService.processAndSaveGPXFile(file, activity);

        // Überprüfung auf Workflow-Ebene
        if (gpxDataList != null && !gpxDataList.isEmpty()) {
            statisticsService.calculateAndSaveStatistics(activity, gpxDataList, weight, activity.getActivityType());

            // Speichere die aktualisierte Aktivität in der Datenbank mit den neuen Statistiken
            activityRepository.save(activity);
        } else {
            System.out.println("GPX-Daten fehlen, Statistikberechnung übersprungen.");
        }
    }

    /**
     * Findet eine Aktivität anhand ihrer ID.
     *
     * @param id Die ID der zu findenden Aktivität
     * @return Ein Optional, das die Aktivität enthält, falls sie gefunden wurde
     */
    public Optional<Activity> findActivityById(Long id) {
        return activityRepository.findById(id);
    }

    public List<Activity> getActivitiesByUserId(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(activityRepository::findByUser).orElse(null);  // Returns null if user is not found
    }

    public List<Activity> getActivitiesByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            return activityRepository.findByUser(user);
        }
        throw new RuntimeException("Benutzer nicht gefunden.");
    }

    public Long getActivitiesCountByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            return activityRepository.countActivitiesByUsername(username);
        }
        throw new RuntimeException("Benutzer nicht gefunden.");
    }

    public List<Activity> getAllActivities() {
        return activityRepository.getAllActivities();
    }

    public List<Activity> getVisibleActivitiesForUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Benutzer nicht gefunden.");
        }

        List<Activity> allActivities = activityRepository.getAllActivities();
        List<User> friends = friendshipService.getFriends(username);

        return allActivities.stream()
                .filter(activity ->
                        activity.getVisibility() == Visibility.PUBLIC ||
                                (activity.getVisibility() == Visibility.FRIENDS &&
                                        (friends.contains(activity.getUser()) || activity.getUser().equals(user))) || // Eigenen Aktivitäten anzeigen
                                (activity.getVisibility() == Visibility.PRIVATE && activity.getUser().equals(user)) ||
                                "admin".equals(user.getRole())) // Admin sieht alles
                .collect(Collectors.toList());
    }



    public String findUsernameByUserId(Long userId) {
        return userRepository.findUsernameByUserId(userId);
    }

    public Double getTotalDurationByUsername(String username) {
        return activityRepository.sumTotalDurationByUsername(username);
    }

    public Double getTotalDistanceByUsername(String username) {
        return activityRepository.sumTotalDistanceByUsername(username);
    }

    public Double getTotalCaloriesByUsername(String username) {
        return activityRepository.sumTotalCaloriesByUsername(username);
    }

    public Double getTotalElevationGainByUsername(String username) {
        return activityRepository.sumTotalElevationGainByUsername(username);
    }

    public Double getAverageSpeedByUsername(String username) {
        return activityRepository.sumAverageSpeedByUsername(username);
    }

    public Double getMaxAverageSpeedByUsername(String username) {
        return activityRepository.getMaxAverageSpeedByUsername(username);
    }

}