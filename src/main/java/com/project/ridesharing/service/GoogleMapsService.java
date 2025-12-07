package com.project.ridesharing.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

@Service
public class GoogleMapsService {

    private final RestTemplate restTemplate;

    public GoogleMapsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Double getDistanceInKm(String source, String destination) {
        try {
            double[] sourceCoords = getCoordinates(source);
            double[] destCoords = getCoordinates(destination);

            return getOsrmDistance(sourceCoords[0], sourceCoords[1], destCoords[0], destCoords[1]);

        } catch (Exception e) {
            System.err.println("Distance Calculation Failed: " + e.getMessage());

            return 250.0;
        }
    }

    private double[] getCoordinates(String location) {
        try {
            String url = "https://nominatim.openstreetmap.org/search?q=" + location + "&format=json&limit=1";


            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "ShareWheels-StudentProject/1.0");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            if (root.isArray() && !root.isEmpty()) {
                double lat = root.get(0).get("lat").asDouble();
                double lon = root.get(0).get("lon").asDouble();
                return new double[]{lat, lon};
            }
        } catch (Exception e) {
            System.out.println("Geocoding failed for: " + location);
        }
        return new double[]{20.5937, 78.9629};
    }

    private Double getOsrmDistance(double lat1, double lon1, double lat2, double lon2) {
        String url = "http://router.project-osrm.org/route/v1/driving/"
                + lon1 + "," + lat1 + ";" + lon2 + "," + lat2 + "?overview=false";

        try {
            String response = restTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            if (root.path("code").asText().equals("Ok")) {
                double meters = root.path("routes").get(0).path("distance").asDouble();
                return meters / 1000.0;
            }
        } catch (Exception e) {
            System.out.println("OSRM Routing failed");
        }
        return 0.0;
    }
}