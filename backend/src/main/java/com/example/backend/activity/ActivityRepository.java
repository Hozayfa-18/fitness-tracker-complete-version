package com.example.backend.activity;

import com.example.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    @Query("SELECT a From Activity a ORDER BY a.id DESC")
    List<Activity> getAllActivities();

    List<Activity> findByUser(User user);

    @Query("SELECT COUNT(a) FROM Activity a WHERE a.user.username = ?1")
    Long countActivitiesByUsername(String username);

    @Query("SELECT SUM(a.totalDuration) / 3600 FROM Activity a WHERE a.user.username = :username")
    Double sumTotalDurationByUsername(@Param("username") String username);

    @Query("SELECT SUM(a.totalDistance) / 1000 FROM Activity a WHERE a.user.username = :username")
    Double sumTotalDistanceByUsername(@Param("username") String username);

    @Query("SELECT SUM(a.totalCalories) FROM Activity a WHERE a.user.username = :username")
    Double sumTotalCaloriesByUsername(@Param("username") String username);

    @Query("SELECT SUM(a.totalElevationGain) FROM Activity a WHERE a.user.username = :username")
    Double sumTotalElevationGainByUsername(@Param("username") String username);

    @Query("SELECT AVG(a.averageSpeed) FROM Activity a WHERE a.user.username = :username")
    Double sumAverageSpeedByUsername(@Param("username") String username);

    @Query("SELECT MAX(a.averageSpeed) FROM Activity a WHERE a.user.username = :username")
    Double getMaxAverageSpeedByUsername(@Param("username") String username);
    @Query("SELECT a FROM Activity a WHERE a.user.username = :username AND YEAR(a.activityDate) = :year")
    List<Activity> findByUserAndYear(@Param("username") String username, @Param("year") int year);
}
