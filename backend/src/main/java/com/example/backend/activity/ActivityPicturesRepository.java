package com.example.backend.activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.backend.gpx.GPXData;
import java.util.List;
import java.util.Optional;

public interface ActivityPicturesRepository extends JpaRepository<ActivityPictures, Long> {

    // Neue Methode zur Suche nach Bildern basierend auf der ID von GPX-Daten
    Optional<ActivityPictures> findByGpxData_Id(Long gpxDataId);

}
