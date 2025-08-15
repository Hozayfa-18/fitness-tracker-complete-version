package com.example.backend.gpx;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.time.OffsetDateTime;

public class GPXTrackPoint {
    @JacksonXmlProperty(localName = "time")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX") // SSSX berücksichtigt Millisekunden und Zeitzone
    private OffsetDateTime time; // Verwende OffsetDateTime statt LocalDateTime

    @JacksonXmlProperty(localName = "lat", namespace = "https://www.topografix.com/GPX/1/1")
    private double lat;

    @JacksonXmlProperty(localName = "lon", namespace = "https://www.topografix.com/GPX/1/1")
    private double lon;

    @JacksonXmlProperty(namespace = "https://www.topografix.com/GPX/1/1", localName = "ele")
    private double elevation;

    // Getter und Setter
    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    public double getElevation() {
        return elevation;
    }

    public void setElevation(double elevation) {
        this.elevation = elevation;
    }

    public OffsetDateTime getTime() {
        return time;
    }

    public void setTime(OffsetDateTime time) {
        this.time = time;
    }
}
