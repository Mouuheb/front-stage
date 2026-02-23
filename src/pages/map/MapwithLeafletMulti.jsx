import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';

// Fix default marker icons (same as before)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ---------- Robust coordinate parser (unchanged) ----------
const parseCoordinates = (input) => {
  if (!input || typeof input !== 'string') return null;

  // Trim and normalize spaces
  let str = input.trim().replace(/\s+/g, ' ');

  // Try to find a separator: comma, colon, semicolon, or space
  let separator = null;
  if (str.includes(',')) separator = ',';
  else if (str.includes(':')) separator = ':';
  else if (str.includes(';')) separator = ';';
  else if (str.includes(' ')) separator = ' ';

  if (separator) {
    const parts = str.split(separator).map(p => p.trim()).filter(p => p !== '');
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
  }

  // Case for formats like "12.1225.2258" (treat last dot as separator)
  const dotParts = str.split('.');
  if (dotParts.length >= 3) {
    const lat = parseFloat(dotParts.slice(0, -1).join('.'));
    const lng = parseFloat(dotParts[dotParts.length - 1]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng, ambiguous: lng > 180 };
    }
  }

  return null;
};

// ---------- Component to fit map bounds to markers ----------
function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
    map.fitBounds(bounds, { padding: [50, 50] }); // add some padding
  }, [markers, map]);
  return null;
}

// ---------- Main Map Component (now accepts projects array) ----------
const MapwithLeafletMulti = ({ projects }) => {
  // Parse all valid locations from projects
  const [markers, setMarkers] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const validMarkers = [];
    const parseErrors = [];

    projects.forEach((project, index) => {
      const locString = project.location;
      const parsed = parseCoordinates(locString);
      if (!parsed) {
        parseErrors.push(`Project "${project.name}" has invalid location format: "${locString}"`);
      } else if (parsed.ambiguous) {
        parseErrors.push(`Project "${project.name}" has ambiguous longitude (${parsed.lng}): "${locString}"`);
        // Still add marker, but with warning
        validMarkers.push({
          ...parsed,
          name: project.name,
          address: project.address,
          id: project.id,
          // -----------------------------------i
          type: project.type,
        });
      } else {
        validMarkers.push({
          ...parsed,
          name: project.name,
          address: project.address,
          id: project.id,
          // -----------------------------------i
          type: project.type,
        });
      }
    });

    setMarkers(validMarkers);
    setErrors(parseErrors);
  }, [projects]);

  if (markers.length === 0) {
    return (
      <div style={{ padding: '1rem', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', color: '#721c24' }}>
        <strong>No valid locations to display.</strong>
        {errors.length > 0 && (
          <ul style={{ marginTop: '0.5rem' }}>
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        )}
      </div>
    );
  }

  // Determine initial center (use first marker) – bounds will override later
  const initialCenter = [markers[0].lat, markers[0].lng];


  const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
console.log(markers)

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <MapContainer
        center={initialCenter}
        zoom={8}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={marker.type === "Energetique" ? redIcon : marker.type === "Cartographie Precise" ? blueIcon : greenIcon}
>
            
            <Popup>
              <strong>{marker.name}</strong><br />
              📍 {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}<br />
              {marker.address && <span>📍 {marker.address}</span>}
            </Popup>
          </Marker>
        ))}
        <FitBounds markers={markers} />
      </MapContainer>

      {errors.length > 0 && (
        <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '4px', color: '#856404' }}>
          <strong>Warnings:</strong>
          <ul style={{ margin: '0.25rem 0 0 1.5rem' }}>
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapwithLeafletMulti;