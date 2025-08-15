package com.example.backend.gpx;

import com.example.backend.activity.Activity;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

import java.util.List;

@Service
public class GPXServiceImpl implements GPXService {

    private static final Logger logger = LoggerFactory.getLogger(GPXServiceImpl.class);
    private final GPXDataRepository gpxDataRepository;

    @Autowired
    public GPXServiceImpl(GPXDataRepository gpxDataRepository) {
        this.gpxDataRepository = gpxDataRepository;
    }

    @Override
    public void saveGPXData(List<GPXData> gpxDataList) {
        if (gpxDataList != null && !gpxDataList.isEmpty()) {
            gpxDataRepository.saveAll(gpxDataList);
        }
    }


    @Override
    public List<GPXData> processAndSaveGPXFile(MultipartFile file, Activity activity) throws IOException {
        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.registerModule(new JavaTimeModule());

        try (InputStream inputStream = file.getInputStream()) {
            GPXRoot gpxRoot = xmlMapper.readValue(inputStream, GPXRoot.class);

            List<GPXData> gpxDataList = GPXData.fromGPXRoot(gpxRoot, activity);

            saveGPXData(gpxDataList);

            return gpxDataList;
        } catch (IOException e) {
            logger.error("IOException while processing GPX file", e);
            throw new IOException("Fehler beim Verarbeiten der GPX-Datei", e);
        }
    }

    @Override
    public List<GPXData> findByActivity(Activity activity) {
        return gpxDataRepository.findByActivity(activity);
    }

}
