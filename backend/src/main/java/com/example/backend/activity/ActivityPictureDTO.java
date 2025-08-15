package com.example.backend.activity;

public class ActivityPictureDTO {

    private Long id; // ID des Bildes
    private String photoBase64; // Base64-kodiertes Bild
    private String caption; // Bildunterschrift
    private Long gpxDataId; // ID der zugehörigen GPX-Daten

    // Standardkonstruktor
    public ActivityPictureDTO() {}

    // Getter und Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhotoBase64() {
        return photoBase64;
    }

    public void setPhotoBase64(String photoBase64) {
        this.photoBase64 = photoBase64;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public Long getGpxDataId() {
        return gpxDataId;
    }

    public void setGpxDataId(Long gpxDataId) {
        this.gpxDataId = gpxDataId;
    }


    @Override
    public String toString() {
        return "ActivityPictureDTO{" +
                "id=" + id +
                ", photoBase64='" + (photoBase64 != null ? "present" : "null") + '\'' +
                ", caption='" + caption + '\'' +
                ", gpxDataId=" + gpxDataId +
                '}';
    }
}
