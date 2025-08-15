package com.example.backend.statistics;
import com.example.backend.activity.Activity;
import com.example.backend.activity.ActivityRepository;
import com.example.backend.activity.ActivityType;
import com.example.backend.gpx.GPXData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ActivityStatisticsService {
    // Methode zur Berechnung und Speicherung der Statistiken
    public void calculateAndSaveStatistics(Activity activity, List<GPXData> gpxData, double weight, ActivityType activityType) {
        // Überprüfung auf Berechnungsebene
        if (gpxData == null || gpxData.isEmpty()) {
            throw new IllegalArgumentException("GPX-Daten dürfen nicht leer sein.");
        }

        // Berechnung der Statistiken
        activity.setActivityDate(gpxData.get(0).getTimestamp());//Setzen der Startzeit
        activity.setTotalDuration( calculateDuration(gpxData));
        activity.setTotalDistance(calculateDistance(gpxData));
        activity.setTotalElevationGain(calculateElevationGain(gpxData));
        activity.setAverageSpeed(calculateAverageSpeed(activity.getTotalDistance(), activity.getTotalDuration()));
        activity.setTotalCalories(calculateCalories(activity.getTotalDuration(), weight, activityType));
    }
    // Hilfsmethoden zur Berechnung der jeweiligen Statistiken
    public long calculateDuration(List<GPXData> gpxData) {
        OffsetDateTime start = gpxData.get(0).getTimestamp();
        OffsetDateTime end = gpxData.get(gpxData.size() - 1).getTimestamp();
        return Duration.between(start, end).getSeconds();
    }

    public double calculateDistance(List<GPXData> gpxData) {
        double totalDistance = 0.0;
        for (int i = 1; i < gpxData.size(); i++) {
            totalDistance += calculateDistanceBetween(gpxData.get(i - 1), gpxData.get(i));
        }
        return totalDistance;
    }

    private double calculateDistanceBetween(GPXData point1, GPXData point2) {
        double earthRadius = 6371e3; // Erdradius in Metern

        double lat1 = Math.toRadians(point1.getLatitude());
        double lat2 = Math.toRadians(point2.getLatitude());
        double deltaLat = Math.toRadians(point2.getLatitude() - point1.getLatitude());
        double deltaLon = Math.toRadians(point2.getLongitude() - point1.getLongitude());

        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }

    public double calculateElevationGain(List<GPXData> gpxData) {
        double elevationGain = 0.0;
        for (int i = 1; i < gpxData.size(); i++) {
            double elevationDiff = gpxData.get(i).getElevation() - gpxData.get(i - 1).getElevation();//den Höhenwert (Elevation) eines bestimmten geografischen Punktes zurückgibt.
            if (elevationDiff > 0) {
                elevationGain += elevationDiff;
            }
        }
        return elevationGain;
    }

    public double calculateAverageSpeed(double totalDistance, double totalDuration) {
        return (totalDistance / 1000.0) / (totalDuration / 3600.0); // km/h
    }

    public double calculateCalories(double totalDuration, double weight, ActivityType activityType) {
        double metValue;
        switch (activityType) {
            case CYCLING:
                metValue = 7.5;
                break;
            case WALKING:
                metValue = 3.0;
                break;
            case HIKING:
                metValue = 5.3;
                break;
            case RUNNING:
                metValue = 8.8;
                break;
            default:
                metValue = 1.0; // Standardwert, falls Aktivitätstyp nicht bekannt
                break;
        }
       return totalDuration / 60 * (metValue * 3.5 * weight) / 200;
    }
    @Autowired
    private ActivityRepository activityRepository;

    public List<Map<String, Object>> calculateMonthlyStatistics(String username, int year) {
        List<Activity> activities = activityRepository.findByUserAndYear(username, year);

        // Initialisiere die monatlichen Statistiken
        Map<Integer, Map<String, Double>> monthlyStats = new HashMap<>();
        for (int month = 1; month <= 12; month++) {
            //Fügt eine neue Map für jeden Monat in die monthlyStats-Map ein.
            monthlyStats.put(month, new HashMap<>() {{
                put("activityCount", 0.0);
                put("totalDuration", 0.0);
                put("totalDistance", 0.0);
                put("averageSpeed", 0.0);
                put("maxSpeed", 0.0);
                put("totalCalories", 0.0);
                put("totalElevationGain", 0.0);
            }});
        }

        // Berechnung der Statistiken für jeden Monat
        for (Activity activity : activities) {
            int month = activity.getActivityDate().getMonthValue();
            //Holt die entsprechende Statistik-Map für den Monat.
            Map<String, Double> stats = monthlyStats.get(month);
            stats.put("activityCount", stats.get("activityCount") + 1);
            stats.put("totalDuration", stats.get("totalDuration") + activity.getTotalDuration());
            stats.put("totalDistance", stats.get("totalDistance") + activity.getTotalDistance());
            stats.put("averageSpeed", stats.get("averageSpeed") + activity.getAverageSpeed());
            stats.put("maxSpeed", Math.max(stats.get("maxSpeed"), activity.getAverageSpeed()));
            stats.put("totalCalories", stats.get("totalCalories") + activity.getTotalCalories());
            stats.put("totalElevationGain", stats.get("totalElevationGain") + activity.getTotalElevationGain());
        }

        // Umwandlung in eine Liste von Maps für den Rückgabewert
        List<Map<String, Object>> response = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            Map<String, Object> stat = new HashMap<>(monthlyStats.get(month));
            stat.put("month", month);
            response.add(stat);
        }

        return response;
    }
}
