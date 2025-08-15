package com.example.backend.gpx;

import com.example.backend.activity.Activity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class GPXData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JacksonXmlProperty(isAttribute = true, localName = "lat")
    private double latitude;

    @JacksonXmlProperty(isAttribute = true, localName = "lon")
    private double longitude;

    @JacksonXmlProperty(localName = "ele")
    private double elevation;

    @JacksonXmlProperty(localName = "time")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private OffsetDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = false)
    @JsonIgnore //
    private Activity activity;

    public GPXData() {}

    public GPXData(double latitude, double longitude, double elevation, OffsetDateTime timestamp) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.elevation = elevation;
        this.timestamp = timestamp;
    }

    // Getter und Setter
    public Long getId() { return id; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public double getElevation() { return elevation; }
    public OffsetDateTime getTimestamp() { return timestamp; }

    public Activity getActivity() { return activity; }
    public void setActivity(Activity activity) { this.activity = activity; }



    public static List<GPXData> fromGPXRoot(GPXRoot root, Activity activity) {
        List<GPXData> gpxDataList = new ArrayList<>();
        if (root.getTracks() != null) {
            for (GPXTrack track : root.getTracks()) {
                for (GPXTrackSegment segment : track.getTrackSegments()) {
                    for (GPXTrackPoint point : segment.getTrackPoints()) {
                        GPXData data = new GPXData(point.getLat(), point.getLon(), point.getElevation(), point.getTime());
                        data.setActivity(activity);
                        gpxDataList.add(data);
                    }
                }
            }
        }
        return gpxDataList;
    }
}
