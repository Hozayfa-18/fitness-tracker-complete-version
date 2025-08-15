package com.example.backend.gpx;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true) // Ignoriert unbekannte Felder
public class GPXRoot {

    @JacksonXmlProperty(localName = "version")
    private String version;

    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "trk")
    private List<GPXTrack> tracks;

    // Getter und Setter
    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public List<GPXTrack> getTracks() {
        return tracks;
    }

    public void setTracks(List<GPXTrack> tracks) {
        this.tracks = tracks;
    }
}
