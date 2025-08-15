package com.example.backend.gpx;


import com.example.backend.activity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Repository-Interface für die GPXData-Entität, das Methoden zur Datenbankabfrage bereitstellt
public interface GPXDataRepository extends JpaRepository<GPXData, Long> {
    List<GPXData> findByActivity(Activity activity);
}

