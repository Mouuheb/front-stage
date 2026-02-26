import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  DrawingManager,
} from "@react-google-maps/api";

const libraries = ["drawing", "geometry"];

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

export default function AreaMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    libraries,
  });

  const [area, setArea] = useState(null);

  const onPolygonComplete = useCallback((polygon) => {
    const path = polygon.getPath();
    const calculatedArea =
      window.google.maps.geometry.spherical.computeArea(path);

    setArea(calculatedArea); // in square meters
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
      >
        <DrawingManager
          options={{
            drawingControl: true,
            drawingControlOptions: {
              drawingModes: ["polygon"],
            },
            polygonOptions: {
              fillColor: "#2196F3",
              strokeColor: "#2196F3",
              editable: true,
            },
          }}
          onPolygonComplete={onPolygonComplete}
        />
      </GoogleMap>

      {area && (
        <div style={{ padding: "10px" }}>
          <strong>Area:</strong> {(area / 1000000).toFixed(2)} km²
        </div>
      )}
    </>
  );
}