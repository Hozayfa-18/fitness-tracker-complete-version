package com.example.backend.activity;

import com.example.backend.Hoehenvisualisierungspaket.ElevationVisualizationResponse;
import com.example.backend.gpx.GPXData;
import com.example.backend.gpx.GPXDataRepository;
import com.example.backend.gpx.GPXService;
import com.example.backend.kartenvisualisierung.RouteResponse;
import com.example.backend.statistics.ActivityStatisticsService;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200") //Erlaubt dem Frontend, das unter http://localhost:4200 läuft, Anfragen an diesen Controller zu stellen.
@Transactional
@RequestMapping("/activities") //Definiert die Basis-URL für alle Methoden dieses Controllers als /activities.
public class ActivityController {
    @Autowired
    private ActivityService activityService;
    @Autowired
    private UserRepository userRepository;  // Injiziert das UserRepository, damit du auf Benutzerdaten zugreifen kannst
    @Autowired
    private GPXService gpxService;
    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private GPXDataRepository gpxDataRepository;
    @Autowired
    private ActivityStatisticsService statisticsService;
    //Sara-activitcreat-Method Erstellung ein Activity
    @Transactional
    @PostMapping("/create")
    public ResponseEntity<?> createActivity(@RequestParam("activityName") String activityName,
                                            @RequestParam("activityType") String activityType,
                                            @RequestParam("visibility") String visibility,
                                            @RequestParam("username") String username,
                                            @RequestParam("file") MultipartFile file) {
        try {
            ActivityType parsedActivityType = ActivityType.valueOf(activityType.toUpperCase());
            Activity activity = new Activity();
            activity.setActivityName(activityName);
            activity.setUsername(username);
            activity.setActivityType(parsedActivityType);
            Visibility parsedVisibility = Visibility.valueOf(visibility.toUpperCase());
            activity.setVisibility(parsedVisibility);
            User aktuellUser = userRepository.findByUsername(username);
            activity.setUser(aktuellUser);

            Activity savedActivity = activityService.createActivityWithoutGPXData(activity); //wird das für gpx-Datei gespeichert
            //gpxService.processAndSaveGPXFile(file, savedActivity);
            activityService.processGPXAndCalculateStatistics(file, savedActivity.getId(), Double.parseDouble(aktuellUser.getWeight()));

            return ResponseEntity.ok(savedActivity); //200 ok
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // 500 auf der Server-Seite ist ein Fahler aufgetreten
                    .body(null); // zeigt den User das Fehler mit leeren Seite-Body
        }
    }

//    //Löschen ein Activity
//    @Transactional
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteActivity(@PathVariable Long id) {
//        try {
//            activityService.deleteActivity(id);
//            return new ResponseEntity<>("Aktivität erfolgreich gelöscht", HttpStatus.OK);
//        } catch (IllegalArgumentException e) {
//            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
//        }
//    }

    //sara-ActivityList-Methode
    @Transactional
    @GetMapping("/username")
    public ResponseEntity<List<Activity>> getActivitiesByUsername(@RequestParam("username") String username) {
        List<Activity> activities = activityService.getActivitiesByUsername(username);
        if (activities != null) {
            return ResponseEntity.ok(activities);
        }
        System.out.println("Benutzername: " + username);
        System.out.println("Gefundene Aktivitäten: " + activities.size());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Transactional
    @GetMapping("/findUsernameByUserId")
    public String findUsernameByUserId(@RequestParam("userId") Long userId) {
        return activityService.findUsernameByUserId(userId);
    }

    @Transactional
    @GetMapping("/countActivities/username")
    public ResponseEntity<Long> getActivityCountByUsername(@RequestParam("username") String username) {
        Long count = activityService.getActivitiesCountByUsername(username);
        return ResponseEntity.ok(count);
    }

    @Transactional
    @GetMapping("/totalDuration/username")
    public ResponseEntity<Double> getTotalDurationByUsername(@RequestParam("username") String username) {
        Double totalDuration = activityService.getTotalDurationByUsername(username);
        return ResponseEntity.ok(totalDuration);
    }

    @Transactional
    @GetMapping("/totalDistance/username")
    public ResponseEntity<Double> getTotalDistanceByUsername(@RequestParam("username") String username) {
        Double totalDistance = activityService.getTotalDistanceByUsername(username);
        return ResponseEntity.ok(totalDistance);
    }

    @Transactional
    @GetMapping("/totalCalories/username")
    public ResponseEntity<Double> getTotalCaloriesByUsername(@RequestParam("username") String username) {
        Double totalCalories = activityService.getTotalCaloriesByUsername(username);
        return ResponseEntity.ok(totalCalories);
    }

    @Transactional
    @GetMapping("/totalElevationGain/username")
    public ResponseEntity<Double> getTotalElevationGainByUsername(@RequestParam("username") String username) {
        Double totalElevationGain = activityService.getTotalElevationGainByUsername(username);
        return ResponseEntity.ok(totalElevationGain);
    }

    @Transactional
    @GetMapping("/averageSpeed/username")
    public ResponseEntity<Double> getAverageSpeedByUsername(@RequestParam("username") String username) {
        Double averageSpeed = activityService.getAverageSpeedByUsername(username);
        return ResponseEntity.ok(averageSpeed);
    }

    @Transactional
    @GetMapping("/maxAverageSpeed/username")
    public ResponseEntity<Double> getMaxAverageSpeedByUsername(@RequestParam("username") String username) {
        Double maxAverageSpeed = activityService.getMaxAverageSpeedByUsername(username);
        return ResponseEntity.ok(maxAverageSpeed);
    }

    @Transactional
    @GetMapping
    public List<Activity> getAllActivities() {
        return activityService.getAllActivities();
    }

    @Transactional
    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable Long id) {
        Optional<Activity> optionalActivity = activityService.findActivityById(id);
        if (optionalActivity.isPresent()) {
            return ResponseEntity.ok(optionalActivity.get());
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}/elevation-visualization")
    public ResponseEntity<ElevationVisualizationResponse> getElevationVisualization(@PathVariable Long id) {
        Activity activity = activityService.findActivityById(id)
                .orElseThrow(() -> new RuntimeException("Aktivität nicht gefunden"));


        List<GPXData> gpxDataList = gpxDataRepository.findByActivity(activity);

        if (gpxDataList.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        ElevationVisualizationResponse response = ElevationVisualizationResponse.fromActivityAndGPXData(activity, gpxDataList);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/route")
    public ResponseEntity<RouteResponse> getRoute(@PathVariable Long id) {
        // Finde die Aktivität
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aktivität nicht gefunden."));

        // Finde die GPX-Daten
        List<GPXData> gpxDataList = gpxDataRepository.findByActivity(activity);

        if (gpxDataList.isEmpty()) {
            throw new RuntimeException("Keine GPX-Daten für diese Aktivität gefunden.");
        }

        // Erstelle die Antwort
        RouteResponse response = new RouteResponse(gpxDataList, activity);

        return ResponseEntity.ok(response);
    }


    /**
     * Endpunkt, um die GPX-Koordinaten einer Aktivität zu laden.
     * @param activityId Die ID der Aktivität, deren GPX-Koordinaten abgerufen werden sollen.
     * @return Eine Liste von GPX-Daten, die mit der Aktivität verknüpft sind, oder ein Fehler, falls die Aktivität nicht gefunden wird.
     */
    @GetMapping("/{activityId}/gpx-coordinates")
    public ResponseEntity<List<GPXData>> getGPXCoordinates(@PathVariable Long activityId) {
        Optional<Activity> activityOpt = activityService.findActivityById(activityId);

        if (activityOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Activity activity = activityOpt.get();
        List<GPXData> gpxDataList = gpxDataRepository.findByActivity(activity);

        return ResponseEntity.ok(gpxDataList);
    }

    @GetMapping("/{id}/visibility")
    public ResponseEntity<Visibility> getActivityVisibility(@PathVariable Long id) {
        Optional<Activity> activityOpt = activityRepository.findById(id);
        if (activityOpt.isPresent()) {
            return ResponseEntity.ok(activityOpt.get().getVisibility());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }


   /* @PutMapping("/{id}/visibility")
    public ResponseEntity<String> updateActivityVisibility(
            @PathVariable Long id,
            @RequestParam Visibility visibility
    ) {
        Optional<Activity> activityOpt = activityRepository.findById(id);

        if (activityOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aktivität nicht gefunden");
        }

        Activity activity = activityOpt.get();
        activity.setVisibility(visibility);
        activityRepository.save(activity);

        return ResponseEntity.ok("Sichtbarkeit erfolgreich aktualisiert");
    } */

    @GetMapping("/monthlyStatistics")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyStatistics(
            @RequestParam("username") String username,
            @RequestParam("year") int year) {
        try {
            List<Map<String, Object>> statistics = statisticsService.calculateMonthlyStatistics(username, year);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

//    @GetMapping("/user-feed")
//    public ResponseEntity<List<Activity>> getUserFeed(@RequestParam String username) {
//        User user = userRepository.findByUsername(username);
//        if (user == null) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//        }
//        List<Activity> activities = activityService.getVisibleActivitiesForUser(username);
//        return ResponseEntity.ok(activities);
//    }

    @Transactional
    @GetMapping("/visible-activities")
    public ResponseEntity<List<Activity>> getVisibleActivities(@RequestParam String username) {
        try {
            List<Activity> activities = activityService.getVisibleActivitiesForUser(username);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


}
