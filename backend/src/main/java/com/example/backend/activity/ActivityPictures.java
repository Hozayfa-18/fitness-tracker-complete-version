package com.example.backend.activity;

import com.example.backend.gpx.GPXData;
import jakarta.persistence.*;

@Entity
@Table(name = "activity_pictures")
public class ActivityPictures {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String photoUrl;

    @Column(nullable = false,length = 255)
    private String caption;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "gpx_data_id", nullable = false, unique = true)
    private GPXData gpxData;


    @Column(name = "photo", columnDefinition = "TEXT")
    private String photo;

    // Standardkonstruktor
    public ActivityPictures() {}

    public ActivityPictures(String photoUrl, String caption, GPXData gpxData) {
        this.photoUrl = photoUrl;
        this.caption = caption;
        this.gpxData = gpxData;
    }

    // Getter und Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public GPXData getGpxData() {
        return gpxData;
    }

    public void setGpxData(GPXData gpxData) {
        this.gpxData = gpxData;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }
}
