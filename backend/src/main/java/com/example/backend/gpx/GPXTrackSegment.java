package com.example.backend.gpx;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import java.util.List;

public class GPXTrackSegment {

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "trkpt")
    private List<GPXTrackPoint> trackPoints;

    public List<GPXTrackPoint> getTrackPoints() {
        return trackPoints;
    }

    public void setTrackPoints(List<GPXTrackPoint> trackPoints) {
        this.trackPoints = trackPoints;
    }
}
