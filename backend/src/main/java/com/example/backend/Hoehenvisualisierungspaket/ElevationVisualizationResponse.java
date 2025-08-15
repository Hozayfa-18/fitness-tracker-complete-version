package com.example.backend.Hoehenvisualisierungspaket;

import com.example.backend.activity.Activity;
import com.example.backend.gpx.GPXData;

import java.util.List;

public class ElevationVisualizationResponse {

    private Activity activity;  // Die gesamte Aktivität (einschließlich Statistiken)
    private List<GPXData> gpxData;  // Liste der GPX-Daten (für Höhenwerte und Zeitstempel)

    public ElevationVisualizationResponse(Activity activity, List<GPXData> gpxData) {
        this.activity = activity;
        this.gpxData = gpxData;
    }

    public Activity getActivity() {
        return activity;
    }

    public List<GPXData> getGpxData() {
        return gpxData;
    }
    public static ElevationVisualizationResponse fromActivityAndGPXData(Activity activity, List<GPXData> gpxDataList) {
        return new ElevationVisualizationResponse(activity, gpxDataList);
    }

}
