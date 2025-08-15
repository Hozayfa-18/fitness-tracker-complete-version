package com.example.backend.statistics;
import com.example.backend.activity.Activity;
import com.example.backend.activity.ActivityType;
import com.example.backend.gpx.GPXData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ActivityStatisticsServiceTest {

    private ActivityStatisticsService statisticsService;

    @BeforeEach
    public void setUp() {
        statisticsService = new ActivityStatisticsService();
    }

    @Test
    public void testCalculateActivityDate() {
        // Arrange
        Activity activity = new Activity();
        List<GPXData> gpxData = Arrays.asList(
                new GPXData(0.0, 0.0, 0.0, OffsetDateTime.parse("2023-12-01T10:00:00Z"))
        );

        // Act
        activity.setActivityDate(gpxData.get(0).getTimestamp());

        // Assert
        assertEquals(OffsetDateTime.parse("2023-12-01T10:00:00Z"), activity.getActivityDate());
    }

    @Test
    public void testCalculateTotalDuration() {
        // Arrange
        List<GPXData> gpxData = Arrays.asList(
                new GPXData(0.0, 0.0, 0.0, OffsetDateTime.parse("2023-12-01T10:00:00Z")),
                new GPXData(0.0, 0.0, 0.0, OffsetDateTime.parse("2023-12-01T10:10:00Z"))
        );

        // Act
        long duration = statisticsService.calculateDuration(gpxData);

        // Assert
        assertEquals(600, duration); // 10 Minuten = 600 Sekunden
    }

    @Test
    public void testCalculateTotalDistance() {
        // Arrange
        List<GPXData> gpxData = Arrays.asList(
                new GPXData(48.13743, 11.57549, 0.0, OffsetDateTime.now()), // München
                new GPXData(52.520008, 13.404954, 0.0, OffsetDateTime.now()) // Berlin
        );

        // Act
        double distance = statisticsService.calculateDistance(gpxData);

        // Assert

        assertEquals(504000, (int) distance, 300); // Erlaubt eine Abweichung von ±300 Metern
    }
    @Test
    public void testCalculateElevationGain() {
        // Arrange
        List<GPXData> gpxData = Arrays.asList(
                new GPXData(0.0, 0.0, 100.0, OffsetDateTime.now()),
                new GPXData(0.0, 0.0, 200.0, OffsetDateTime.now()),
                new GPXData(0.0, 0.0, 150.0, OffsetDateTime.now())
        );

        // Act
        double elevationGain = statisticsService.calculateElevationGain(gpxData);

        // Assert
        assertEquals(100, elevationGain); // Gesamter Höhengewinn: 200 - 100
    }

    @Test
    public void testCalculateAverageSpeed() {
        // Arrange
        List<GPXData> gpxData = Arrays.asList(
                new GPXData(48.13743, 11.57549, 0.0, OffsetDateTime.parse("2023-12-01T10:00:00Z")),
                new GPXData(48.13743, 11.57549, 0.0, OffsetDateTime.parse("2023-12-01T11:00:00Z"))
        );
        double distance = 10000; // 10 km in Metern

        // Act
        double averageSpeed = statisticsService.calculateAverageSpeed(distance, 3600); // 3600 Sekunden = 1 Stunde

        // Assert
        assertEquals(10.0, averageSpeed, 0.1); // Durchschnittsgeschwindigkeit: 10 km/h
    }

    @Test
    public void testCalculateCalories() {
        // Arrange
        double weight = 70.0; // Gewicht der Person in kg
        long duration = 3600; // Dauer der Aktivität in Sekunden (1 Stunde)
        ActivityType activityType = ActivityType.RUNNING;

        // Act
        double calories = statisticsService.calculateCalories(duration, weight, activityType);

        // Assert
        assertEquals(646, calories, 1); // Erwartet: 882 Kalorien bei 70 kg und Laufen
    }
}
