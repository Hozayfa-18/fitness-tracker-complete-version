package com.example.backend.gpx;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true) // Ignoriert unbekannte Felder
public class GPXTrack {

    @JacksonXmlProperty(localName = "name")
    private String name;

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "trkseg")
    private List<GPXTrackSegment> trackSegments;

    // Getter und Setter für das name-Feld
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Getter und Setter für trackSegments
    public List<GPXTrackSegment> getTrackSegments() {
        return trackSegments;
    }

    public void setTrackSegments(List<GPXTrackSegment> trackSegments) {
        this.trackSegments = trackSegments;
    }
}
