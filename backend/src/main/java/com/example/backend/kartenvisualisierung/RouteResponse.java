package com.example.backend.kartenvisualisierung;


import com.example.backend.gpx.GPXData;
import com.example.backend.activity.Activity;

import java.util.List;

public class RouteResponse {
    private List<GPXData> route; // Route-Daten (GPX)
    private Activity activity;   // Aktivitätsdetails

    public RouteResponse(List<GPXData> route, Activity activity) {
        this.route = route;
        this.activity = activity;
    }

    public List<GPXData> getRoute() {
        return route;
    }

    public void setRoute(List<GPXData> route) {
        this.route = route;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }
}
