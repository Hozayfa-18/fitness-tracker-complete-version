package com.example.backend.activity;

import com.example.backend.gpx.GPXData;
import com.example.backend.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.io.File;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "activities")


public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Id wird selbst generiert und als Primärschlüssel als Auto-Increment konfiguriert wird.
    private Long id;
    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private ActivityType activityType;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    private Visibility visibility = Visibility.PRIVATE;


    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<GPXData> gpxData;

    @Column(name = "activity_name", nullable = false)
    private String activityName;

    @Column(name = "username", nullable = false)
    private String username;

    // Statistiken der Aktivität
    @Column(name = "total_duration", nullable = false)
    private double totalDuration; // in minutes
    @Column(name = "total_distance", nullable = false)
    private double totalDistance; // in meters
    @Column(name = "average_speed")
    private double averageSpeed; // in km/h
    @Column(name = "total_calories")
    private double totalCalories;
    @Column(name = "total_elevation_gain")
    private double totalElevationGain; // in meters
    @Column(name = "activity_date", nullable = false)
    private OffsetDateTime activityDate;
    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
    @Column(name = "updated_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;
    /*@Column(name = "is_public", nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isPublic = false;
*/

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)  // `nullable = false` macht `user_id` erforderlich    @JsonIgnore
    @JsonIgnore
    private User user;

    public Activity() {

    }
    public Activity(String name, ActivityType type) {
        this.activityName = name;
        this.activityType = type;
    }

    // Getter und Setter für gpxData
    public List<GPXData> getGpxData() {
        return gpxData;
    }

    public void setGpxData(List<GPXData> gpxData) {
        this.gpxData = gpxData;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public ActivityType getActivityType() {
        return activityType;
    }

    public void setActivityType(ActivityType type) {
        this.activityType = type;
    }



    public double getTotalDuration() {
        return totalDuration;
    }

    public void setTotalDuration(double totalDuration) {
        this.totalDuration = totalDuration;
    }

    public double getTotalDistance() {
        return totalDistance;
    }

    public void setTotalDistance(double totalDistance) {
        this.totalDistance = totalDistance;
    }

    public double getAverageSpeed() {
        return averageSpeed;
    }

    public void setAverageSpeed(double averageSpeed) {
        this.averageSpeed = averageSpeed;
    }

    public double getTotalCalories() {
        return totalCalories;
    }

    public void setTotalCalories(double totalCalories) {
        this.totalCalories = totalCalories;
    }

    public double getTotalElevationGain() {
        return totalElevationGain;
    }

    public void setTotalElevationGain(double totalElevationGain) {
        this.totalElevationGain = totalElevationGain;
    }

    public OffsetDateTime getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(OffsetDateTime activityDate) {
        this.activityDate = activityDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Visibility getVisibility() {
        return visibility;
    }

    public void setVisibility(Visibility visibility) {
        this.visibility = visibility;
    }
}


