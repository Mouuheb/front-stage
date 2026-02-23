import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css'

// ---------- Fix default marker icons ----------
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ---------- Robust coordinate parser ----------
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

  // CASE 1: We found a clear separator (e.g., "35.237513, 11.131123")
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

  // CASE 2: No clear separator – maybe format like "12.1225.2258"
  // Assume the last dot is the separator, and dots inside each number are decimal points.
  const dotParts = str.split('.');
  if (dotParts.length >= 3) {
    // Join all except the last part as latitude, last part as longitude
    const lat = parseFloat(dotParts.slice(0, -1).join('.'));
    const lng = parseFloat(dotParts[dotParts.length - 1]);
    if (!isNaN(lat) && !isNaN(lng)) {
      // If longitude is huge (>180), maybe they forgot a decimal? Show error later.
      return { lat, lng, ambiguous: lng > 180 };
    }
  }

  // CASE 3: Single number? Invalid.
  return null;
};

// ---------- Component that updates map when center changes ----------
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// ---------- Main Map Component ----------
const MapWithLeaflet = ({ location }) => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const parsed = parseCoordinates(location);
    if (!parsed) {
      setError(`❌ Invalid format: "${location}".\nUse "lat, lng" (e.g. "35.2375, 11.1311") or "lat:lng" / "lat;lng".`);
      setCoords(null);
    } else if (parsed.ambiguous) {
      setError(`⚠️ Longitude ${parsed.lng} is outside -180..180.\nDid you mean "${parsed.lat}, ${(parsed.lng / 100).toFixed(4)}"?`);
      setCoords({ lat: parsed.lat, lng: parsed.lng }); // still show, but with warning
    } else {
      setError(null);
      setCoords(parsed);
    }
  }, [location]);

  if (error) {
    return (
      <div style={{ padding: '1rem', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '4px', color: '#856404' }}>
        <strong>Map notice:</strong> {error}
      </div>
    );
  }

  if (!coords) {
    return <div style={{ padding: '1rem' }}>⏳ Loading map...</div>;
  }

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <MapContainer
        key={`${coords.lat}-${coords.lng}`} // force re-create on coord change (optional)
        center={[coords.lat, coords.lng]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[coords.lat, coords.lng]}>
          <Popup>
            📍 {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
          </Popup>
        </Marker>
        <MapUpdater center={[coords.lat, coords.lng]} />
      </MapContainer>
    </div>
  );
};

export default MapWithLeaflet;