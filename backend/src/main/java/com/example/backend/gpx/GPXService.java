package com.example.backend.gpx;

import com.example.backend.activity.Activity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

public interface GPXService {
    void saveGPXData(List<GPXData> gpxDataList);
    List<GPXData> processAndSaveGPXFile(MultipartFile file, Activity activity) throws IOException;
    List<GPXData> findByActivity(Activity activity);
}
