// // // // // // import L from 'leaflet';
// // // // // // delete L.Icon.Default.prototype._getIconUrl;
// // // // // // L.Icon.Default.mergeOptions({
// // // // // //   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
// // // // // //   iconUrl: require('leaflet/dist/images/marker-icon.png'),
// // // // // //   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// // // // // // });

// // // // // import React, { useRef, useEffect, useState } from 'react';
// // // // // import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// // // // // import { EditControl } from 'react-leaflet-draw';
// // // // // import L from 'leaflet';
// // // // // import 'leaflet-draw';
// // // // // import * as turf from '@turf/turf';
// // // // // import 'leaflet/dist/leaflet.css';
// // // // // import 'leaflet-draw/dist/leaflet.draw.css';
// // // // // import './style.css'

// // // // // const LocationFinder = () => {
// // // // //   const [drawnPolygon, setDrawnPolygon] = useState(null);
// // // // //   const [area, setArea] = useState(null);
// // // // //   const [landType, setLandType] = useState('');
// // // // //   const [distanceFromX, setDistanceFromX] = useState(null);
// // // // //   const [userLocation, setUserLocation] = useState(null);
// // // // //   const featureGroupRef = useRef();

// // // // //   // Fixed location X (example: Eiffel Tower)
// // // // //   const locationX = [48.8584, 2.2945]; // [lat, lng]

// // // // //   // Get user's location
// // // // //   useEffect(() => {
// // // // //     if (navigator.geolocation) {
// // // // //       navigator.geolocation.getCurrentPosition(
// // // // //         (position) => {
// // // // //           const { latitude, longitude } = position.coords;
// // // // //           setUserLocation([latitude, longitude]);
// // // // //         },
// // // // //         (error) => console.error('Geolocation error:', error)
// // // // //       );
// // // // //     }
// // // // //   }, []);

// // // // //   // Handle draw events
// // // // //   const onCreated = async (e) => {
// // // // //     const layer = e.layer;
// // // // //     const geoJson = layer.toGeoJSON();
// // // // //     setDrawnPolygon(geoJson);

// // // // //     // 1. Calculate area using Turf
// // // // //     const areaSqM = turf.area(geoJson);
// // // // //     setArea(areaSqM.toFixed(2) + ' m²');

// // // // //     // 2. Calculate distance from location X to polygon centroid
// // // // //     const centroid = turf.centroid(geoJson);
// // // // //     const from = turf.point([locationX[1], locationX[0]]); // Turf expects [lng, lat]
// // // // //     const to = turf.point(centroid.geometry.coordinates);
// // // // //     const distanceKm = turf.distance(from, to, { units: 'kilometers' });
// // // // //     setDistanceFromX(distanceKm.toFixed(2) + ' km');

// // // // //     // 3. Fetch land type from Overpass API
// // // // //     const landTypeResult = await fetchLandType(geoJson);
// // // // //     setLandType(landTypeResult);
// // // // //   };

// // // // //   // Overpass query: get landuse/natural features inside polygon
// // // // //   const fetchLandType = async (polygonGeoJson) => {
// // // // //     // Convert polygon to Overpass QL format (simplified: bounding box + polygon filter)
// // // // //     const bbox = turf.bbox(polygonGeoJson); // [minX, minY, maxX, maxY]
// // // // //     const overpassQuery = `
// // // // //       [out:json];
// // // // //       (
// // // // //         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // // //         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // // //         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // // //         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // // //       );
// // // // //       out body;
// // // // //       >;
// // // // //       out skel qt;
// // // // //     `;

// // // // //     try {
// // // // //       const response = await fetch('https://overpass-api.de/api/interpreter', {
// // // // //         method: 'POST',
// // // // //         body: overpassQuery,
// // // // //       });
// // // // //       const data = await response.json();

// // // // //       // Count occurrences of each landuse/natural type inside the polygon
// // // // //       const typeCount = {};
// // // // //       data.elements.forEach(el => {
// // // // //         if (el.tags) {
// // // // //           const type = el.tags.landuse || el.tags.natural;
// // // // //           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
// // // // //         }
// // // // //       });

// // // // //       // Determine dominant type
// // // // //       let dominant = 'unknown';
// // // // //       let max = 0;
// // // // //       for (const [type, count] of Object.entries(typeCount)) {
// // // // //         if (count > max) {
// // // // //           max = count;
// // // // //           dominant = type;
// // // // //         }
// // // // //       }
// // // // //       return dominant;
// // // // //     } catch (error) {
// // // // //       console.error('Overpass error:', error);
// // // // //       return 'error fetching data';
// // // // //     }
// // // // //   };

// // // // //   // Component to add geolocation marker
// // // // //   const GeolocationMarker = () => {
// // // // //     const map = useMap();
// // // // //     useEffect(() => {
// // // // //       if (userLocation) {
// // // // //         const marker = L.marker(userLocation).addTo(map);
// // // // //         marker.bindPopup('You are here').openPopup();
// // // // //         map.setView(userLocation, 13);
// // // // //       }
// // // // //     }, [userLocation, map]);
// // // // //     return null;
// // // // //   };

// // // // //   return (
// // // // //     <div>
// // // // //       <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: '600px', width: '100%' }}>
// // // // //         <TileLayer
// // // // //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // // // //           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// // // // //         />
// // // // //         <FeatureGroup ref={featureGroupRef}>
// // // // //           <EditControl
// // // // //             position="topright"
// // // // //             onCreated={onCreated}
// // // // //             draw={{
// // // // //               rectangle: true,
// // // // //               polygon: true,
// // // // //               circle: true,
// // // // //               marker: false,
// // // // //               circlemarker: false,
// // // // //             }}
// // // // //           />
// // // // //         </FeatureGroup>
// // // // //         <GeolocationMarker />
// // // // //       </MapContainer>

// // // // //       {/* <div style={{ marginTop: '20px' }}>
// // // // //         <h3>Results</h3>
// // // // //         <p><strong>Area:</strong> {area || '—'}</p>
// // // // //         <p><strong>Land Type:</strong> {landType || '—'}</p>
// // // // //         <p><strong>Distance from Location X:</strong> {distanceFromX || '—'}</p>
// // // // //         {userLocation && (
// // // // //           <p><strong>Your Location:</strong> {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}</p>
// // // // //         )}
// // // // //       </div> */}
// // // // //       <div style={{
// // // // //   position: 'absolute',
// // // // //   bottom: '20px',
// // // // //   left: '20px',
// // // // //   background: 'white',
// // // // //   padding: '15px',
// // // // //   borderRadius: '8px',
// // // // //   boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
// // // // //   maxWidth: '300px',
// // // // //   zIndex: 1000,
// // // // //   fontFamily: 'Arial, sans-serif'
// // // // // }}>
// // // // //   <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc' }}>Measurement Results</h3>
// // // // //   <p><strong>📍 Your location:</strong> <br/>
// // // // //     {userLocation ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}` : 'Detecting...'}
// // // // //   </p>
// // // // //   <p><strong>📏 Area:</strong> <br/>{area || '—'}</p>
// // // // //   <p><strong>🌲 Land type:</strong> <br/>{landType || '—'}</p>
// // // // //   <p><strong>📐 Distance from X:</strong> <br/>{distanceFromX || '—'}</p>
// // // // //   <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
// // // // //     Draw a polygon using the toolbar on the right.
// // // // //   </p>
// // // // // </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default LocationFinder;


// // // // // ----------------------------------------------------------------------------------------------------------

// // // // // import React, { useRef, useEffect, useState } from 'react';
// // // // // import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// // // // // import { EditControl } from 'react-leaflet-draw';
// // // // // import L from 'leaflet';
// // // // // import 'leaflet-draw';
// // // // // import * as turf from '@turf/turf';
// // // // // import 'leaflet/dist/leaflet.css';
// // // // // import 'leaflet-draw/dist/leaflet.draw.css';
// // // // // import './style.css';

// // // // // // Fix for default Leaflet markers in Webpack
// // // // // // delete L.Icon.Default.prototype._getIconUrl;
// // // // // // L.Icon.Default.mergeOptions({
// // // // // //   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
// // // // // //   iconUrl: require('leaflet/dist/images/marker-icon.png'),
// // // // // //   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// // // // // // });

// // // // // const LocationFinder = () => {
// // // // //   const [drawnPolygon, setDrawnPolygon] = useState(null);
// // // // //   const [area, setArea] = useState(null);
// // // // //   const [landType, setLandType] = useState('');
// // // // //   const [distanceFromX, setDistanceFromX] = useState(null);
// // // // //   const [userLocation, setUserLocation] = useState(null);
// // // // //   const featureGroupRef = useRef();

// // // // //   // Fixed location X (example: Eiffel Tower)
// // // // //   const locationX = [48.8584, 2.2945]; // [lat, lng]

// // // // //   // Get user's location
// // // // //   useEffect(() => {
// // // // //     if (navigator.geolocation) {
// // // // //       navigator.geolocation.getCurrentPosition(
// // // // //         (position) => {
// // // // //           const { latitude, longitude } = position.coords;
// // // // //           setUserLocation([latitude, longitude]);
// // // // //         },
// // // // //         (error) => console.error('Geolocation error:', error)
// // // // //       );
// // // // //     }
// // // // //   }, []);

// // // // //   // Handle draw events
// // // // //   const onCreated = async (e) => {
// // // // //     const layer = e.layer;
// // // // //     const geoJson = layer.toGeoJSON();
// // // // //     setDrawnPolygon(geoJson);

// // // // //     // 1. Calculate area using Turf
// // // // //     const areaSqM = turf.area(geoJson);
// // // // //     setArea(areaSqM.toFixed(2) + ' m²');

// // // // //     // 2. Calculate distance from location X to polygon centroid
// // // // //     const centroid = turf.centroid(geoJson);
// // // // //     const from = turf.point([locationX[1], locationX[0]]); // Turf expects [lng, lat]
// // // // //     const to = turf.point(centroid.geometry.coordinates);
// // // // //     const distanceKm = turf.distance(from, to, { units: 'kilometers' });
// // // // //     setDistanceFromX(distanceKm.toFixed(2) + ' km');

// // // // //     // 3. Fetch land type from Overpass API
// // // // //     const landTypeResult = await fetchLandType(geoJson);
// // // // //     setLandType(landTypeResult);
// // // // //   };

// // // // //   // Overpass query: get landuse/natural features inside polygon
// // // // //   const fetchLandType = async (polygonGeoJson) => {
// // // // //     // Convert polygon to Overpass QL format (simplified: bounding box + polygon filter)
// // // // //     const bbox = turf.bbox(polygonGeoJson); // [minX, minY, maxX, maxY]
// // // // //     const overpassQuery = `
// // // // //       [out:json];
// // // // //       (
// // // // //         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // // //         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // // //         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // // //         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // // //       );
// // // // //       out body;
// // // // //       >;
// // // // //       out skel qt;
// // // // //     `;

// // // // //     try {
// // // // //       const response = await fetch('https://overpass-api.de/api/interpreter', {
// // // // //         method: 'POST',
// // // // //         body: overpassQuery,
// // // // //       });
// // // // //       const data = await response.json();

// // // // //       // Count occurrences of each landuse/natural type inside the polygon
// // // // //       const typeCount = {};
// // // // //       data.elements.forEach(el => {
// // // // //         if (el.tags) {
// // // // //           const type = el.tags.landuse || el.tags.natural;
// // // // //           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
// // // // //         }
// // // // //       });

// // // // //       // Determine dominant type
// // // // //       let dominant = 'unknown';
// // // // //       let max = 0;
// // // // //       for (const [type, count] of Object.entries(typeCount)) {
// // // // //         if (count > max) {
// // // // //           max = count;
// // // // //           dominant = type;
// // // // //         }
// // // // //       }
// // // // //       return dominant;
// // // // //     } catch (error) {
// // // // //       console.error('Overpass error:', error);
// // // // //       return 'error fetching data';
// // // // //     }
// // // // //   };

// // // // //   // Component to add geolocation marker
// // // // //   const GeolocationMarker = () => {
// // // // //     const map = useMap();
// // // // //     useEffect(() => {
// // // // //       if (userLocation) {
// // // // //         const marker = L.marker(userLocation).addTo(map);
// // // // //         marker.bindPopup('You are here').openPopup();
// // // // //         map.setView(userLocation, 13);
// // // // //       }
// // // // //     }, [userLocation, map]);
// // // // //     return null;
// // // // //   };

// // // // //   return (
// // // // //     <div style={{ position: 'relative' }}>
// // // // //       <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: '600px', width: '100%' }}>
// // // // //         <TileLayer
// // // // //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // // // //           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// // // // //         />
// // // // //         <FeatureGroup ref={featureGroupRef}>
// // // // //           {/* <EditControl
// // // // //             position="topright"
// // // // //             onCreated={onCreated}
// // // // //             draw={{
// // // // //               rectangle: true,
// // // // //               polygon: true,
// // // // //               circle: true,
// // // // //               marker: false,
// // // // //               circlemarker: false,
// // // // //             }}
// // // // //           /> */}
// // // // //           <EditControl
// // // // //   position="topright"
// // // // //   onCreated={onCreated}
// // // // //   draw={{
// // // // //     rectangle: true,
// // // // //     circle: true,
// // // // //     marker: false,
// // // // //     circlemarker: false,
// // // // //     polygon: {
// // // // //       allowIntersection: false,
// // // // //       showArea: true,
// // // // //       drawError: {
// // // // //         color: '#e1e100',
// // // // //         message: '<strong>Error:<strong> shape cannot intersect itself!',
// // // // //       },
// // // // //       shapeOptions: {
// // // // //         color: '#97009c',
// // // // //       },
// // // // //     },
// // // // //   }}
// // // // // />
// // // // //         </FeatureGroup>
// // // // //         <GeolocationMarker />
// // // // //       </MapContainer>

// // // // //       {/* Info panel moved to top-left to avoid blocking drawing interactions */}
// // // // //       <div style={{
// // // // //         position: 'absolute',
// // // // //         top: '20px',
// // // // //         left: '20px',
// // // // //         background: 'white',
// // // // //         padding: '15px',
// // // // //         borderRadius: '8px',
// // // // //         boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
// // // // //         maxWidth: '300px',
// // // // //         zIndex: 1000,
// // // // //         fontFamily: 'Arial, sans-serif'
// // // // //       }}>
// // // // //         <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc' }}>Measurement Results</h3>
// // // // //         <p><strong> Your location:</strong> <br/>
// // // // //           {userLocation ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}` : 'Detecting...'}
// // // // //         </p>
// // // // //         <p><strong>📏 Area:</strong> <br/>{area || '—'}</p>
// // // // //         <p><strong>🌲 Land type:</strong> <br/>{landType || '—'}</p>
// // // // //         <p><strong>📐 Distance from X:</strong> <br/>{distanceFromX || '—'}</p>
// // // // //         <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
// // // // //           Draw a polygon using the toolbar on the right.
// // // // //         </p>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default LocationFinder;


// // // // // -------------------------------------------------------------------------------------------------------






// // // // import React, { useRef, useEffect, useState } from 'react';
// // // // import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// // // // import { EditControl } from 'react-leaflet-draw';
// // // // import L from 'leaflet';
// // // // import 'leaflet/dist/leaflet.css';
// // // // import 'leaflet-draw/dist/leaflet.draw.css';
// // // // import 'leaflet-draw';
// // // // import * as turf from '@turf/turf';
// // // // import './style.css';

// // // // const LocationFinder = () => {
// // // //   const [area, setArea] = useState(null);
// // // //   const [landType, setLandType] = useState('');
// // // //   const [distanceFromX, setDistanceFromX] = useState(null);
// // // //   const [userLocation, setUserLocation] = useState(null);

// // // //   const featureGroupRef = useRef(null);
// // // //   const markerRef = useRef(null);

// // // //   // Fixed reference location (Eiffel Tower)
// // // //   const locationX = [48.8584, 2.2945];

// // // //   // Get user geolocation
// // // //   useEffect(() => {
// // // //     if (!navigator.geolocation) return;

// // // //     navigator.geolocation.getCurrentPosition(
// // // //       (position) => {
// // // //         setUserLocation([
// // // //           position.coords.latitude,
// // // //           position.coords.longitude,
// // // //         ]);
// // // //       },
// // // //       (error) => console.error('Geolocation error:', error)
// // // //     );
// // // //   }, []);

// // // //   // Calculate measurements safely
// // // //   const processLayer = async (layer) => {
// // // //     let geoJson;
// // // //     let areaSqM = 0;

// // // //     // Handle Circle separately
// // // //     if (layer instanceof L.Circle) {
// // // //       const radius = layer.getRadius();
// // // //       areaSqM = Math.PI * radius * radius;

// // // //       const center = layer.getLatLng();
// // // //       geoJson = turf.circle(
// // // //         [center.lng, center.lat],
// // // //         radius / 1000,
// // // //         { units: 'kilometers' }
// // // //       );
// // // //     } else {
// // // //       geoJson = layer.toGeoJSON();
// // // //       areaSqM = turf.area(geoJson);
// // // //     }

// // // //     setArea(areaSqM.toFixed(2) + ' m²');

// // // //     // Distance from reference point
// // // //     const centroid = turf.centroid(geoJson);
// // // //     const from = turf.point([locationX[1], locationX[0]]);
// // // //     const to = turf.point(centroid.geometry.coordinates);
// // // //     const distanceKm = turf.distance(from, to, { units: 'kilometers' });

// // // //     setDistanceFromX(distanceKm.toFixed(2) + ' km');

// // // //     // Fetch land type
// // // //     const land = await fetchLandType(geoJson);
// // // //     setLandType(land);
// // // //   };

// // // //   // Handle creation
// // // //   const onCreated = async (e) => {
// // // //     const layer = e.layer;

// // // //     // Clear old layers (optional: keep only one)
// // // //     featureGroupRef.current.clearLayers();
// // // //     featureGroupRef.current.addLayer(layer);

// // // //     await processLayer(layer);
// // // //   };

// // // //   // Overpass API
// // // //   const fetchLandType = async (polygonGeoJson) => {
// // // //     const bbox = turf.bbox(polygonGeoJson);

// // // //     const query = `
// // // //       [out:json];
// // // //       (
// // // //         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // //         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // //         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // //         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // //       );
// // // //       out body;
// // // //     `;

// // // //     try {
// // // //       const response = await fetch(
// // // //         'https://overpass-api.de/api/interpreter',
// // // //         { method: 'POST', body: query }
// // // //       );

// // // //       const data = await response.json();

// // // //       const typeCount = {};

// // // //       data.elements.forEach((el) => {
// // // //         if (el.tags) {
// // // //           const type = el.tags.landuse || el.tags.natural;
// // // //           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
// // // //         }
// // // //       });

// // // //       let dominant = 'unknown';
// // // //       let max = 0;

// // // //       for (const [type, count] of Object.entries(typeCount)) {
// // // //         if (count > max) {
// // // //           max = count;
// // // //           dominant = type;
// // // //         }
// // // //       }

// // // //       return dominant;
// // // //     } catch (error) {
// // // //       console.error('Overpass error:', error);
// // // //       return 'error fetching data';
// // // //     }
// // // //   };

// // // //   // User marker component
// // // //   const GeolocationMarker = () => {
// // // //     const map = useMap();

// // // //     useEffect(() => {
// // // //       if (!userLocation) return;

// // // //       if (markerRef.current) {
// // // //         markerRef.current.remove();
// // // //       }

// // // //       const marker = L.marker(userLocation).addTo(map);
// // // //       marker.bindPopup('You are here');

// // // //       markerRef.current = marker;
// // // //       map.setView(userLocation, 13);

// // // //       return () => {
// // // //         if (markerRef.current) {
// // // //           markerRef.current.remove();
// // // //         }
// // // //       };
// // // //     }, [userLocation, map]);

// // // //     return null;
// // // //   };

// // // //   return (
// // // //     <div style={{ position: 'relative' }}>
// // // //       <MapContainer
// // // //         center={[48.8566, 2.3522]}
// // // //         zoom={13}
// // // //         style={{ height: '600px', width: '100%' }}
// // // //       >
// // // //         <TileLayer
// // // //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // // //           attribution="© OpenStreetMap contributors"
// // // //         />

// // // //         <FeatureGroup ref={featureGroupRef}>
// // // //           <EditControl
// // // //             position="topright"
// // // //             onCreated={onCreated}
// // // //             draw={{
// // // //               rectangle: true,
// // // //               polygon: {
// // // //                 allowIntersection: false,
// // // //                 showArea: true,
// // // //               },
// // // //               circle: true,
// // // //               marker: false,
// // // //               circlemarker: false,
// // // //               polyline: false,
// // // //             }}
// // // //             edit={{
// // // //               remove: true,
// // // //             }}
// // // //           />
// // // //         </FeatureGroup>

// // // //         <GeolocationMarker />
// // // //       </MapContainer>

// // // //       {/* Info Panel */}
// // // //       <div
// // // //         style={{
// // // //           position: 'absolute',
// // // //           top: '20px',
// // // //           left: '20px',
// // // //           background: 'white',
// // // //           padding: '15px',
// // // //           borderRadius: '8px',
// // // //           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
// // // //           maxWidth: '300px',
// // // //           zIndex: 1000,
// // // //           fontFamily: 'Arial, sans-serif',
// // // //         }}
// // // //       >
// // // //         <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3>

// // // //         <p>
// // // //           <strong>Your location:</strong><br />
// // // //           {userLocation
// // // //             ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
// // // //             : 'Detecting...'}
// // // //         </p>

// // // //         <p>
// // // //           <strong>Area:</strong><br />
// // // //           {area || '—'}
// // // //         </p>

// // // //         <p>
// // // //           <strong>Land type:</strong><br />
// // // //           {landType || '—'}
// // // //         </p>

// // // //         <p>
// // // //           <strong>Distance from X:</strong><br />
// // // //           {distanceFromX || '—'}
// // // //         </p>

// // // //         <p style={{ fontSize: '0.9em', color: '#666' }}>
// // // //           Draw a polygon, rectangle, or circle.
// // // //         </p>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default LocationFinder;


// // // ///-------------------------------------------------------------------------------------------------------
// // // // import React, { useRef, useEffect, useState } from 'react';
// // // // import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// // // // import { EditControl } from 'react-leaflet-draw';
// // // // import L from 'leaflet';
// // // // import 'leaflet/dist/leaflet.css';
// // // // import 'leaflet-draw/dist/leaflet.draw.css';
// // // // import 'leaflet-draw';
// // // // import * as turf from '@turf/turf';
// // // // // import './style.css';

// // // // const LocationFinder = () => {
// // // //   const [measurement, setMeasurement] = useState(null);
// // // //   const [landType, setLandType] = useState('');
// // // //   const [distanceFromX, setDistanceFromX] = useState(null);
// // // //   const [userLocation, setUserLocation] = useState(null);

// // // //   const featureGroupRef = useRef(null);
// // // //   const markerRef = useRef(null);

// // // //   // Fixed reference location (Eiffel Tower)
// // // //   const locationX = [48.8584, 2.2945];

// // // //   // Get user geolocation
// // // //   useEffect(() => {
// // // //     if (!navigator.geolocation) return;
// // // //     navigator.geolocation.getCurrentPosition(
// // // //       (position) => {
// // // //         setUserLocation([
// // // //           position.coords.latitude,
// // // //           position.coords.longitude,
// // // //         ]);
// // // //       },
// // // //       (error) => console.error('Geolocation error:', error)
// // // //     );
// // // //   }, []);

// // // //   // Calculate measurements for ANY shape (area or length)
// // // //   const processLayer = async (layer) => {
// // // //     let geoJson;
// // // //     let measurementStr = '';

// // // //     if (layer instanceof L.Circle) {
// // // //       // Circle → area (exact formula)
// // // //       const radius = layer.getRadius();
// // // //       const areaSqM = Math.PI * radius * radius;
// // // //       measurementStr = areaSqM.toFixed(2) + ' m²';

// // // //       const center = layer.getLatLng();
// // // //       geoJson = turf.circle(
// // // //         [center.lng, center.lat],
// // // //         radius / 1000,
// // // //         { units: 'kilometers' }
// // // //       );
// // // //     } else if (layer instanceof L.Polygon) {
// // // //       // Polygon / Rectangle → area
// // // //       geoJson = layer.toGeoJSON();
// // // //       const areaSqM = turf.area(geoJson);
// // // //       measurementStr = areaSqM.toFixed(2) + ' m²';
// // // //     } else if (layer instanceof L.Polyline) {
// // // //       // Polyline → length (new support!)
// // // //       geoJson = layer.toGeoJSON();
// // // //       const lengthKm = turf.length(geoJson, { units: 'kilometers' });
// // // //       measurementStr = lengthKm.toFixed(2) + ' km';
// // // //     } else {
// // // //       measurementStr = 'Unsupported shape';
// // // //       setMeasurement(measurementStr);
// // // //       return;
// // // //     }

// // // //     setMeasurement(measurementStr);

// // // //     // Distance from reference point (works for all shapes)
// // // //     if (geoJson) {
// // // //       const centroid = turf.centroid(geoJson);
// // // //       const from = turf.point([locationX[1], locationX[0]]);
// // // //       const to = turf.point(centroid.geometry.coordinates);
// // // //       const distanceKm = turf.distance(from, to, { units: 'kilometers' });
// // // //       setDistanceFromX(distanceKm.toFixed(2) + ' km');
// // // //     }

// // // //     // Land type only makes sense for area shapes
// // // //     if ((layer instanceof L.Circle || layer instanceof L.Polygon) && geoJson) {
// // // //       const land = await fetchLandType(geoJson);
// // // //       setLandType(land);
// // // //     } else {
// // // //       setLandType('N/A (for lines)');
// // // //     }
// // // //   };

// // // //   // Handle creation (keep only ONE shape at a time)
// // // //   const onCreated = (e) => {
// // // //     const layer = e.layer;
// // // //     featureGroupRef.current.clearLayers();
// // // //     featureGroupRef.current.addLayer(layer);
// // // //     processLayer(layer);
// // // //   };

// // // //   // Handle editing → update measurement live
// // // //   const onEdited = (e) => {
// // // //     e.layers.eachLayer((layer) => {
// // // //       processLayer(layer);
// // // //     });
// // // //   };

// // // //   // Handle deletion → clear results
// // // //   const onDeleted = () => {
// // // //     if (featureGroupRef.current.getLayers().length === 0) {
// // // //       setMeasurement(null);
// // // //       setDistanceFromX(null);
// // // //       setLandType('');
// // // //     }
// // // //   };

// // // //   // Overpass API (unchanged)
// // // //   const fetchLandType = async (polygonGeoJson) => {
// // // //     const bbox = turf.bbox(polygonGeoJson);
// // // //     const query = `
// // // //       [out:json];
// // // //       (
// // // //         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // //         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // //         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // //         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // //       );
// // // //       out body;
// // // //     `;

// // // //     try {
// // // //       const response = await fetch(
// // // //         'https://overpass-api.de/api/interpreter',
// // // //         { method: 'POST', body: query }
// // // //       );
// // // //       const data = await response.json();

// // // //       const typeCount = {};
// // // //       data.elements.forEach((el) => {
// // // //         if (el.tags) {
// // // //           const type = el.tags.landuse || el.tags.natural;
// // // //           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
// // // //         }
// // // //       });

// // // //       let dominant = 'unknown';
// // // //       let max = 0;
// // // //       for (const [type, count] of Object.entries(typeCount)) {
// // // //         if (count > max) {
// // // //           max = count;
// // // //           dominant = type;
// // // //         }
// // // //       }
// // // //       return dominant;
// // // //     } catch (error) {
// // // //       console.error('Overpass error:', error);
// // // //       return 'error fetching data';
// // // //     }
// // // //   };

// // // //   // User marker component (unchanged)
// // // //   const GeolocationMarker = () => {
// // // //     const map = useMap();
// // // //     useEffect(() => {
// // // //       if (!userLocation) return;
// // // //       if (markerRef.current) markerRef.current.remove();

// // // //       const marker = L.marker(userLocation).addTo(map);
// // // //       marker.bindPopup('You are here');
// // // //       markerRef.current = marker;
// // // //       map.setView(userLocation, 13);

// // // //       return () => {
// // // //         if (markerRef.current) markerRef.current.remove();
// // // //       };
// // // //     }, [userLocation, map]);

// // // //     return null;
// // // //   };

// // // //   return (
// // // //     <div style={{ position: 'relative' }}>
// // // //       <MapContainer
// // // //         center={[48.8566, 2.3522]}
// // // //         zoom={13}
// // // //         style={{ height: '600px', width: '100%' }}
// // // //       >
// // // //         <TileLayer
// // // //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // // //           attribution="© OpenStreetMap contributors"
// // // //         />
// // // //         <FeatureGroup ref={featureGroupRef}>
// // // //           <EditControl
// // // //             position="topright"
// // // //             onCreated={onCreated}
// // // //             onEdited={onEdited}
// // // //             onDeleted={onDeleted}
// // // //             draw={{
// // // //               rectangle: true,
// // // //               polygon: {
// // // //                 allowIntersection: false,
// // // //                 showArea: true,
// // // //               },
// // // //               circle: true,
// // // //               polyline: true,           // ← NEW: now supports polylines (length)
// // // //               marker: false,
// // // //               circlemarker: false,
// // // //             }}
// // // //             edit={{
// // // //               remove: true,
// // // //             }}
// // // //           />
// // // //         </FeatureGroup>
// // // //         <GeolocationMarker />
// // // //       </MapContainer>

// // // //       {/* Info Panel */}
// // // //       <div
// // // //         style={{
// // // //           position: 'absolute',
// // // //           top: '20px',
// // // //           left: '20px',
// // // //           background: 'white',
// // // //           padding: '15px',
// // // //           borderRadius: '8px',
// // // //           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
// // // //           maxWidth: '300px',
// // // //           zIndex: 1000,
// // // //           fontFamily: 'Arial, sans-serif',
// // // //         }}
// // // //       >
// // // //         <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3>
// // // //         <p>
// // // //           <strong>Your location:</strong><br />
// // // //           {userLocation
// // // //             ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
// // // //             : 'Detecting...'}
// // // //         </p>
// // // //         <p>
// // // //           <strong>Measurement:</strong><br />
// // // //           {measurement || '—'}
// // // //         </p>
// // // //         <p>
// // // //           <strong>Land type:</strong><br />
// // // //           {landType || '—'}
// // // //         </p>
// // // //         <p>
// // // //           <strong>Distance from X:</strong><br />
// // // //           {distanceFromX || '—'}
// // // //         </p>
// // // //         <p style={{ fontSize: '0.9em', color: '#666' }}>
// // // //           Draw a polygon, rectangle, circle or polyline.
// // // //         </p>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default LocationFinder;


// // // //----------------------------------------------------------------------------

// // // // import React, { useRef, useEffect, useState } from 'react';
// // // // import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// // // // import { EditControl } from 'react-leaflet-draw';
// // // // import L from 'leaflet';
// // // // import 'leaflet/dist/leaflet.css';
// // // // import 'leaflet-draw/dist/leaflet.draw.css';
// // // // import 'leaflet-draw';
// // // // import * as turf from '@turf/turf';
// // // // import './style.css';

// // // // const LocationFinder = () => {
// // // //   const [measurement, setMeasurement] = useState(null);     // Area or Length
// // // //   const [perimeter, setPerimeter] = useState(null);         // ← NEW
// // // //   const [landType, setLandType] = useState('');
// // // //   const [distanceFromX, setDistanceFromX] = useState(null);
// // // //   const [userLocation, setUserLocation] = useState(null);

// // // //   const featureGroupRef = useRef(null);
// // // //   const markerRef = useRef(null);

// // // //   // Fixed reference location (Eiffel Tower)
// // // //   const locationX = [48.8584, 2.2945];

// // // //   // Get user geolocation
// // // //   useEffect(() => {
// // // //     if (!navigator.geolocation) return;
// // // //     navigator.geolocation.getCurrentPosition(
// // // //       (position) => {
// // // //         setUserLocation([
// // // //           position.coords.latitude,
// // // //           position.coords.longitude,
// // // //         ]);
// // // //       },
// // // //       (error) => console.error('Geolocation error:', error)
// // // //     );
// // // //   }, []);

// // // //   // Calculate everything for any shape
// // // //   const processLayer = async (layer) => {
// // // //     let geoJson = null;
// // // //     let measurementStr = '';
// // // //     let perimeterM = 0;

// // // //     if (layer instanceof L.Circle) {
// // // //       // Circle
// // // //       const radius = layer.getRadius();
// // // //       const areaSqM = Math.PI * radius * radius;
// // // //       measurementStr = areaSqM.toFixed(2) + ' m²';
// // // //       perimeterM = 2 * Math.PI * radius;                     // perimeter in meters

// // // //       const center = layer.getLatLng();
// // // //       geoJson = turf.circle([center.lng, center.lat], radius / 1000, { units: 'kilometers' });

// // // //     } else if (layer instanceof L.Polygon) {
// // // //       // Polygon or Rectangle
// // // //       geoJson = layer.toGeoJSON();
// // // //       const areaSqM = turf.area(geoJson);
// // // //       measurementStr = areaSqM.toFixed(2) + ' m²';
// // // //       perimeterM = turf.length(geoJson, { units: 'meters' });

// // // //     } else if (layer instanceof L.Polyline) {
// // // //       // Polyline → length (we still call it "Measurement" and show perimeter too)
// // // //       geoJson = layer.toGeoJSON();
// // // //       const lengthKm = turf.length(geoJson, { units: 'kilometers' });
// // // //       measurementStr = lengthKm.toFixed(2) + ' km';
// // // //       perimeterM = turf.length(geoJson, { units: 'meters' });

// // // //     } else {
// // // //       setMeasurement('Unsupported shape');
// // // //       setPerimeter(null);
// // // //       return;
// // // //     }

// // // //     // Update states
// // // //     setMeasurement(measurementStr);
// // // //     setPerimeter(perimeterM.toFixed(2) + ' m');

// // // //     // Distance from X (Space : X)
// // // //     if (geoJson) {
// // // //       const centroid = turf.centroid(geoJson);
// // // //       const from = turf.point([locationX[1], locationX[0]]);
// // // //       const to = turf.point(centroid.geometry.coordinates);
// // // //       const distanceKm = turf.distance(from, to, { units: 'kilometers' });
// // // //       setDistanceFromX(distanceKm.toFixed(2) + ' km');
// // // //     }

// // // //     // Land type only for closed shapes
// // // //     if ((layer instanceof L.Circle || layer instanceof L.Polygon) && geoJson) {
// // // //       const land = await fetchLandType(geoJson);
// // // //       setLandType(land);
// // // //     } else {
// // // //       setLandType('N/A (lines)');
// // // //     }
// // // //   };

// // // //   const onCreated = (e) => {
// // // //     const layer = e.layer;
// // // //     featureGroupRef.current.clearLayers();
// // // //     featureGroupRef.current.addLayer(layer);
// // // //     processLayer(layer);
// // // //   };

// // // //   const onEdited = (e) => {
// // // //     e.layers.eachLayer((layer) => processLayer(layer));
// // // //   };

// // // //   const onDeleted = () => {
// // // //     if (featureGroupRef.current.getLayers().length === 0) {
// // // //       setMeasurement(null);
// // // //       setPerimeter(null);
// // // //       setDistanceFromX(null);
// // // //       setLandType('');
// // // //     }
// // // //   };

// // // //   const fetchLandType = async (polygonGeoJson) => {
// // // //     const bbox = turf.bbox(polygonGeoJson);
// // // //     const query = `
// // // //       [out:json];
// // // //       (
// // // //         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // //         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // //         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // //         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // // //       );
// // // //       out body;
// // // //     `;

// // // //     try {
// // // //       const response = await fetch('https://overpass-api.de/api/interpreter', {
// // // //         method: 'POST',
// // // //         body: query,
// // // //       });
// // // //       const data = await response.json();

// // // //       const typeCount = {};
// // // //       data.elements.forEach((el) => {
// // // //         if (el.tags) {
// // // //           const type = el.tags.landuse || el.tags.natural;
// // // //           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
// // // //         }
// // // //       });

// // // //       let dominant = 'unknown';
// // // //       let max = 0;
// // // //       for (const [type, count] of Object.entries(typeCount)) {
// // // //         if (count > max) {
// // // //           max = count;
// // // //           dominant = type;
// // // //         }
// // // //       }
// // // //       return dominant;
// // // //     } catch (error) {
// // // //       console.error('Overpass error:', error);
// // // //       return 'error fetching data';
// // // //     }
// // // //   };

// // // //   const GeolocationMarker = () => {
// // // //     const map = useMap();
// // // //     useEffect(() => {
// // // //       if (!userLocation) return;
// // // //       if (markerRef.current) markerRef.current.remove();

// // // //       const marker = L.marker(userLocation).addTo(map);
// // // //       marker.bindPopup('You are here');
// // // //       markerRef.current = marker;
// // // //       map.setView(userLocation, 13);

// // // //       return () => {
// // // //         if (markerRef.current) markerRef.current.remove();
// // // //       };
// // // //     }, [userLocation, map]);

// // // //     return null;
// // // //   };

// // // //   return (
// // // //     <div style={{ position: 'relative' }}>
// // // //       <MapContainer
// // // //         center={[48.8566, 2.3522]}
// // // //         zoom={13}
// // // //         style={{ height: '600px', width: '100%' }}
// // // //       >
// // // //         <TileLayer
// // // //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // // //           attribution="© OpenStreetMap contributors"
// // // //         />
// // // //         <FeatureGroup ref={featureGroupRef}>
// // // //           <EditControl
// // // //             position="topright"
// // // //             onCreated={onCreated}
// // // //             onEdited={onEdited}
// // // //             onDeleted={onDeleted}
// // // //             draw={{
// // // //               rectangle: true,
// // // //               polygon: { allowIntersection: false, showArea: true },
// // // //               circle: true,
// // // //               polyline: true,
// // // //               marker: false,
// // // //               circlemarker: false,
// // // //             }}
// // // //             edit={{ remove: true }}
// // // //           />
// // // //         </FeatureGroup>
// // // //         <GeolocationMarker />
// // // //       </MapContainer>

// // // //       {/* Info Panel */}
// // // //       <div
// // // //         style={{
// // // //           position: 'absolute',
// // // //           top: '20px',
// // // //           left: '20px',
// // // //           background: 'white',
// // // //           padding: '15px',
// // // //           borderRadius: '8px',
// // // //           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
// // // //           maxWidth: '320px',
// // // //           zIndex: 1000,
// // // //           fontFamily: 'Arial, sans-serif',
// // // //         }}
// // // //       >
// // // //         <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3>

// // // //         <p>
// // // //           <strong>Your location:</strong><br />
// // // //           {userLocation
// // // //             ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
// // // //             : 'Detecting...'}
// // // //         </p>

// // // //         <p>
// // // //           <strong>Measurement:</strong><br />
// // // //           {measurement || '—'}
// // // //         </p>

// // // //         <p>
// // // //           <strong>Perimeter:</strong><br />
// // // //           {perimeter || '—'}
// // // //         </p>

// // // //         <p>
// // // //           <strong>Space : X</strong><br />
// // // //           {distanceFromX || '—'}
// // // //         </p>

// // // //         <p>
// // // //           <strong>Land type:</strong><br />
// // // //           {landType || '—'}
// // // //         </p>

// // // //         <p style={{ fontSize: '0.9em', color: '#666' }}>
// // // //           Draw a polygon, rectangle, circle or polyline.
// // // //         </p>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default LocationFinder;


// // // // ---------------------------------------------------------------------


// // // import React, { useRef, useEffect, useState } from 'react';
// // // import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// // // import { EditControl } from 'react-leaflet-draw';
// // // import L from 'leaflet';
// // // import 'leaflet/dist/leaflet.css';
// // // import 'leaflet-draw/dist/leaflet.draw.css';
// // // import 'leaflet-draw';
// // // import * as turf from '@turf/turf';
// // // import './style.css';

// // // const LocationFinder = () => {
// // //   const [measurement, setMeasurement] = useState(null);     // Area or Length
// // //   const [perimeter, setPerimeter] = useState(null);
// // //   const [landType, setLandType] = useState('');
// // //   const [distanceFromX, setDistanceFromX] = useState(null);
// // //   const [userLocation, setUserLocation] = useState(null);

// // //   const featureGroupRef = useRef(null);
// // //   const markerRef = useRef(null);

// // //   // Fixed reference location (Eiffel Tower)
// // //   const locationX = [48.8584, 2.2945];

// // //   // Get user geolocation
// // //   useEffect(() => {
// // //     if (!navigator.geolocation) return;
// // //     navigator.geolocation.getCurrentPosition(
// // //       (position) => {
// // //         setUserLocation([
// // //           position.coords.latitude,
// // //           position.coords.longitude,
// // //         ]);
// // //       },
// // //       (error) => console.error('Geolocation error:', error)
// // //     );
// // //   }, []);

// // //   // Calculate everything for any shape
// // //   const processLayer = async (layer) => {
// // //     let geoJson = null;
// // //     let measurementStr = '';
// // //     let perimeterM = 0;

// // //     if (layer instanceof L.Circle) {
// // //       const radius = layer.getRadius();
// // //       const areaSqM = Math.PI * radius * radius;
// // //       measurementStr = areaSqM.toFixed(2) + ' m²';
// // //       perimeterM = 2 * Math.PI * radius;

// // //       const center = layer.getLatLng();
// // //       geoJson = turf.circle([center.lng, center.lat], radius / 1000, { units: 'kilometers' });

// // //     } else if (layer instanceof L.Polygon) {
// // //       geoJson = layer.toGeoJSON();
// // //       const areaSqM = turf.area(geoJson);
// // //       measurementStr = areaSqM.toFixed(2) + ' m²';
// // //       perimeterM = turf.length(geoJson, { units: 'meters' });

// // //     } else if (layer instanceof L.Polyline) {
// // //       geoJson = layer.toGeoJSON();
// // //       const lengthKm = turf.length(geoJson, { units: 'kilometers' });
// // //       measurementStr = lengthKm.toFixed(2) + ' km';
// // //       perimeterM = turf.length(geoJson, { units: 'meters' });

// // //     } else {
// // //       setMeasurement('Unsupported shape');
// // //       setPerimeter(null);
// // //       return;
// // //     }

// // //     setMeasurement(measurementStr);
// // //     setPerimeter(perimeterM.toFixed(2) + ' m');

// // //     // Distance from X (Space : X)
// // //     if (geoJson) {
// // //       const centroid = turf.centroid(geoJson);
// // //       const from = turf.point([locationX[1], locationX[0]]);
// // //       const to = turf.point(centroid.geometry.coordinates);
// // //       const distanceKm = turf.distance(from, to, { units: 'kilometers' });
// // //       setDistanceFromX(distanceKm.toFixed(2) + ' km');
// // //     }

// // //     // Land type only for closed shapes
// // //     if ((layer instanceof L.Circle || layer instanceof L.Polygon) && geoJson) {
// // //       const land = await fetchLandType(geoJson);
// // //       setLandType(land);
// // //     } else {
// // //       setLandType('N/A (lines)');
// // //     }
// // //   };

// // //   const onCreated = (e) => {
// // //     const layer = e.layer;
// // //     featureGroupRef.current.clearLayers();
// // //     featureGroupRef.current.addLayer(layer);
// // //     processLayer(layer);
// // //   };

// // //   const onEdited = (e) => {
// // //     e.layers.eachLayer((layer) => processLayer(layer));
// // //   };

// // //   const onDeleted = () => {
// // //     if (featureGroupRef.current.getLayers().length === 0) {
// // //       setMeasurement(null);
// // //       setPerimeter(null);
// // //       setDistanceFromX(null);
// // //       setLandType('');
// // //     }
// // //   };

// // //   const fetchLandType = async (polygonGeoJson) => {
// // //     const bbox = turf.bbox(polygonGeoJson);
// // //     const query = `
// // //       [out:json];
// // //       (
// // //         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // //         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // //         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // //         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // //       );
// // //       out body;
// // //     `;

// // //     try {
// // //       const response = await fetch('https://overpass-api.de/api/interpreter', {
// // //         method: 'POST',
// // //         body: query,
// // //       });
// // //       const data = await response.json();

// // //       const typeCount = {};
// // //       data.elements.forEach((el) => {
// // //         if (el.tags) {
// // //           const type = el.tags.landuse || el.tags.natural;
// // //           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
// // //         }
// // //       });

// // //       let dominant = 'unknown';
// // //       let max = 0;
// // //       for (const [type, count] of Object.entries(typeCount)) {
// // //         if (count > max) {
// // //           max = count;
// // //           dominant = type;
// // //         }
// // //       }
// // //       return dominant;
// // //     } catch (error) {
// // //       console.error('Overpass error:', error);
// // //       return 'error fetching data';
// // //     }
// // //   };

// // //   const GeolocationMarker = () => {
// // //     const map = useMap();
// // //     useEffect(() => {
// // //       if (!userLocation) return;
// // //       if (markerRef.current) markerRef.current.remove();

// // //       const marker = L.marker(userLocation).addTo(map);
// // //       marker.bindPopup('You are here');
// // //       markerRef.current = marker;
// // //       map.setView(userLocation, 13);

// // //       return () => {
// // //         if (markerRef.current) markerRef.current.remove();
// // //       };
// // //     }, [userLocation, map]);

// // //     return null;
// // //   };

// // //   return (
// // //     <div style={{ position: 'relative' }}>
// // //       <MapContainer
// // //         center={[48.8566, 2.3522]}
// // //         zoom={13}
// // //         style={{ height: '600px', width: '100%' }}
// // //       >
// // //         <TileLayer
// // //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // //           attribution="© OpenStreetMap contributors"
// // //         />
// // //         <FeatureGroup ref={featureGroupRef}>
// // //           <EditControl
// // //             position="topright"
// // //             onCreated={onCreated}
// // //             onEdited={onEdited}
// // //             onDeleted={onDeleted}
// // //             draw={{
// // //               rectangle: true,
// // //               polygon: { 
// // //                 allowIntersection: false, 
// // //                 showArea: true 
// // //               },
// // //               circle: true,
// // //               polyline: true,
// // //               marker: false,
// // //               circlemarker: false,
// // //             }}
// // //             edit={{ remove: true }}
// // //           />
// // //         </FeatureGroup>
// // //         <GeolocationMarker />
// // //       </MapContainer>

// // //       {/* Info Panel */}
// // //       <div
// // //         style={{
// // //           position: 'absolute',
// // //           top: '20px',
// // //           left: '20px',
// // //           background: 'white',
// // //           padding: '15px',
// // //           borderRadius: '8px',
// // //           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
// // //           maxWidth: '320px',
// // //           zIndex: 1000,
// // //           fontFamily: 'Arial, sans-serif',
// // //         }}
// // //       >
// // //         <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3>

// // //         <p>
// // //           <strong>Your location:</strong><br />
// // //           {userLocation
// // //             ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
// // //             : 'Detecting...'}
// // //         </p>

// // //         <p>
// // //           <strong>Measurement:</strong><br />
// // //           {measurement || '—'}
// // //         </p>

// // //         <p>
// // //           <strong>Perimeter:</strong><br />
// // //           {perimeter || '—'}
// // //         </p>

// // //         <p>
// // //           <strong>Space : X</strong><br />
// // //           {distanceFromX || '—'}
// // //         </p>

// // //         <p>
// // //           <strong>Land type:</strong><br />
// // //           {landType || '—'}
// // //         </p>

// // //         <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
// // //           <strong>How to draw:</strong><br />
// // //           • Polygon → click points, then <strong>click the starting point again</strong> to <strong>auto-close</strong><br />
// // //           • Rectangle / Circle → click + drag<br />
// // //           • Polyline → click points (open line)
// // //         </p>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default LocationFinder;







// // // ------------------------------------------------------------------------------------------------------








// // // import React, { useRef, useEffect, useState } from 'react';
// // // import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// // // import { EditControl } from 'react-leaflet-draw';
// // // import L from 'leaflet';
// // // import 'leaflet/dist/leaflet.css';
// // // import 'leaflet-draw/dist/leaflet.draw.css';
// // // import 'leaflet-draw';
// // // import * as turf from '@turf/turf';
// // // import './style.css';

// // // const LocationFinder = () => {
// // //   const [space, setSpace] = useState(null);           // Surface / Area (m²) for closed shapes
// // //   const [lineLength, setLineLength] = useState(null); // Length (km) for polylines
// // //   const [perimeter, setPerimeter] = useState(null);
// // //   const [landType, setLandType] = useState('');
// // //   const [distanceFromX, setDistanceFromX] = useState(null);
// // //   const [userLocation, setUserLocation] = useState(null);

// // //   const featureGroupRef = useRef(null);
// // //   const markerRef = useRef(null);

// // //   // Fixed reference location (Eiffel Tower)
// // //   const locationX = [48.8584, 2.2945];

// // //   // Get user geolocation
// // //   useEffect(() => {
// // //     if (!navigator.geolocation) return;
// // //     navigator.geolocation.getCurrentPosition(
// // //       (position) => {
// // //         setUserLocation([
// // //           position.coords.latitude,
// // //           position.coords.longitude,
// // //         ]);
// // //       },
// // //       (error) => console.error('Geolocation error:', error)
// // //     );
// // //   }, []);

// // //   // Calculate everything
// // //   const processLayer = async (layer) => {
// // //     let geoJson = null;
// // //     let perimeterM = 0;

// // //     if (layer instanceof L.Circle) {
// // //       const radius = layer.getRadius();
// // //       const areaSqM = Math.PI * radius * radius;

// // //       setSpace(areaSqM.toFixed(2) + ' m²');           // Space = Surface like 5×2=10 m²
// // //       setLineLength(null);
// // //       perimeterM = 2 * Math.PI * radius;

// // //       const center = layer.getLatLng();
// // //       geoJson = turf.circle([center.lng, center.lat], radius / 1000, { units: 'kilometers' });

// // //     } else if (layer instanceof L.Polygon) {
// // //       geoJson = layer.toGeoJSON();
// // //       const areaSqM = turf.area(geoJson);

// // //       setSpace(areaSqM.toFixed(2) + ' m²');           // Space = Surface (works for rectangle too)
// // //       setLineLength(null);
// // //       perimeterM = turf.length(geoJson, { units: 'meters' });

// // //     } else if (layer instanceof L.Polyline) {
// // //       geoJson = layer.toGeoJSON();
// // //       const lengthKm = turf.length(geoJson, { units: 'kilometers' });

// // //       setSpace(null);
// // //       setLineLength(lengthKm.toFixed(2) + ' km');
// // //       perimeterM = turf.length(geoJson, { units: 'meters' });

// // //     } else {
// // //       setSpace('Unsupported shape');
// // //       setLineLength(null);
// // //       setPerimeter(null);
// // //       return;
// // //     }

// // //     setPerimeter(perimeterM.toFixed(2) + ' m');

// // //     // Distance from X
// // //     if (geoJson) {
// // //       const centroid = turf.centroid(geoJson);
// // //       const from = turf.point([locationX[1], locationX[0]]);
// // //       const to = turf.point(centroid.geometry.coordinates);
// // //       const distanceKm = turf.distance(from, to, { units: 'kilometers' });
// // //       setDistanceFromX(distanceKm.toFixed(2) + ' km');
// // //     }

// // //     // Land type only for closed shapes (surface)
// // //     if ((layer instanceof L.Circle || layer instanceof L.Polygon) && geoJson) {
// // //       const land = await fetchLandType(geoJson);
// // //       setLandType(land);
// // //     } else {
// // //       setLandType('N/A (lines)');
// // //     }
// // //   };

// // //   const onCreated = (e) => {
// // //     const layer = e.layer;
// // //     featureGroupRef.current.clearLayers();
// // //     featureGroupRef.current.addLayer(layer);
// // //     processLayer(layer);
// // //   };

// // //   const onEdited = (e) => {
// // //     e.layers.eachLayer((layer) => processLayer(layer));
// // //   };

// // //   const onDeleted = () => {
// // //     if (featureGroupRef.current.getLayers().length === 0) {
// // //       setSpace(null);
// // //       setLineLength(null);
// // //       setPerimeter(null);
// // //       setDistanceFromX(null);
// // //       setLandType('');
// // //     }
// // //   };

// // //   const fetchLandType = async (polygonGeoJson) => {
// // //     const bbox = turf.bbox(polygonGeoJson);
// // //     const query = `
// // //       [out:json];
// // //       (
// // //         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // //         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // //         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // //         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // //       );
// // //       out body;
// // //     `;

// // //     try {
// // //       const response = await fetch('https://overpass-api.de/api/interpreter', {
// // //         method: 'POST',
// // //         body: query,
// // //       });
// // //       const data = await response.json();

// // //       const typeCount = {};
// // //       data.elements.forEach((el) => {
// // //         if (el.tags) {
// // //           const type = el.tags.landuse || el.tags.natural;
// // //           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
// // //         }
// // //       });

// // //       let dominant = 'unknown';
// // //       let max = 0;
// // //       for (const [type, count] of Object.entries(typeCount)) {
// // //         if (count > max) {
// // //           max = count;
// // //           dominant = type;
// // //         }
// // //       }
// // //       return dominant;
// // //     } catch (error) {
// // //       console.error('Overpass error:', error);
// // //       return 'error fetching data';
// // //     }
// // //   };

// // //   const GeolocationMarker = () => {
// // //     const map = useMap();
// // //     useEffect(() => {
// // //       if (!userLocation) return;
// // //       if (markerRef.current) markerRef.current.remove();

// // //       const marker = L.marker(userLocation).addTo(map);
// // //       marker.bindPopup('You are here');
// // //       markerRef.current = marker;
// // //       map.setView(userLocation, 13);

// // //       return () => {
// // //         if (markerRef.current) markerRef.current.remove();
// // //       };
// // //     }, [userLocation, map]);

// // //     return null;
// // //   };

// // //   return (
// // //     <div style={{ position: 'relative' }}>
// // //       <MapContainer
// // //         center={[48.8566, 2.3522]}
// // //         zoom={13}
// // //         style={{ height: '600px', width: '100%' }}
// // //       >
// // //         <TileLayer
// // //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // //           attribution="© OpenStreetMap contributors"
// // //         />
// // //         <FeatureGroup ref={featureGroupRef}>
// // //           <EditControl
// // //             position="topright"
// // //             onCreated={onCreated}
// // //             onEdited={onEdited}
// // //             onDeleted={onDeleted}
// // //             draw={{
// // //               rectangle: true,
// // //               polygon: { 
// // //                 allowIntersection: false, 
// // //                 showArea: true 
// // //               },
// // //               circle: true,
// // //               polyline: true,
// // //               marker: false,
// // //               circlemarker: false,
// // //             }}
// // //             edit={{ remove: true }}
// // //           />
// // //         </FeatureGroup>
// // //         <GeolocationMarker />
// // //       </MapContainer>

// // //       {/* Info Panel */}
// // //       <div
// // //         style={{
// // //           position: 'absolute',
// // //           top: '20px',
// // //           left: '20px',
// // //           background: 'white',
// // //           padding: '15px',
// // //           borderRadius: '8px',
// // //           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
// // //           maxWidth: '320px',
// // //           zIndex: 1000,
// // //           fontFamily: 'Arial, sans-serif',
// // //         }}
// // //       >
// // //         <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3>

// // //         <p>
// // //           <strong>Your location:</strong><br />
// // //           {userLocation
// // //             ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
// // //             : 'Detecting...'}
// // //         </p>

// // //         <p>
// // //           <strong>Space:</strong><br />
// // //           {space || '—'}
// // //         </p>

// // //         {lineLength && (
// // //           <p>
// // //             <strong>Length:</strong><br />
// // //             {lineLength}
// // //           </p>
// // //         )}

// // //         <p>
// // //           <strong>Perimeter:</strong><br />
// // //           {perimeter || '—'}
// // //         </p>

// // //         <p>
// // //           <strong>Distance : X</strong><br />
// // //           {distanceFromX || '—'}
// // //         </p>

// // //         <p>
// // //           <strong>Land type:</strong><br />
// // //           {landType || '—'}
// // //         </p>

// // //         <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
// // //           <strong>How to draw:</strong><br />
// // //           • Polygon / Rectangle → click points, click start point again to auto-close<br />
// // //           • Circle → click + drag<br />
// // //           • Polyline → click points (open line)<br />
// // //           <strong>Space</strong> = surface area (like rectangle 5×2 = 10 m²)
// // //         </p>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default LocationFinder;

// // // ----------------------------------------------------------------------------------------------------




// // // import React, { useRef, useEffect, useState } from 'react';
// // // import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// // // import { EditControl } from 'react-leaflet-draw';
// // // import L from 'leaflet';
// // // import 'leaflet/dist/leaflet.css';
// // // import 'leaflet-draw/dist/leaflet.draw.css';
// // // import 'leaflet-draw';
// // // import * as turf from '@turf/turf';
// // // import './style.css';  // make sure this file contains the CSS overrides

// // // const LocationFinder = () => {
// // //   const [space, setSpace] = useState(null);
// // //   const [lineLength, setLineLength] = useState(null);
// // //   const [perimeter, setPerimeter] = useState(null);
// // //   const [landType, setLandType] = useState('');
// // //   const [distanceFromX, setDistanceFromX] = useState(null);
// // //   const [userLocation, setUserLocation] = useState(null);

// // //   const featureGroupRef = useRef(null);
// // //   const markerRef = useRef(null);

// // //   // Fixed reference point (Eiffel Tower)
// // //   const locationX = [48.8584, 2.2945];

// // //   // Get user's geolocation
// // //   useEffect(() => {
// // //     if (!navigator.geolocation) return;
// // //     navigator.geolocation.getCurrentPosition(
// // //       (position) => {
// // //         setUserLocation([
// // //           position.coords.latitude,
// // //           position.coords.longitude,
// // //         ]);
// // //       },
// // //       (error) => console.error('Geolocation error:', error)
// // //     );
// // //   }, []);

// // //   // Process a drawn layer: compute area/length, perimeter, distance from X, and land type
// // //   const processLayer = async (layer) => {
// // //     let geoJson = null;
// // //     let perimeterM = 0;

// // //     try {
// // //       // Circle
// // //       if (layer instanceof L.Circle) {
// // //         const radius = layer.getRadius();
// // //         const areaSqM = Math.PI * radius * radius;
// // //         setSpace(areaSqM.toFixed(2) + ' m²');
// // //         setLineLength(null);
// // //         perimeterM = 2 * Math.PI * radius;

// // //         const center = layer.getLatLng();
// // //         geoJson = turf.circle([center.lng, center.lat], radius / 1000, { units: 'kilometers' });
// // //       }
// // //       // Polygon (includes rectangles)
// // //       else if (layer instanceof L.Polygon) {
// // //         geoJson = layer.toGeoJSON();
// // //         const areaSqM = turf.area(geoJson);
// // //         setSpace(areaSqM.toFixed(2) + ' m²');
// // //         setLineLength(null);
// // //         perimeterM = turf.length(geoJson, { units: 'meters' });
// // //       }
// // //       // Polyline (open line)
// // //       else if (layer instanceof L.Polyline) {
// // //         geoJson = layer.toGeoJSON();
// // //         const lengthKm = turf.length(geoJson, { units: 'kilometers' });
// // //         setSpace(null);
// // //         setLineLength(lengthKm.toFixed(2) + ' km');
// // //         perimeterM = turf.length(geoJson, { units: 'meters' });
// // //       }
// // //       // Unsupported shape
// // //       else {
// // //         setSpace('Unsupported shape');
// // //         setLineLength(null);
// // //         setPerimeter(null);
// // //         setDistanceFromX(null);
// // //         setLandType('');
// // //         return;
// // //       }

// // //       setPerimeter(perimeterM.toFixed(2) + ' m');

// // //       // Distance from fixed point X
// // //       if (geoJson) {
// // //         const centroid = turf.centroid(geoJson);
// // //         if (centroid?.geometry?.coordinates) {
// // //           const from = turf.point([locationX[1], locationX[0]]);
// // //           const to = turf.point(centroid.geometry.coordinates);
// // //           const distanceKm = turf.distance(from, to, { units: 'kilometers' });
// // //           setDistanceFromX(distanceKm.toFixed(2) + ' km');
// // //         } else {
// // //           setDistanceFromX('Error');
// // //         }
// // //       } else {
// // //         setDistanceFromX(null);
// // //       }

// // //       // Land type only for closed shapes (polygons & circles)
// // //       if ((layer instanceof L.Circle || layer instanceof L.Polygon) && geoJson) {
// // //         const land = await fetchLandType(geoJson);
// // //         setLandType(land);
// // //       } else {
// // //         setLandType('N/A (lines)');
// // //       }
// // //     } catch (error) {
// // //       console.error('Error processing layer:', error);
// // //       setDistanceFromX('Error');
// // //       setLandType('Error');
// // //     }
// // //   };

// // //   // Handle shape creation
// // //   const onCreated = (e) => {
// // //     const layer = e.layer;
// // //     featureGroupRef.current.clearLayers(); // only one shape at a time
// // //     featureGroupRef.current.addLayer(layer);
// // //     processLayer(layer);
// // //   };

// // //   // Handle shape editing
// // //   const onEdited = (e) => {
// // //     e.layers.eachLayer((layer) => processLayer(layer));
// // //   };

// // //   // Handle shape deletion
// // //   const onDeleted = () => {
// // //     if (featureGroupRef.current.getLayers().length === 0) {
// // //       setSpace(null);
// // //       setLineLength(null);
// // //       setPerimeter(null);
// // //       setDistanceFromX(null);
// // //       setLandType('');
// // //     }
// // //   };

// // //   // Query OpenStreetMap Overpass API to guess land type inside the polygon
// // //   const fetchLandType = async (polygonGeoJson) => {
// // //     const bbox = turf.bbox(polygonGeoJson);
// // //     const query = `
// // //       [out:json];
// // //       (
// // //         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // //         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // //         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // //         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// // //       );
// // //       out body;
// // //     `;

// // //     try {
// // //       const response = await fetch('https://overpass-api.de/api/interpreter', {
// // //         method: 'POST',
// // //         body: query,
// // //       });
// // //       const data = await response.json();

// // //       const typeCount = {};
// // //       data.elements.forEach((el) => {
// // //         if (el.tags) {
// // //           const type = el.tags.landuse || el.tags.natural;
// // //           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
// // //         }
// // //       });

// // //       let dominant = 'unknown';
// // //       let max = 0;
// // //       for (const [type, count] of Object.entries(typeCount)) {
// // //         if (count > max) {
// // //           max = count;
// // //           dominant = type;
// // //         }
// // //       }
// // //       return dominant;
// // //     } catch (error) {
// // //       console.error('Overpass error:', error);
// // //       return 'error fetching data';
// // //     }
// // //   };

// // //   // Component to show a marker at the user's location
// // //   const GeolocationMarker = () => {
// // //     const map = useMap();
// // //     useEffect(() => {
// // //       if (!userLocation) return;
// // //       if (markerRef.current) markerRef.current.remove();

// // //       const marker = L.marker(userLocation).addTo(map);
// // //       marker.bindPopup('You are here');
// // //       markerRef.current = marker;
// // //       map.setView(userLocation, 13);

// // //       return () => {
// // //         if (markerRef.current) markerRef.current.remove();
// // //       };
// // //     }, [userLocation, map]);

// // //     return null;
// // //   };

// // //   return (
// // //     <div style={{ position: 'relative' }}>
// // //       <MapContainer
// // //         center={[48.8566, 2.3522]}
// // //         zoom={13}
// // //         style={{ height: '600px', width: '100%' }}
// // //       >
// // //         <TileLayer
// // //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// // //           attribution="© OpenStreetMap contributors"
// // //         />
// // //         <FeatureGroup ref={featureGroupRef}>
// // //           <EditControl
// // //             position="topright"
// // //             onCreated={onCreated}
// // //             onEdited={onEdited}
// // //             onDeleted={onDeleted}
// // //             draw={{
// // //               rectangle: true,
// // //               polygon: {
// // //                 allowIntersection: false,
// // //                 showArea: true,      // shows area while drawing
// // //               },
// // //               circle: true,
// // //               polyline: true,
// // //               marker: false,
// // //               circlemarker: false,
// // //             }}
// // //             edit={{ remove: true }}  // keeps delete button, vertices are draggable
// // //           />
// // //         </FeatureGroup>
// // //         <GeolocationMarker />
// // //       </MapContainer>

// // //       {/* Info Panel */}
// // //       <div
// // //         style={{
// // //           position: 'absolute',
// // //           top: '20px',
// // //           left: '20px',
// // //           background: 'white',
// // //           padding: '15px',
// // //           borderRadius: '8px',
// // //           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
// // //           maxWidth: '320px',
// // //           zIndex: 1000,
// // //           fontFamily: 'Arial, sans-serif',
// // //         }}
// // //       >
// // //         <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3>

// // //         <p>
// // //           <strong>Your location:</strong><br />
// // //           {userLocation
// // //             ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
// // //             : 'Detecting...'}
// // //         </p>

// // //         <p>
// // //           <strong>Space:</strong><br />
// // //           {space || '—'}
// // //         </p>

// // //         {lineLength && (
// // //           <p>
// // //             <strong>Length:</strong><br />
// // //             {lineLength}
// // //           </p>
// // //         )}

// // //         <p>
// // //           <strong>Perimeter:</strong><br />
// // //           {perimeter || '—'}
// // //         </p>

// // //         <p>
// // //           <strong>Distance from X:</strong><br />
// // //           {distanceFromX || '—'}
// // //         </p>

// // //         <p>
// // //           <strong>Land type:</strong><br />
// // //           {landType || '—'}
// // //         </p>

// // //         <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
// // //           <strong>How to draw:</strong><br />
// // //           • Polygon / Rectangle → click points, click start point again to auto‑close<br />
// // //           • Circle → click + drag<br />
// // //           • Polyline → click points (open line)<br />
// // //           <strong>Space</strong> = surface area (like rectangle 5×2 = 10 m²)
// // //         </p>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default LocationFinder;


// // // ---------------------------------------------------------------------------------------------------



// // import React, { useRef, useEffect, useState } from 'react';
// // import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// // import { EditControl } from 'react-leaflet-draw';
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import 'leaflet-draw/dist/leaflet.draw.css';
// // import 'leaflet-draw';
// // import * as turf from '@turf/turf';
// // import './style.css';  // include the CSS below

// // const LocationFinder = () => {
// //   const [space, setSpace] = useState(null);
// //   const [lineLength, setLineLength] = useState(null);
// //   const [perimeter, setPerimeter] = useState(null);
// //   const [landType, setLandType] = useState('');
// //   const [distanceFromX, setDistanceFromX] = useState(null);
// //   const [userLocation, setUserLocation] = useState(null);

// //   const featureGroupRef = useRef(null);
// //   const markerRef = useRef(null);

// //   const locationX = [48.8584, 2.2945]; // Eiffel Tower

// //   // Get user's location
// //   useEffect(() => {
// //     if (!navigator.geolocation) return;
// //     navigator.geolocation.getCurrentPosition(
// //       (position) => {
// //         setUserLocation([position.coords.latitude, position.coords.longitude]);
// //       },
// //       (error) => console.error('Geolocation error:', error)
// //     );
// //   }, []);

// //   // Process a drawn layer
// //   const processLayer = async (layer) => {
// //     let geoJson = null;
// //     let perimeterM = 0;

// //     try {
// //       if (layer instanceof L.Circle) {
// //         const radius = layer.getRadius();
// //         const areaSqM = Math.PI * radius * radius;
// //         setSpace(areaSqM.toFixed(2) + ' m²');
// //         setLineLength(null);
// //         perimeterM = 2 * Math.PI * radius;

// //         const center = layer.getLatLng();
// //         geoJson = turf.circle([center.lng, center.lat], radius / 1000, { units: 'kilometers' });
// //       } else if (layer instanceof L.Polygon) {
// //         geoJson = layer.toGeoJSON();
// //         const areaSqM = turf.area(geoJson);
// //         setSpace(areaSqM.toFixed(2) + ' m²');
// //         setLineLength(null);
// //         perimeterM = turf.length(geoJson, { units: 'meters' });
// //       } else if (layer instanceof L.Polyline) {
// //         geoJson = layer.toGeoJSON();
// //         const lengthKm = turf.length(geoJson, { units: 'kilometers' });
// //         setSpace(null);
// //         setLineLength(lengthKm.toFixed(2) + ' km');
// //         perimeterM = turf.length(geoJson, { units: 'meters' });
// //       } else {
// //         setSpace('Unsupported shape');
// //         setLineLength(null);
// //         setPerimeter(null);
// //         setDistanceFromX(null);
// //         setLandType('');
// //         return;
// //       }

// //       setPerimeter(perimeterM.toFixed(2) + ' m');

// //       // Distance from fixed point
// //       if (geoJson) {
// //         const centroid = turf.centroid(geoJson);
// //         if (centroid?.geometry?.coordinates) {
// //           const from = turf.point([locationX[1], locationX[0]]);
// //           const to = turf.point(centroid.geometry.coordinates);
// //           const distanceKm = turf.distance(from, to, { units: 'kilometers' });
// //           setDistanceFromX(distanceKm.toFixed(2) + ' km');
// //         } else {
// //           setDistanceFromX('Error');
// //         }
// //       } else {
// //         setDistanceFromX(null);
// //       }

// //       // Land type for closed shapes
// //       if ((layer instanceof L.Circle || layer instanceof L.Polygon) && geoJson) {
// //         const land = await fetchLandType(geoJson);
// //         setLandType(land);
// //       } else {
// //         setLandType('N/A (lines)');
// //       }
// //     } catch (error) {
// //       console.error('Error processing layer:', error);
// //       setDistanceFromX('Error');
// //       setLandType('Error');
// //     }
// //   };

// //   // Handle shape creation
// //   const onCreated = (e) => {
// //     const layer = e.layer;
// //     featureGroupRef.current.clearLayers(); // keep only one shape
// //     featureGroupRef.current.addLayer(layer);
// //     processLayer(layer);
// //   };

// //   // Custom delete button handler
// //   const handleDelete = () => {
// //     if (featureGroupRef.current) {
// //       featureGroupRef.current.clearLayers();
// //       setSpace(null);
// //       setLineLength(null);
// //       setPerimeter(null);
// //       setDistanceFromX(null);
// //       setLandType('');
// //     }
// //   };

// //   // Fetch land type from Overpass API
// //   const fetchLandType = async (polygonGeoJson) => {
// //     const bbox = turf.bbox(polygonGeoJson);
// //     const query = `
// //       [out:json];
// //       (
// //         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// //         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// //         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// //         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// //       );
// //       out body;
// //     `;

// //     try {
// //       const response = await fetch('https://overpass-api.de/api/interpreter', {
// //         method: 'POST',
// //         body: query,
// //       });
// //       const data = await response.json();

// //       const typeCount = {};
// //       data.elements.forEach((el) => {
// //         if (el.tags) {
// //           const type = el.tags.landuse || el.tags.natural;
// //           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
// //         }
// //       });

// //       let dominant = 'unknown';
// //       let max = 0;
// //       for (const [type, count] of Object.entries(typeCount)) {
// //         if (count > max) {
// //           max = count;
// //           dominant = type;
// //         }
// //       }
// //       return dominant;
// //     } catch (error) {
// //       console.error('Overpass error:', error);
// //       return 'error fetching data';
// //     }
// //   };

// //   // Marker for user location
// //   const GeolocationMarker = () => {
// //     const map = useMap();
// //     useEffect(() => {
// //       if (!userLocation) return;
// //       if (markerRef.current) markerRef.current.remove();

// //       const marker = L.marker(userLocation).addTo(map);
// //       marker.bindPopup('You are here');
// //       markerRef.current = marker;
// //       map.setView(userLocation, 13);

// //       return () => {
// //         if (markerRef.current) markerRef.current.remove();
// //       };
// //     }, [userLocation, map]);

// //     return null;
// //   };

// //   return (
// //     <div style={{ position: 'relative' }}>
// //       <MapContainer
// //         center={[48.8566, 2.3522]}
// //         zoom={13}
// //         style={{ height: '600px', width: '100%' }}
// //       >
// //         <TileLayer
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //           attribution="© OpenStreetMap contributors"
// //         />
// //         <FeatureGroup ref={featureGroupRef}>
// //           <EditControl
// //             position="topright"
// //             onCreated={onCreated}
// //             draw={{
// //               rectangle: true,
// //               polygon: {
// //                 allowIntersection: false,
// //                 showArea: true,      // shows area while drawing
// //               },
// //               circle: true,
// //               polyline: true,
// //               marker: false,
// //               circlemarker: false,
// //             }}
// //             edit={false}            // <-- disable editing = no draggable vertices
// //           />
// //         </FeatureGroup>
// //         <GeolocationMarker />
// //       </MapContainer>

// //       {/* Info Panel */}
// //       <div
// //         style={{
// //           position: 'absolute',
// //           top: '20px',
// //           left: '20px',
// //           background: 'white',
// //           padding: '15px',
// //           borderRadius: '8px',
// //           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
// //           maxWidth: '320px',
// //           zIndex: 1000,
// //           fontFamily: 'Arial, sans-serif',
// //         }}
// //       >
// //         <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3>

// //         <p>
// //           <strong>Your location:</strong><br />
// //           {userLocation
// //             ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
// //             : 'Detecting...'}
// //         </p>

// //         <p>
// //           <strong>Space:</strong><br />
// //           {space || '—'}
// //         </p>

// //         {lineLength && (
// //           <p>
// //             <strong>Length:</strong><br />
// //             {lineLength}
// //           </p>
// //         )}

// //         <p>
// //           <strong>Perimeter:</strong><br />
// //           {perimeter || '—'}
// //         </p>

// //         <p>
// //           <strong>Distance from X:</strong><br />
// //           {distanceFromX || '—'}
// //         </p>

// //         <p>
// //           <strong>Land type:</strong><br />
// //           {landType || '—'}
// //         </p>

// //         {/* Custom delete button */}
// //         <button
// //           onClick={handleDelete}
// //           style={{
// //             marginTop: '10px',
// //             padding: '5px 10px',
// //             background: '#f44336',
// //             color: 'white',
// //             border: 'none',
// //             borderRadius: '4px',
// //             cursor: 'pointer',
// //           }}
// //         >
// //           Delete Shape
// //         </button>

// //         <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
// //           <strong>How to draw:</strong><br />
// //           • Polygon / Rectangle → click points, click start point again to auto‑close<br />
// //           • Circle → click + drag<br />
// //           • Polyline → click points (open line)<br />
// //           <strong>Space</strong> = surface area (like rectangle 5×2 = 10 m²)
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LocationFinder;




// // ---------------------------------------------------------------------------------



// // import React, { useRef, useEffect, useState } from 'react';
// // import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// // import { EditControl } from 'react-leaflet-draw';
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import 'leaflet-draw/dist/leaflet.draw.css';
// // import 'leaflet-draw';
// // import * as turf from '@turf/turf';
// // import './style.css';

// // const LocationFinder = () => {
// //   const [space, setSpace] = useState(null);
// //   const [lineLength, setLineLength] = useState(null);
// //   const [perimeter, setPerimeter] = useState(null);
// //   const [landType, setLandType] = useState('');
// //   const [distanceFromX, setDistanceFromX] = useState(null);
// //   const [userLocation, setUserLocation] = useState(null);

// //   const featureGroupRef = useRef(null);
// //   const markerRef = useRef(null);

// //   const locationX = [48.8584, 2.2945]; // Eiffel Tower

// //   // Get user location
// //   useEffect(() => {
// //     if (!navigator.geolocation) return;
// //     navigator.geolocation.getCurrentPosition(
// //       (position) => {
// //         setUserLocation([position.coords.latitude, position.coords.longitude]);
// //       },
// //       (error) => console.error('Geolocation error:', error)
// //     );
// //   }, []);

// //   // Process a drawn layer
// //   const processLayer = async (layer) => {
// //     let geoJson = null;
// //     let perimeterM = 0;

// //     try {
// //       if (layer instanceof L.Circle) {
// //         const radius = layer.getRadius();
// //         const areaSqM = Math.PI * radius * radius;
// //         setSpace(areaSqM.toFixed(2) + ' m²');
// //         setLineLength(null);
// //         perimeterM = 2 * Math.PI * radius;

// //         const center = layer.getLatLng();
// //         geoJson = turf.circle([center.lng, center.lat], radius / 1000, { units: 'kilometers' });
// //       } else if (layer instanceof L.Polygon) {
// //         geoJson = layer.toGeoJSON();
// //         const areaSqM = turf.area(geoJson);
// //         setSpace(areaSqM.toFixed(2) + ' m²');
// //         setLineLength(null);
// //         perimeterM = turf.length(geoJson, { units: 'meters' });
// //       } else if (layer instanceof L.Polyline) {
// //         geoJson = layer.toGeoJSON();
// //         const lengthKm = turf.length(geoJson, { units: 'kilometers' });
// //         setSpace(null);
// //         setLineLength(lengthKm.toFixed(2) + ' km');
// //         perimeterM = turf.length(geoJson, { units: 'meters' });
// //       } else {
// //         setSpace('Unsupported shape');
// //         setLineLength(null);
// //         setPerimeter(null);
// //         setDistanceFromX(null);
// //         setLandType('');
// //         return;
// //       }

// //       setPerimeter(perimeterM.toFixed(2) + ' m');

// //       // Distance from fixed point
// //       if (geoJson) {
// //         const centroid = turf.centroid(geoJson);
// //         if (centroid?.geometry?.coordinates) {
// //           const from = turf.point([locationX[1], locationX[0]]);
// //           const to = turf.point(centroid.geometry.coordinates);
// //           const distanceKm = turf.distance(from, to, { units: 'kilometers' });
// //           setDistanceFromX(distanceKm.toFixed(2) + ' km');
// //         } else {
// //           setDistanceFromX('Error');
// //         }
// //       } else {
// //         setDistanceFromX(null);
// //       }

// //       // Land type for closed shapes
// //       if ((layer instanceof L.Circle || layer instanceof L.Polygon) && geoJson) {
// //         const land = await fetchLandType(geoJson);
// //         setLandType(land);
// //       } else {
// //         setLandType('N/A (lines)');
// //       }
// //     } catch (error) {
// //       console.error('Error processing layer:', error);
// //       setDistanceFromX('Error');
// //       setLandType('Error');
// //     }
// //   };

// //   // Handle shape creation
// //   const onCreated = (e) => {
// //     const layer = e.layer;
// //     // Clear any previous shape and add the new one
// //     featureGroupRef.current.clearLayers();
// //     featureGroupRef.current.addLayer(layer);
// //     processLayer(layer);
// //   };

// //   // Custom delete button handler
// //   const handleDelete = () => {
// //     if (featureGroupRef.current) {
// //       featureGroupRef.current.clearLayers();
// //       setSpace(null);
// //       setLineLength(null);
// //       setPerimeter(null);
// //       setDistanceFromX(null);
// //       setLandType('');
// //     }
// //   };

// //   // Fetch land type from Overpass API
// //   const fetchLandType = async (polygonGeoJson) => {
// //     const bbox = turf.bbox(polygonGeoJson);
// //     const query = `
// //       [out:json];
// //       (
// //         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// //         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// //         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// //         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// //       );
// //       out body;
// //     `;

// //     try {
// //       const response = await fetch('https://overpass-api.de/api/interpreter', {
// //         method: 'POST',
// //         body: query,
// //       });
// //       const data = await response.json();

// //       const typeCount = {};
// //       data.elements.forEach((el) => {
// //         if (el.tags) {
// //           const type = el.tags.landuse || el.tags.natural;
// //           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
// //         }
// //       });

// //       let dominant = 'unknown';
// //       let max = 0;
// //       for (const [type, count] of Object.entries(typeCount)) {
// //         if (count > max) {
// //           max = count;
// //           dominant = type;
// //         }
// //       }
// //       return dominant;
// //     } catch (error) {
// //       console.error('Overpass error:', error);
// //       return 'error fetching data';
// //     }
// //   };

// //   // Marker for user location
// //   const GeolocationMarker = () => {
// //     const map = useMap();
// //     useEffect(() => {
// //       if (!userLocation) return;
// //       if (markerRef.current) markerRef.current.remove();

// //       const marker = L.marker(userLocation).addTo(map);
// //       marker.bindPopup('You are here');
// //       markerRef.current = marker;
// //       map.setView(userLocation, 13);

// //       return () => {
// //         if (markerRef.current) markerRef.current.remove();
// //       };
// //     }, [userLocation, map]);

// //     return null;
// //   };

// //   return (
// //     <div style={{ position: 'relative' }}>
// //       <MapContainer
// //         center={[48.8566, 2.3522]}
// //         zoom={13}
// //         style={{ height: '600px', width: '100%' }}
// //       >
// //         <TileLayer
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //           attribution="© OpenStreetMap contributors"
// //         />
// //         <FeatureGroup ref={featureGroupRef}>
// //           <EditControl
// //             position="topright"
// //             onCreated={onCreated}
// //             draw={{
// //               rectangle: true,
// //               polygon: {
// //                 allowIntersection: false,
// //                 showArea: true,         // shows area while drawing
// //                 drawError: {
// //                   color: '#b00b00',     // color for self-intersection errors
// //                   message: 'Shape cannot self-intersect!'
// //                 },
// //                 shapeOptions: {
// //                   color: '#3388ff'      // default blue
// //                 }
// //               },
// //               circle: true,
// //               polyline: {
// //                 allowIntersection: false,
// //                 drawError: {
// //                   color: '#b00b00',
// //                   message: 'Line cannot self-intersect!'
// //                 },
// //                 shapeOptions: {
// //                   color: '#3388ff'
// //                 }
// //               },
// //               marker: false,
// //               circlemarker: false,
// //             }}
// //             edit={false}                 // no editing → vertices not draggable
// //           />
// //         </FeatureGroup>
// //         <GeolocationMarker />
// //       </MapContainer>

// //       {/* Info Panel */}
// //       <div
// //         style={{
// //           position: 'absolute',
// //           top: '20px',
// //           left: '20px',
// //           background: 'white',
// //           padding: '15px',
// //           borderRadius: '8px',
// //           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
// //           maxWidth: '320px',
// //           zIndex: 1000,
// //           fontFamily: 'Arial, sans-serif',
// //         }}
// //       >
// //         <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3>

// //         <p>
// //           <strong>Your location:</strong><br />
// //           {userLocation
// //             ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
// //             : 'Detecting...'}
// //         </p>

// //         <p>
// //           <strong>Space:</strong><br />
// //           {space || '—'}
// //         </p>

// //         {lineLength && (
// //           <p>
// //             <strong>Length:</strong><br />
// //             {lineLength}
// //           </p>
// //         )}

// //         <p>
// //           <strong>Perimeter:</strong><br />
// //           {perimeter || '—'}
// //         </p>

// //         <p>
// //           <strong>Distance from X:</strong><br />
// //           {distanceFromX || '—'}
// //         </p>

// //         <p>
// //           <strong>Land type:</strong><br />
// //           {landType || '—'}
// //         </p>

// //         {/* Delete button */}
// //         <button
// //           onClick={handleDelete}
// //           style={{
// //             marginTop: '10px',
// //             padding: '5px 10px',
// //             background: '#f44336',
// //             color: 'white',
// //             border: 'none',
// //             borderRadius: '4px',
// //             cursor: 'pointer',
// //           }}
// //         >
// //           Delete Shape
// //         </button>

// //         <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
// //           <strong>How to draw:</strong><br />
// //           • <strong>Polygon / Rectangle</strong> → Click points, then click the <strong>first point again</strong> to close.<br />
// //           • <strong>Circle</strong> → Click and drag.<br />
// //           • <strong>Polyline</strong> → Click points; double‑click or click the last point to finish.<br />
// //           <strong>Space</strong> = surface area (e.g., rectangle 5×2 = 10 m²)
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LocationFinder;



// // ------------------------------------------------------------------------------------------------



// // import React, { useRef, useEffect, useState } from 'react';
// // import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// // import { EditControl } from 'react-leaflet-draw';
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import 'leaflet-draw/dist/leaflet.draw.css';
// // import 'leaflet-draw';
// // import * as turf from '@turf/turf';
// // // import './style.css';

// // const LocationFinder = () => {
// //   const [space, setSpace] = useState(null);
// //   const [lineLength, setLineLength] = useState(null);
// //   const [perimeter, setPerimeter] = useState(null);
// //   const [landType, setLandType] = useState('');
// //   const [distanceFromX, setDistanceFromX] = useState(null);
// //   const [userLocation, setUserLocation] = useState(null);

// //   const featureGroupRef = useRef(null);
// //   const markerRef = useRef(null);

// //   const locationX = [48.8584, 2.2945]; // Eiffel Tower

// //   useEffect(() => {
// //     if (!navigator.geolocation) return;
// //     navigator.geolocation.getCurrentPosition(
// //       (position) => {
// //         setUserLocation([position.coords.latitude, position.coords.longitude]);
// //       },
// //       (error) => console.error('Geolocation error:', error)
// //     );
// //   }, []);

// //   const processLayer = async (layer) => {
// //     let geoJson = null;
// //     let perimeterM = 0;

// //     try {
// //       if (layer instanceof L.Circle) {
// //         const radius = layer.getRadius();
// //         const areaSqM = Math.PI * radius * radius;
// //         setSpace(areaSqM.toFixed(2) + ' m²');
// //         setLineLength(null);
// //         perimeterM = 2 * Math.PI * radius;

// //         const center = layer.getLatLng();
// //         geoJson = turf.circle([center.lng, center.lat], radius / 1000, { units: 'kilometers' });
// //       } else if (layer instanceof L.Polygon) {
// //         geoJson = layer.toGeoJSON();
// //         const areaSqM = turf.area(geoJson);
// //         setSpace(areaSqM.toFixed(2) + ' m²');
// //         setLineLength(null);
// //         perimeterM = turf.length(geoJson, { units: 'meters' });
// //       } else if (layer instanceof L.Polyline) {
// //         geoJson = layer.toGeoJSON();
// //         const lengthKm = turf.length(geoJson, { units: 'kilometers' });
// //         setSpace(null);
// //         setLineLength(lengthKm.toFixed(2) + ' km');
// //         perimeterM = turf.length(geoJson, { units: 'meters' });
// //       } else {
// //         setSpace('Unsupported shape');
// //         setLineLength(null);
// //         setPerimeter(null);
// //         setDistanceFromX(null);
// //         setLandType('');
// //         return;
// //       }

// //       setPerimeter(perimeterM.toFixed(2) + ' m');

// //       if (geoJson) {
// //         const centroid = turf.centroid(geoJson);
// //         if (centroid?.geometry?.coordinates) {
// //           const from = turf.point([locationX[1], locationX[0]]);
// //           const to = turf.point(centroid.geometry.coordinates);
// //           const distanceKm = turf.distance(from, to, { units: 'kilometers' });
// //           setDistanceFromX(distanceKm.toFixed(2) + ' km');
// //         } else {
// //           setDistanceFromX('Error');
// //         }
// //       } else {
// //         setDistanceFromX(null);
// //       }

// //       if ((layer instanceof L.Circle || layer instanceof L.Polygon) && geoJson) {
// //         const land = await fetchLandType(geoJson);
// //         setLandType(land);
// //       } else {
// //         setLandType('N/A (lines)');
// //       }
// //     } catch (error) {
// //       console.error('Error processing layer:', error);
// //       setDistanceFromX('Error');
// //       setLandType('Error');
// //     }
// //   };

// //   const onCreated = (e) => {
// //     const layer = e.layer;
// //     featureGroupRef.current.clearLayers();
// //     featureGroupRef.current.addLayer(layer);
// //     processLayer(layer);
// //   };

// //   const handleDelete = () => {
// //     if (featureGroupRef.current) {
// //       featureGroupRef.current.clearLayers();
// //       setSpace(null);
// //       setLineLength(null);
// //       setPerimeter(null);
// //       setDistanceFromX(null);
// //       setLandType('');
// //     }
// //   };

// //   const fetchLandType = async (polygonGeoJson) => {
// //     const bbox = turf.bbox(polygonGeoJson);
// //     const query = `
// //       [out:json];
// //       (
// //         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// //         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// //         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// //         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
// //       );
// //       out body;
// //     `;

// //     try {
// //       const response = await fetch('https://overpass-api.de/api/interpreter', {
// //         method: 'POST',
// //         body: query,
// //       });
// //       const data = await response.json();

// //       const typeCount = {};
// //       data.elements.forEach((el) => {
// //         if (el.tags) {
// //           const type = el.tags.landuse || el.tags.natural;
// //           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
// //         }
// //       });

// //       let dominant = 'unknown';
// //       let max = 0;
// //       for (const [type, count] of Object.entries(typeCount)) {
// //         if (count > max) {
// //           max = count;
// //           dominant = type;
// //         }
// //       }
// //       return dominant;
// //     } catch (error) {
// //       console.error('Overpass error:', error);
// //       return 'error fetching data';
// //     }
// //   };

// //   const GeolocationMarker = () => {
// //     const map = useMap();
// //     useEffect(() => {
// //       if (!userLocation) return;
// //       if (markerRef.current) markerRef.current.remove();

// //       const marker = L.marker(userLocation).addTo(map);
// //       marker.bindPopup('You are here');
// //       markerRef.current = marker;
// //       map.setView(userLocation, 13);

// //       return () => {
// //         if (markerRef.current) markerRef.current.remove();
// //       };
// //     }, [userLocation, map]);

// //     return null;
// //   };

// //   return (
// //     <div style={{ position: 'relative' }}>
// //       <MapContainer
// //         center={[48.8566, 2.3522]}
// //         zoom={13}
// //         style={{ height: '600px', width: '100%' }}
// //         doubleClickZoom={false}        // Prevents zoom on double‑click, allows double‑click to finish drawing
// //       >
// //         <TileLayer
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //           attribution="© OpenStreetMap contributors"
// //         />
// //         <FeatureGroup ref={featureGroupRef}>
// //           <EditControl
// //             position="topright"
// //             onCreated={onCreated}
// //             draw={{
// //               rectangle: true,
// //               polygon: {
// //                 // allowIntersection: false,
// //                 allowIntersection: true,
// //                 showArea: true,
// //                 drawError: {
// //                   color: '#b00b00',
// //                   message: 'Shape cannot self-intersect!'
// //                 },
// //                 shapeOptions: {
// //                   color: '#3388ff'
// //                 }
// //               },
// //               circle: true,
// //               polyline: {
// //                 allowIntersection: false,
// //                 drawError: {
// //                   color: '#b00b00',
// //                   message: 'Line cannot self-intersect!'
// //                 },
// //                 shapeOptions: {
// //                   color: '#3388ff'
// //                 }
// //               },
// //               marker: false,
// //               circlemarker: false,
// //             }}
// //             edit={false}   // No editing after creation → vertices not draggable
// //           />
// //         </FeatureGroup>
// //         <GeolocationMarker />
// //       </MapContainer>

// //       {/* Info Panel */}
// //       <div
// //         style={{
// //           position: 'absolute',
// //           top: '20px',
// //           left: '20px',
// //           background: 'white',
// //           padding: '15px',
// //           borderRadius: '8px',
// //           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
// //           maxWidth: '320px',
// //           zIndex: 1000,
// //           fontFamily: 'Arial, sans-serif',
// //         }}
// //       >
// //         <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3>

// //         <p>
// //           <strong>Your location:</strong><br />
// //           {userLocation
// //             ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
// //             : 'Detecting...'}
// //         </p>

// //         <p>
// //           <strong>Space:</strong><br />
// //           {space || '—'}
// //         </p>

// //         {lineLength && (
// //           <p>
// //             <strong>Length:</strong><br />
// //             {lineLength}
// //           </p>
// //         )}

// //         <p>
// //           <strong>Perimeter:</strong><br />
// //           {perimeter || '—'}
// //         </p>

// //         <p>
// //           <strong>Distance from X:</strong><br />
// //           {distanceFromX || '—'}
// //         </p>

// //         <p>
// //           <strong>Land type:</strong><br />
// //           {landType || '—'}
// //         </p>

// //         <button
// //           onClick={handleDelete}
// //           style={{
// //             marginTop: '10px',
// //             padding: '5px 10px',
// //             background: '#f44336',
// //             color: 'white',
// //             border: 'none',
// //             borderRadius: '4px',
// //             cursor: 'pointer',
// //           }}
// //         >
// //           Delete Shape
// //         </button>

// //         <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
// //           <strong>How to draw:</strong><br />
// //           • <strong>Polygon / Rectangle</strong> → Click points, then click the <strong style={{color:'#ff4444'}}>red first point again</strong> to close.<br />
// //           • <strong>Circle</strong> → Click and drag.<br />
// //           • <strong>Polyline</strong> → Click points; <strong>double‑click</strong> or click the last point to finish.<br />
// //           ⚠️ If clicking the point doesn't work, try <strong>double‑clicking</strong> to finish.<br />
// //           <strong>Space</strong> = surface area (e.g., rectangle 5×2 = 10 m²)
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LocationFinder;


// // -----------------------------------------------------------------------------------------------




// import React, { useRef, useEffect, useState } from 'react';
// import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import * as turf from '@turf/turf';

// const LocationFinder = () => {
//   const [space, setSpace] = useState(null);
//   const [lineLength, setLineLength] = useState(null);
//   const [perimeter, setPerimeter] = useState(null);
//   const [landType, setLandType] = useState('');
//   const [distanceFromX, setDistanceFromX] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   // Drawing states
//   const [currentPoints, setCurrentPoints] = useState([]);
//   const [drawingActive, setDrawingActive] = useState(false);

//   const featureGroupRef = useRef(null);
//   const markerRef = useRef(null);
//   const tempLineRef = useRef(null);          // temporary polyline while drawing
//   const currentPointsRef = useRef(currentPoints);
//   const drawingActiveRef = useRef(drawingActive);

//   // Keep refs in sync with state
//   useEffect(() => { currentPointsRef.current = currentPoints; }, [currentPoints]);
//   useEffect(() => { drawingActiveRef.current = drawingActive; }, [drawingActive]);

//   const locationX = [48.8584, 2.2945]; // Eiffel Tower

//   // Get user location
//   useEffect(() => {
//     if (!navigator.geolocation) return;
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation([position.coords.latitude, position.coords.longitude]);
//       },
//       (error) => console.error('Geolocation error:', error)
//     );
//   }, []);

//   // Process any drawn layer (area, perimeter, distance, land type)
//   const processLayer = async (layer) => {
//     let geoJson = null;
//     let perimeterM = 0;

//     try {
//       if (layer instanceof L.Polygon) {
//         geoJson = layer.toGeoJSON();
//         const areaSqM = turf.area(geoJson);
//         setSpace(areaSqM.toFixed(2) + ' m²');
//         setLineLength(null);
//         perimeterM = turf.length(geoJson, { units: 'meters' });
//       } else {
//         setSpace('Unsupported shape');
//         setLineLength(null);
//         setPerimeter(null);
//         setDistanceFromX(null);
//         setLandType('');
//         return;
//       }

//       setPerimeter(perimeterM.toFixed(2) + ' m');

//       if (geoJson) {
//         const centroid = turf.centroid(geoJson);
//         if (centroid?.geometry?.coordinates) {
//           const from = turf.point([locationX[1], locationX[0]]);
//           const to = turf.point(centroid.geometry.coordinates);
//           const distanceKm = turf.distance(from, to, { units: 'kilometers' });
//           setDistanceFromX(distanceKm.toFixed(2) + ' km');
//         } else {
//           setDistanceFromX('Error');
//         }
//       } else {
//         setDistanceFromX(null);
//       }

//       if (layer instanceof L.Polygon && geoJson) {
//         const land = await fetchLandType(geoJson);
//         setLandType(land);
//       } else {
//         setLandType('N/A');
//       }
//     } catch (error) {
//       console.error('Error processing layer:', error);
//       setDistanceFromX('Error');
//       setLandType('Error');
//     }
//   };

//   // Called when a polygon is finished (auto‑closed)
//   const finishShape = (polygon) => {
//     // Remove any temporary line
//     if (tempLineRef.current) {
//       tempLineRef.current.remove();
//       tempLineRef.current = null;
//     }
//     // Add polygon to the feature group (replaces any previous shape)
//     featureGroupRef.current.clearLayers();
//     featureGroupRef.current.addLayer(polygon);
//     // Calculate measurements
//     processLayer(polygon);
//   };

//   // Delete current shape and reset drawing
//   const handleDelete = () => {
//     if (featureGroupRef.current) {
//       featureGroupRef.current.clearLayers();
//     }
//     if (tempLineRef.current) {
//       tempLineRef.current.remove();
//       tempLineRef.current = null;
//     }
//     setCurrentPoints([]);
//     setDrawingActive(false);
//     setSpace(null);
//     setLineLength(null);
//     setPerimeter(null);
//     setDistanceFromX(null);
//     setLandType('');
//   };

//   // Overpass land‑type lookup (unchanged)
//   const fetchLandType = async (polygonGeoJson) => {
//     const bbox = turf.bbox(polygonGeoJson);
//     const query = `
//       [out:json];
//       (
//         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//       );
//       out body;
//     `;

//     try {
//       const response = await fetch('https://overpass-api.de/api/interpreter', {
//         method: 'POST',
//         body: query,
//       });
//       const data = await response.json();

//       const typeCount = {};
//       data.elements.forEach((el) => {
//         if (el.tags) {
//           const type = el.tags.landuse || el.tags.natural;
//           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
//         }
//       });

//       let dominant = 'unknown';
//       let max = 0;
//       for (const [type, count] of Object.entries(typeCount)) {
//         if (count > max) {
//           max = count;
//           dominant = type;
//         }
//       }
//       return dominant;
//     } catch (error) {
//       console.error('Overpass error:', error);
//       return 'error fetching data';
//     }
//   };

//   // Component that handles map clicks for drawing
//   const DrawingHandler = () => {
//     const map = useMap();
//     const thresholdMeters = 10; // auto‑close when within 10 m of first point

//     useEffect(() => {
//       const handleMapClick = (e) => {
//         const latlng = e.latlng;

//         // If not drawing, start a new polygon
//         if (!drawingActiveRef.current) {
//           // Remove any existing shape
//           if (featureGroupRef.current) {
//             featureGroupRef.current.clearLayers();
//           }
//           // Start fresh
//           setCurrentPoints([latlng]);
//           setDrawingActive(true);
//           // Create a temporary polyline with the first point
//           if (tempLineRef.current) {
//             tempLineRef.current.remove();
//           }
//           tempLineRef.current = L.polyline([latlng], { color: '#3388ff', weight: 2 }).addTo(map);
//           return;
//         }

//         // Drawing is active – add the new point
//         const newPoints = [...currentPointsRef.current, latlng];
//         setCurrentPoints(newPoints);

//         // Update the temporary line
//         if (tempLineRef.current) {
//           tempLineRef.current.setLatLngs(newPoints);
//         }

//         // Check if this point is near the first point
//         const firstPoint = newPoints[0];
//         const distance = map.distance(latlng, firstPoint);
//         if (distance < thresholdMeters) {
//           // Auto‑close the polygon
//           const polygon = L.polygon(newPoints, {
//             color: '#3388ff',
//             fillColor: '#3388ff',
//             fillOpacity: 0.4,
//             weight: 2
//           });
//           finishShape(polygon);
//           // Reset drawing state
//           setCurrentPoints([]);
//           setDrawingActive(false);
//         }
//       };

//       map.on('click', handleMapClick);
//       return () => {
//         map.off('click', handleMapClick);
//       };
//     }, [map]); // No dependencies – we always use the latest refs inside the handler

//     return null;
//   };

//   // Marker for user location (unchanged)
//   const GeolocationMarker = () => {
//     const map = useMap();
//     useEffect(() => {
//       if (!userLocation) return;
//       if (markerRef.current) markerRef.current.remove();

//       const marker = L.marker(userLocation).addTo(map);
//       marker.bindPopup('You are here');
//       markerRef.current = marker;
//       map.setView(userLocation, 13);

//       return () => {
//         if (markerRef.current) markerRef.current.remove();
//       };
//     }, [userLocation, map]);

//     return null;
//   };

//   return (
//     <div style={{ position: 'relative' }}>
//       <MapContainer
//         center={[48.8566, 2.3522]}
//         zoom={13}
//         style={{ height: '600px', width: '100%' }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="© OpenStreetMap contributors"
//         />
//         <FeatureGroup ref={featureGroupRef} />
//         <DrawingHandler />
//         <GeolocationMarker />
//       </MapContainer>

//       {/* Info Panel */}
//       <div
//         style={{
//           position: 'absolute',
//           top: '20px',
//           left: '20px',
//           background: 'white',
//           padding: '15px',
//           borderRadius: '8px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
//           maxWidth: '320px',
//           zIndex: 1000,
//           fontFamily: 'Arial, sans-serif',
//         }}
//       >
//         <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3>

//         <p>
//           <strong>Your location:</strong><br />
//           {userLocation
//             ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
//             : 'Detecting...'}
//         </p>

//         <p>
//           <strong>Area:</strong><br />
//           {space || '—'}
//         </p>

//         <p>
//           <strong>Perimeter:</strong><br />
//           {perimeter || '—'}
//         </p>

//         <p>
//           <strong>Distance from X:</strong><br />
//           {distanceFromX || '—'}
//         </p>

//         <p>
//           <strong>Land type:</strong><br />
//           {landType || '—'}
//         </p>

//         <button
//           onClick={handleDelete}
//           style={{
//             marginTop: '10px',
//             padding: '5px 10px',
//             background: '#f44336',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//           }}
//         >
//           Delete Shape
//         </button>

//         <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
//           <strong>How to draw:</strong><br />
//           • Click on the map to place the first point.<br />
//           • Continue clicking to add more points.<br />
//           • Click <strong>near the first point</strong> (within ~10 m) to <strong>auto‑close</strong> the polygon.<br />
//           • The shape is automatically filled and measured.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LocationFinder;

// -------------------------------------------------------------------------------------------------------

// import React, { useRef, useEffect, useState } from 'react';
// import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import * as turf from '@turf/turf';

// const LocationFinder = () => {
//   const [space, setSpace] = useState(null);
//   const [lineLength, setLineLength] = useState(null);
//   const [perimeter, setPerimeter] = useState(null);
//   const [landType, setLandType] = useState('');
//   const [distanceFromX, setDistanceFromX] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   // Drawing states
//   const [currentPoints, setCurrentPoints] = useState([]);
//   const [drawingActive, setDrawingActive] = useState(false);

//   const featureGroupRef = useRef(null);
//   const markerRef = useRef(null);
//   const tempLineRef = useRef(null);          // temporary polyline while drawing
//   const currentPointsRef = useRef(currentPoints);
//   const drawingActiveRef = useRef(drawingActive);

//   // Keep refs in sync with state
//   useEffect(() => { currentPointsRef.current = currentPoints; }, [currentPoints]);
//   useEffect(() => { drawingActiveRef.current = drawingActive; }, [drawingActive]);

//   const locationX = [48.8584, 2.2945]; // Eiffel Tower

//   // Get user location
//   useEffect(() => {
//     if (!navigator.geolocation) return;
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation([position.coords.latitude, position.coords.longitude]);
//       },
//       (error) => console.error('Geolocation error:', error)
//     );
//   }, []);

//   // Process any drawn layer (area, perimeter, distance, land type)
//   const processLayer = async (layer) => {
//     let geoJson = null;
//     let perimeterM = 0;

//     try {
//       if (layer instanceof L.Polygon) {
//         geoJson = layer.toGeoJSON();
//         const areaSqM = turf.area(geoJson);
//         setSpace(areaSqM.toFixed(2) + ' m²');
//         setLineLength(null);
//         perimeterM = turf.length(geoJson, { units: 'meters' });
//       } else {
//         setSpace('Unsupported shape');
//         setLineLength(null);
//         setPerimeter(null);
//         setDistanceFromX(null);
//         setLandType('');
//         return;
//       }

//       setPerimeter(perimeterM.toFixed(2) + ' m');

//       if (geoJson) {
//         const centroid = turf.centroid(geoJson);
//         if (centroid?.geometry?.coordinates) {
//           const from = turf.point([locationX[1], locationX[0]]);
//           const to = turf.point(centroid.geometry.coordinates);
//           const distanceKm = turf.distance(from, to, { units: 'kilometers' });
//           setDistanceFromX(distanceKm.toFixed(2) + ' km');
//         } else {
//           setDistanceFromX('Error');
//         }
//       } else {
//         setDistanceFromX(null);
//       }

//       if (layer instanceof L.Polygon && geoJson) {
//         const land = await fetchLandType(geoJson);
//         setLandType(land);
//       } else {
//         setLandType('N/A');
//       }
//     } catch (error) {
//       console.error('Error processing layer:', error);
//       setDistanceFromX('Error');
//       setLandType('Error');
//     }
//   };

//   // Called when a polygon is finished (auto‑closed or by button)
//   const finishShape = (polygon) => {
//     // Remove any temporary line
//     if (tempLineRef.current) {
//       tempLineRef.current.remove();
//       tempLineRef.current = null;
//     }
//     // Add polygon to the feature group (replaces any previous shape)
//     featureGroupRef.current.clearLayers();
//     featureGroupRef.current.addLayer(polygon);
//     // Calculate measurements
//     processLayer(polygon);
//   };

//   // Finish drawing manually (button)
//   const handleFinishDrawing = () => {
//     if (currentPoints.length < 3) {
//       alert('You need at least 3 points to create a polygon.');
//       return;
//     }
//     // Create a polygon from the current points (closes automatically)
//     const polygon = L.polygon(currentPoints, {
//       color: '#3388ff',
//       fillColor: '#3388ff',
//       fillOpacity: 0.4,
//       weight: 2
//     });
//     finishShape(polygon);
//     // Reset drawing state
//     setCurrentPoints([]);
//     setDrawingActive(false);
//   };

//   // Cancel current drawing (button)
//   const handleCancelDrawing = () => {
//     if (tempLineRef.current) {
//       tempLineRef.current.remove();
//       tempLineRef.current = null;
//     }
//     setCurrentPoints([]);
//     setDrawingActive(false);
//     // Do NOT clear the featureGroup – keep any previously finished shape
//   };

//   // Delete the finished shape and reset everything
//   const handleDelete = () => {
//     if (featureGroupRef.current) {
//       featureGroupRef.current.clearLayers();
//     }
//     if (tempLineRef.current) {
//       tempLineRef.current.remove();
//       tempLineRef.current = null;
//     }
//     setCurrentPoints([]);
//     setDrawingActive(false);
//     setSpace(null);
//     setLineLength(null);
//     setPerimeter(null);
//     setDistanceFromX(null);
//     setLandType('');
//   };

//   // Overpass land‑type lookup (unchanged)
//   const fetchLandType = async (polygonGeoJson) => {
//     const bbox = turf.bbox(polygonGeoJson);
//     const query = `
//       [out:json];
//       (
//         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//       );
//       out body;
//     `;

//     try {
//       const response = await fetch('https://overpass-api.de/api/interpreter', {
//         method: 'POST',
//         body: query,
//       });
//       const data = await response.json();

//       const typeCount = {};
//       data.elements.forEach((el) => {
//         if (el.tags) {
//           const type = el.tags.landuse || el.tags.natural;
//           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
//         }
//       });

//       let dominant = 'unknown';
//       let max = 0;
//       for (const [type, count] of Object.entries(typeCount)) {
//         if (count > max) {
//           max = count;
//           dominant = type;
//         }
//       }
//       return dominant;
//     } catch (error) {
//       console.error('Overpass error:', error);
//       return 'error fetching data';
//     }
//   };

//   // Component that handles map clicks for drawing
//   const DrawingHandler = () => {
//     const map = useMap();
//     const thresholdMeters = 10; // auto‑close when within 10 m of first point

//     useEffect(() => {
//       const handleMapClick = (e) => {
//         const latlng = e.latlng;

//         // If not drawing, start a new polygon
//         if (!drawingActiveRef.current) {
//           // Remove any existing shape? No, we keep it, but we start a new drawing.
//           // But we should not clear the featureGroup – the user might want to keep the old shape.
//           // So we just start a new temporary line without removing the finished shape.
//           setCurrentPoints([latlng]);
//           setDrawingActive(true);
//           // Create a temporary polyline with the first point
//           if (tempLineRef.current) {
//             tempLineRef.current.remove();
//           }
//           tempLineRef.current = L.polyline([latlng], { color: '#3388ff', weight: 2 }).addTo(map);
//           return;
//         }

//         // Drawing is active – add the new point
//         const newPoints = [...currentPointsRef.current, latlng];
//         setCurrentPoints(newPoints);

//         // Update the temporary line
//         if (tempLineRef.current) {
//           tempLineRef.current.setLatLngs(newPoints);
//         }

//         // Check if this point is near the first point
//         const firstPoint = newPoints[0];
//         const distance = map.distance(latlng, firstPoint);
//         if (distance < thresholdMeters) {
//           // Auto‑close the polygon
//           const polygon = L.polygon(newPoints, {
//             color: '#3388ff',
//             fillColor: '#3388ff',
//             fillOpacity: 0.4,
//             weight: 2
//           });
//           finishShape(polygon);
//           // Reset drawing state
//           setCurrentPoints([]);
//           setDrawingActive(false);
//         }
//       };

//       map.on('click', handleMapClick);
//       return () => {
//         map.off('click', handleMapClick);
//       };
//     }, [map]);

//     return null;
//   };

//   // Marker for user location (unchanged)
//   const GeolocationMarker = () => {
//     const map = useMap();
//     useEffect(() => {
//       if (!userLocation) return;
//       if (markerRef.current) markerRef.current.remove();

//       const marker = L.marker(userLocation).addTo(map);
//       marker.bindPopup('You are here');
//       markerRef.current = marker;
//       map.setView(userLocation, 13);

//       return () => {
//         if (markerRef.current) markerRef.current.remove();
//       };
//     }, [userLocation, map]);

//     return null;
//   };

//   return (
//     <div style={{ position: 'relative' }}>
//       <MapContainer
//         center={[48.8566, 2.3522]}
//         zoom={13}
//         style={{ height: '600px', width: '100%' }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="© OpenStreetMap contributors"
//         />
//         <FeatureGroup ref={featureGroupRef} />
//         <DrawingHandler />
//         <GeolocationMarker />
//       </MapContainer>

//       {/* Info Panel */}
//       <div
//         style={{
//           position: 'absolute',
//           top: '20px',
//           left: '20px',
//           background: 'white',
//           padding: '15px',
//           borderRadius: '8px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
//           maxWidth: '320px',
//           zIndex: 1000,
//           fontFamily: 'Arial, sans-serif',
//         }}
//       >
//         <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3>

//         <p>
//           <strong>Your location:</strong><br />
//           {userLocation
//             ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
//             : 'Detecting...'}
//         </p>

//         <p>
//           <strong>Area:</strong><br />
//           {space || '—'}
//         </p>

//         <p>
//           <strong>Perimeter:</strong><br />
//           {perimeter || '—'}
//         </p>

//         <p>
//           <strong>Distance from X:</strong><br />
//           {distanceFromX || '—'}
//         </p>

//         <p>
//           <strong>Land type:</strong><br />
//           {landType || '—'}
//         </p>

//         {/* Drawing action buttons – only show when drawing */}
//         {drawingActive && (
//           <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
//             <button
//               onClick={handleFinishDrawing}
//               style={{
//                 flex: 1,
//                 padding: '5px 10px',
//                 background: '#4caf50',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//               }}
//             >
//               Finish
//             </button>
//             <button
//               onClick={handleCancelDrawing}
//               style={{
//                 flex: 1,
//                 padding: '5px 10px',
//                 background: '#ff9800',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         )}

//         <button
//           onClick={handleDelete}
//           style={{
//             marginTop: '10px',
//             padding: '5px 10px',
//             background: '#f44336',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             width: '100%',
//           }}
//         >
//           Delete Shape
//         </button>

//         <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
//           <strong>How to draw:</strong><br />
//           • Click on the map to place the first point.<br />
//           • Continue clicking to add more points.<br />
//           • Click <strong>near the first point</strong> (within ~10 m) to auto‑close.<br />
//           • Or use <strong>Finish</strong> button to close manually (needs at least 3 points).<br />
//           • <strong>Cancel</strong> aborts the current drawing without deleting the finished shape.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LocationFinder;


// -------------------------------------------------------------------------------


// import React, { useRef, useEffect, useState } from 'react';
// import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import * as turf from '@turf/turf';

// const LocationFinder = () => {
//   const [space, setSpace] = useState(null);
//   const [lineLength, setLineLength] = useState(null);
//   const [perimeter, setPerimeter] = useState(null);
//   const [landType, setLandType] = useState('');
//   const [distanceFromX, setDistanceFromX] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   // Drawing states
//   const [currentPoints, setCurrentPoints] = useState([]);
//   const [drawingActive, setDrawingActive] = useState(false);

//   const featureGroupRef = useRef(null);
//   const markerRef = useRef(null);
//   const tempLineRef = useRef(null);          // temporary polyline while drawing
//   const currentPointsRef = useRef(currentPoints);
//   const drawingActiveRef = useRef(drawingActive);

//   // Keep refs in sync with state
//   useEffect(() => { currentPointsRef.current = currentPoints; }, [currentPoints]);
//   useEffect(() => { drawingActiveRef.current = drawingActive; }, [drawingActive]);

//   const locationX = [48.8584, 2.2945]; // Eiffel Tower

//   // Get user location
//   useEffect(() => {
//     if (!navigator.geolocation) return;
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation([position.coords.latitude, position.coords.longitude]);
//       },
//       (error) => console.error('Geolocation error:', error)
//     );
//   }, []);

//   // Process any drawn layer (area, perimeter, distance, land type)
//   const processLayer = async (layer) => {
//     let geoJson = null;
//     let perimeterM = 0;

//     try {
//       if (layer instanceof L.Polygon) {
//         geoJson = layer.toGeoJSON();
//         const areaSqM = turf.area(geoJson);
//         setSpace(areaSqM.toFixed(2) + ' m²');
//         setLineLength(null);
//         perimeterM = turf.length(geoJson, { units: 'meters' });
//       } else {
//         setSpace('Unsupported shape');
//         setLineLength(null);
//         setPerimeter(null);
//         setDistanceFromX(null);
//         setLandType('');
//         return;
//       }

//       setPerimeter(perimeterM.toFixed(2) + ' m');

//       if (geoJson) {
//         const centroid = turf.centroid(geoJson);
//         if (centroid?.geometry?.coordinates) {
//           const from = turf.point([locationX[1], locationX[0]]);
//           const to = turf.point(centroid.geometry.coordinates);
//           const distanceKm = turf.distance(from, to, { units: 'kilometers' });
//           setDistanceFromX(distanceKm.toFixed(2) + ' km');
//         } else {
//           setDistanceFromX('Error');
//         }
//       } else {
//         setDistanceFromX(null);
//       }

//       if (layer instanceof L.Polygon && geoJson) {
//         const land = await fetchLandType(geoJson);
//         setLandType(land);
//       } else {
//         setLandType('N/A');
//       }
//     } catch (error) {
//       console.error('Error processing layer:', error);
//       setDistanceFromX('Error');
//       setLandType('Error');
//     }
//   };

//   // Called when a polygon is finished (auto‑closed or by button)
//   const finishShape = (polygon) => {
//     // Remove any temporary line
//     if (tempLineRef.current) {
//       tempLineRef.current.remove();
//       tempLineRef.current = null;
//     }
//     // Add polygon to the feature group (replaces any previous shape)
//     featureGroupRef.current.clearLayers();
//     featureGroupRef.current.addLayer(polygon);
//     // Calculate measurements
//     processLayer(polygon);
//   };

//   // Finish drawing manually (button)
//   const handleFinishDrawing = () => {
//     if (currentPoints.length < 3) {
//       alert('You need at least 3 points to create a polygon.');
//       return;
//     }
//     // Create a polygon from the current points (closes automatically)
//     const polygon = L.polygon(currentPoints, {
//       color: '#3388ff',
//       weight: 3,                 // thicker outline
//       fillColor: '#3388ff',
//       fillOpacity: 0.3,           // slightly more transparent
//     });
//     finishShape(polygon);
//     // Reset drawing state
//     setCurrentPoints([]);
//     setDrawingActive(false);
//   };

//   // Cancel current drawing (button)
//   const handleCancelDrawing = () => {
//     if (tempLineRef.current) {
//       tempLineRef.current.remove();
//       tempLineRef.current = null;
//     }
//     setCurrentPoints([]);
//     setDrawingActive(false);
//     // Do NOT clear the featureGroup – keep any previously finished shape
//   };

//   // Delete the finished shape and reset everything
//   const handleDelete = () => {
//     if (featureGroupRef.current) {
//       featureGroupRef.current.clearLayers();
//     }
//     if (tempLineRef.current) {
//       tempLineRef.current.remove();
//       tempLineRef.current = null;
//     }
//     setCurrentPoints([]);
//     setDrawingActive(false);
//     setSpace(null);
//     setLineLength(null);
//     setPerimeter(null);
//     setDistanceFromX(null);
//     setLandType('');
//   };

//   // Overpass land‑type lookup (unchanged)
//   const fetchLandType = async (polygonGeoJson) => {
//     const bbox = turf.bbox(polygonGeoJson);
//     const query = `
//       [out:json];
//       (
//         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//       );
//       out body;
//     `;

//     try {
//       const response = await fetch('https://overpass-api.de/api/interpreter', {
//         method: 'POST',
//         body: query,
//       });
//       const data = await response.json();

//       const typeCount = {};
//       data.elements.forEach((el) => {
//         if (el.tags) {
//           const type = el.tags.landuse || el.tags.natural;
//           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
//         }
//       });

//       let dominant = 'unknown';
//       let max = 0;
//       for (const [type, count] of Object.entries(typeCount)) {
//         if (count > max) {
//           max = count;
//           dominant = type;
//         }
//       }
//       return dominant;
//     } catch (error) {
//       console.error('Overpass error:', error);
//       return 'error fetching data';
//     }
//   };

//   // Component that handles map clicks for drawing
//   const DrawingHandler = () => {
//     const map = useMap();
//     const thresholdMeters = 10; // auto‑close when within 10 m of first point

//     useEffect(() => {
//       const handleMapClick = (e) => {
//         const latlng = e.latlng;

//         // If not drawing, start a new polygon
//         if (!drawingActiveRef.current) {
//           setCurrentPoints([latlng]);
//           setDrawingActive(true);
//           // Create a temporary polyline with the first point (thick dashed line)
//           if (tempLineRef.current) {
//             tempLineRef.current.remove();
//           }
//           tempLineRef.current = L.polyline([latlng], {
//             color: '#ffaa00',
//             weight: 4,
//             dashArray: '5, 5',
//             opacity: 0.9
//           }).addTo(map);
//           return;
//         }

//         // Drawing is active – add the new point
//         const newPoints = [...currentPointsRef.current, latlng];
//         setCurrentPoints(newPoints);

//         // Update the temporary line
//         if (tempLineRef.current) {
//           tempLineRef.current.setLatLngs(newPoints);
//         }

//         // Check if this point is near the first point
//         const firstPoint = newPoints[0];
//         const distance = map.distance(latlng, firstPoint);
//         if (distance < thresholdMeters) {
//           // Auto‑close the polygon
//           const polygon = L.polygon(newPoints, {
//             color: '#3388ff',
//             weight: 3,
//             fillColor: '#3388ff',
//             fillOpacity: 0.3,
//           });
//           finishShape(polygon);
//           // Reset drawing state
//           setCurrentPoints([]);
//           setDrawingActive(false);
//         }
//       };

//       map.on('click', handleMapClick);
//       return () => {
//         map.off('click', handleMapClick);
//       };
//     }, [map]);

//     return null;
//   };

//   // Marker for user location (unchanged)
//   const GeolocationMarker = () => {
//     const map = useMap();
//     useEffect(() => {
//       if (!userLocation) return;
//       if (markerRef.current) markerRef.current.remove();

//       const marker = L.marker(userLocation).addTo(map);
//       marker.bindPopup('You are here');
//       markerRef.current = marker;
//       map.setView(userLocation, 13);

//       return () => {
//         if (markerRef.current) markerRef.current.remove();
//       };
//     }, [userLocation, map]);

//     return null;
//   };

//   return (
//     <div style={{ position: 'relative' }}>
//       {/* Map container with dynamic cursor */}
//       <MapContainer
//         center={[48.8566, 2.3522]}
//         zoom={13}
//         style={{
//           height: '600px',
//           width: '100%',
//           cursor: drawingActive ? 'crosshair' : 'grab'  // pointer changes when drawing
//         }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="© OpenStreetMap contributors"
//         />
//         <FeatureGroup ref={featureGroupRef} />
//         <DrawingHandler />
//         <GeolocationMarker />
//       </MapContainer>

//       {/* Info Panel */}
//       <div
//         style={{
//           position: 'absolute',
//           top: '20px',
//           left: '20px',
//           background: 'white',
//           padding: '15px',
//           borderRadius: '8px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
//           maxWidth: '320px',
//           zIndex: 1000,
//           fontFamily: 'Arial, sans-serif',
//         }}
//       >
//         <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3>

//         <p>
//           <strong>Your location:</strong><br />
//           {userLocation
//             ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
//             : 'Detecting...'}
//         </p>

//         <p>
//           <strong>Area:</strong><br />
//           {space || '—'}
//         </p>

//         <p>
//           <strong>Perimeter:</strong><br />
//           {perimeter || '—'}
//         </p>

//         <p>
//           <strong>Distance from X:</strong><br />
//           {distanceFromX || '—'}
//         </p>

//         <p>
//           <strong>Land type:</strong><br />
//           {landType || '—'}
//         </p>

//         {/* Drawing action buttons – only show when drawing */}
//         {drawingActive && (
//           <>
//             <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
//               Points placed: {currentPoints.length}
//             </div>
//             <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
//               <button
//                 onClick={handleFinishDrawing}
//                 disabled={currentPoints.length < 3}
//                 style={{
//                   flex: 1,
//                   padding: '5px 10px',
//                   background: currentPoints.length >= 3 ? '#4caf50' : '#ccc',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: currentPoints.length >= 3 ? 'pointer' : 'not-allowed',
//                 }}
//               >
//                 Finish
//               </button>
//               <button
//                 onClick={handleCancelDrawing}
//                 style={{
//                   flex: 1,
//                   padding: '5px 10px',
//                   background: '#ff9800',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </>
//         )}

//         <button
//           onClick={handleDelete}
//           style={{
//             marginTop: '10px',
//             padding: '5px 10px',
//             background: '#f44336',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             width: '100%',
//           }}
//         >
//           Delete Shape
//         </button>

//         <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
//           <strong>How to draw:</strong><br />
//           • Click on the map to place the first point (cursor becomes <strong>crosshair</strong>).<br />
//           • Continue clicking to add more points.<br />
//           • Click <strong>near the first point</strong> (within ~10 m) to auto‑close.<br />
//           • Or use <strong>Finish</strong> button to close manually (needs at least 3 points).<br />
//           • <strong>Cancel</strong> aborts the current drawing without deleting the finished shape.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LocationFinder;


// --------------------------------------------------------------------------------------------------



// import React, { useRef, useEffect, useState } from 'react';
// import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import * as turf from '@turf/turf';

// const LocationFinder = () => {
//   const [space, setSpace] = useState(null);
//   const [lineLength, setLineLength] = useState(null);
//   const [perimeter, setPerimeter] = useState(null);
//   const [landType, setLandType] = useState('');
//   const [distanceFromX, setDistanceFromX] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
  
//   // Drawing states
//   const [drawMode, setDrawMode] = useState(false);         // ON = drawing, OFF = navigating
//   const [shapeType, setShapeType] = useState('polygon');   // 'polygon' or 'line'
//   const [currentPoints, setCurrentPoints] = useState([]);
//   const [drawingActive, setDrawingActive] = useState(false); // true after first point placed

//   const featureGroupRef = useRef(null);
//   const markerRef = useRef(null);
//   const tempLineRef = useRef(null);
//   const currentPointsRef = useRef(currentPoints);
//   const drawingActiveRef = useRef(drawingActive);
//   const shapeTypeRef = useRef(shapeType);

//   // Sync refs
//   useEffect(() => { currentPointsRef.current = currentPoints; }, [currentPoints]);
//   useEffect(() => { drawingActiveRef.current = drawingActive; }, [drawingActive]);
//   useEffect(() => { shapeTypeRef.current = shapeType; }, [shapeType]);

//   const locationX = [48.8584, 2.2945]; // Eiffel Tower

//   // Get user location
//   useEffect(() => {
//     if (!navigator.geolocation) return;
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation([position.coords.latitude, position.coords.longitude]);
//       },
//       (error) => console.error('Geolocation error:', error)
//     );
//   }, []);

//   // Process any drawn layer (area, perimeter, line length, distance from X, land type)
//   const processLayer = async (layer, type) => {
//     let geoJson = null;
//     let perimeterM = 0;

//     try {
//       if (type === 'polygon' && layer instanceof L.Polygon) {
//         geoJson = layer.toGeoJSON();
//         const areaSqM = turf.area(geoJson);
//         setSpace(areaSqM.toFixed(2) + ' m²');
//         setLineLength(null);
//         perimeterM = turf.length(geoJson, { units: 'meters' });
//         setPerimeter(perimeterM.toFixed(2) + ' m');
//       } else if (type === 'line' && layer instanceof L.Polyline) {
//         geoJson = layer.toGeoJSON();
//         const lengthKm = turf.length(geoJson, { units: 'kilometers' });
//         setSpace(null);
//         setLineLength(lengthKm.toFixed(2) + ' km');
//         setPerimeter(null);
//       } else {
//         setSpace('Unsupported shape');
//         setLineLength(null);
//         setPerimeter(null);
//         setDistanceFromX(null);
//         setLandType('');
//         return;
//       }

//       if (geoJson) {
//         const centroid = turf.centroid(geoJson);
//         if (centroid?.geometry?.coordinates) {
//           const from = turf.point([locationX[1], locationX[0]]);
//           const to = turf.point(centroid.geometry.coordinates);
//           const distanceKm = turf.distance(from, to, { units: 'kilometers' });
//           setDistanceFromX(distanceKm.toFixed(2) + ' km');
//         } else {
//           setDistanceFromX('Error');
//         }
//       } else {
//         setDistanceFromX(null);
//       }

//       if (type === 'polygon' && geoJson) {
//         const land = await fetchLandType(geoJson);
//         setLandType(land);
//       } else {
//         setLandType('N/A (lines)');
//       }
//     } catch (error) {
//       console.error('Error processing layer:', error);
//       setDistanceFromX('Error');
//       setLandType('Error');
//     }
//   };

//   // Finish drawing – creates the final layer
//   const finishShape = () => {
//     if (currentPoints.length < (shapeType === 'polygon' ? 3 : 2)) {
//       alert(shapeType === 'polygon' ? 'Need at least 3 points for polygon' : 'Need at least 2 points for line');
//       return;
//     }

//     let layer;
//     if (shapeType === 'polygon') {
//       layer = L.polygon(currentPoints, {
//         color: '#3388ff',
//         weight: 3,
//         fillColor: '#3388ff',
//         fillOpacity: 0.3,
//       });
//     } else {
//       layer = L.polyline(currentPoints, {
//         color: '#3388ff',
//         weight: 3,
//       });
//     }

//     // Remove temporary line
//     if (tempLineRef.current) {
//       tempLineRef.current.remove();
//       tempLineRef.current = null;
//     }
//     // Add to feature group (replaces previous)
//     featureGroupRef.current.clearLayers();
//     featureGroupRef.current.addLayer(layer);
//     processLayer(layer, shapeType);

//     // Reset drawing state
//     setCurrentPoints([]);
//     setDrawingActive(false);
//   };

//   // Cancel current drawing
//   const handleCancelDrawing = () => {
//     if (tempLineRef.current) {
//       tempLineRef.current.remove();
//       tempLineRef.current = null;
//     }
//     setCurrentPoints([]);
//     setDrawingActive(false);
//   };

//   // Delete everything
//   const handleDelete = () => {
//     if (featureGroupRef.current) {
//       featureGroupRef.current.clearLayers();
//     }
//     if (tempLineRef.current) {
//       tempLineRef.current.remove();
//       tempLineRef.current = null;
//     }
//     setCurrentPoints([]);
//     setDrawingActive(false);
//     setSpace(null);
//     setLineLength(null);
//     setPerimeter(null);
//     setDistanceFromX(null);
//     setLandType('');
//   };

//   // Overpass land‑type lookup (unchanged)
//   const fetchLandType = async (polygonGeoJson) => {
//     const bbox = turf.bbox(polygonGeoJson);
//     const query = `
//       [out:json];
//       (
//         way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//         way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//         relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//         relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
//       );
//       out body;
//     `;

//     try {
//       const response = await fetch('https://overpass-api.de/api/interpreter', {
//         method: 'POST',
//         body: query,
//       });
//       const data = await response.json();

//       const typeCount = {};
//       data.elements.forEach((el) => {
//         if (el.tags) {
//           const type = el.tags.landuse || el.tags.natural;
//           if (type) typeCount[type] = (typeCount[type] || 0) + 1;
//         }
//       });

//       let dominant = 'unknown';
//       let max = 0;
//       for (const [type, count] of Object.entries(typeCount)) {
//         if (count > max) {
//           max = count;
//           dominant = type;
//         }
//       }
//       return dominant;
//     } catch (error) {
//       console.error('Overpass error:', error);
//       return 'error fetching data';
//     }
//   };

//   // Component that handles map clicks only when drawMode = true
//   const DrawingHandler = () => {
//     const map = useMap();
//     const thresholdMeters = 10; // auto‑close for polygon

//     useEffect(() => {
//       const handleMapClick = (e) => {
//         // Ignore clicks if drawMode is off
//         if (!drawMode) return;

//         const latlng = e.latlng;

//         // If not currently drawing, start a new shape
//         if (!drawingActiveRef.current) {
//           setCurrentPoints([latlng]);
//           setDrawingActive(true);
//           if (tempLineRef.current) tempLineRef.current.remove();
//           // Temporary line (different style for polygon vs line)
//           const dash = shapeTypeRef.current === 'polygon' ? '5, 5' : null; // solid for line
//           tempLineRef.current = L.polyline([latlng], {
//             color: '#ffaa00',
//             weight: 4,
//             dashArray: dash,
//             opacity: 0.9
//           }).addTo(map);
//           return;
//         }

//         // Drawing active – add point
//         const newPoints = [...currentPointsRef.current, latlng];
//         setCurrentPoints(newPoints);
//         if (tempLineRef.current) {
//           tempLineRef.current.setLatLngs(newPoints);
//         }

//         // Auto‑close only for polygons when near first point
//         if (shapeTypeRef.current === 'polygon') {
//           const firstPoint = newPoints[0];
//           const distance = map.distance(latlng, firstPoint);
//           if (distance < thresholdMeters) {
//             finishShape();
//           }
//         }
//         // For lines, no auto‑close
//       };

//       // Prevent double‑click from adding two points: we ignore double clicks entirely
//       const handleMapDblClick = (e) => {
//         if (drawMode) {
//           // Do nothing – not adding a point, and let the map zoom (if doubleClickZoom enabled)
//           // But we must prevent the click events that would follow? Actually doubleClick fires two clicks before dblclick.
//           // To avoid those two clicks, we can set a flag and ignore subsequent clicks? Too complex.
//           // Simpler: disable doubleClickZoom while drawing? Not ideal.
//           // Alternative: use a timer to ignore clicks that are part of a double-click.
//           // For simplicity, we'll just disable doubleClickZoom when drawMode is true,
//           // and re-enable when false. That way double-click does nothing (doesn't zoom, doesn't add points).
//           // We'll handle that outside this effect.
//         }
//       };

//       map.on('click', handleMapClick);
//       map.on('dblclick', handleMapDblClick);
//       return () => {
//         map.off('click', handleMapClick);
//         map.off('dblclick', handleMapDblClick);
//       };
//     }, [map, drawMode]); // re-run when drawMode changes

//     return null;
//   };

//   // Control double-click zoom based on drawMode
//   const DoubleClickControl = () => {
//     const map = useMap();
//     useEffect(() => {
//       if (drawMode) {
//         map.doubleClickZoom.disable();
//       } else {
//         map.doubleClickZoom.enable();
//       }
//     }, [map, drawMode]);
//     return null;
//   };

//   // Marker for user location
//   const GeolocationMarker = () => {
//     const map = useMap();
//     useEffect(() => {
//       if (!userLocation) return;
//       if (markerRef.current) markerRef.current.remove();

//       const marker = L.marker(userLocation).addTo(map);
//       marker.bindPopup('You are here');
//       markerRef.current = marker;
//       map.setView(userLocation, 13);

//       return () => {
//         if (markerRef.current) markerRef.current.remove();
//       };
//     }, [userLocation, map]);

//     return null;
//   };

//   return (
//     <div style={{ position: 'relative' }}>
//       {/* Map container with dynamic cursor */}
//       <MapContainer
//         center={[48.8566, 2.3522]}
//         zoom={130}
//         style={{
//           height: '600px',
//           width: '100%',
//           cursor: drawMode ? 'crosshair' : 'grab'
//         }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="© OpenStreetMap contributors"
//         />
//         <FeatureGroup ref={featureGroupRef} />
//         <DrawingHandler />
//         <DoubleClickControl />
//         <GeolocationMarker />
//       </MapContainer>

//       {/* Control Panel */}
//       <div
//         style={{
//           position: 'absolute',
//           top: '20px',
//           left: '20px',
//           background: 'white',
//           padding: '15px',
//           borderRadius: '8px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
//           maxWidth: '320px',
//           zIndex: 1000,
//           fontFamily: 'Arial, sans-serif',
//         }}
//       >
//         <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3>

//         <p>
//           <strong>Your location:</strong><br />
//           {userLocation
//             ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
//             : 'Detecting...'}
//         </p>

//         <p>
//           <strong>Area:</strong><br />
//           {space || '—'}
//         </p>

//         {lineLength && (
//           <p>
//             <strong>Length:</strong><br />
//             {lineLength}
//           </p>
//         )}

//         <p>
//           <strong>Perimeter:</strong><br />
//           {perimeter || '—'}
//         </p>

//         <p>
//           <strong>Distance from X:</strong><br />
//           {distanceFromX || '—'}
//         </p>

//         <p>
//           <strong>Land type:</strong><br />
//           {landType || '—'}
//         </p>

//         {/* Draw mode toggle */}
//         <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <label style={{ fontWeight: 'bold' }}>Draw mode:</label>
//           <button
//             onClick={() => setDrawMode(!drawMode)}
//             style={{
//               padding: '5px 12px',
//               background: drawMode ? '#4caf50' : '#f44336',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontWeight: 'bold'
//             }}
//           >
//             {drawMode ? 'ON' : 'OFF'}
//           </button>
//         </div>

//         {/* Shape type selector (only when draw mode is on) */}
//         {drawMode && (
//           <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
//             <button
//               onClick={() => setShapeType('polygon')}
//               style={{
//                 flex: 1,
//                 padding: '5px',
//                 background: shapeType === 'polygon' ? '#3388ff' : '#e0e0e0',
//                 color: shapeType === 'polygon' ? 'white' : 'black',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer'
//               }}
//             >
//               Polygon
//             </button>
//             <button
//               onClick={() => setShapeType('line')}
//               style={{
//                 flex: 1,
//                 padding: '5px',
//                 background: shapeType === 'line' ? '#3388ff' : '#e0e0e0',
//                 color: shapeType === 'line' ? 'white' : 'black',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer'
//               }}
//             >
//               Line
//             </button>
//           </div>
//         )}

//         {/* Drawing controls (visible only when actively drawing) */}
//         {drawingActive && (
//           <>
//             <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
//               Points: {currentPoints.length}
//             </div>
//             <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
//               <button
//                 onClick={finishShape}
//                 disabled={currentPoints.length < (shapeType === 'polygon' ? 3 : 2)}
//                 style={{
//                   flex: 1,
//                   padding: '5px 10px',
//                   background: currentPoints.length >= (shapeType === 'polygon' ? 3 : 2) ? '#4caf50' : '#ccc',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: currentPoints.length >= (shapeType === 'polygon' ? 3 : 2) ? 'pointer' : 'not-allowed',
//                 }}
//               >
//                 Finish
//               </button>
//               <button
//                 onClick={handleCancelDrawing}
//                 style={{
//                   flex: 1,
//                   padding: '5px 10px',
//                   background: '#ff9800',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </>
//         )}

//         <button
//           onClick={handleDelete}
//           style={{
//             marginTop: '10px',
//             padding: '5px 10px',
//             background: '#f44336',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             width: '100%',
//           }}
//         >
//           Delete Shape
//         </button>

//         <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
//           <strong>How to use:</strong><br />
//           • Toggle <strong>Draw mode ON</strong> to start drawing.<br />
//           • Choose <strong>Polygon</strong> (area) or <strong>Line</strong> (length).<br />
//           • Click on map to place points. For polygons, click near first point to auto‑close.<br />
//           • Use <strong>Finish</strong> to complete, <strong>Cancel</strong> to abort.<br />
//           • Turn <strong>Draw mode OFF</strong> to pan/zoom normally (double‑click zoom works).
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LocationFinder;


// --------------------------------------------------------------------------------------------


import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import './style.css'

const LocationFinder = () => {
  const [space, setSpace] = useState(null);
  const [lineLength, setLineLength] = useState(null);
  const [perimeter, setPerimeter] = useState(null);
  const [landType, setLandType] = useState('');
  const [distanceFromX, setDistanceFromX] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  
  // Drawing states
  const [drawMode, setDrawMode] = useState(true);         // ON = drawing, OFF = navigating
  const [shapeType, setShapeType] = useState('polygon');   // 'polygon' or 'line'
  const [currentPoints, setCurrentPoints] = useState([]);
  const [drawingActive, setDrawingActive] = useState(false); // true after first point placed

  const featureGroupRef = useRef(null);
  const markerRef = useRef(null);
  const tempLineRef = useRef(null);
  const currentPointsRef = useRef(currentPoints);
  const drawingActiveRef = useRef(drawingActive);
  const shapeTypeRef = useRef(shapeType);
  const hasCenteredRef = useRef(false); // prevent re‑centering

  // Sync refs
  useEffect(() => { currentPointsRef.current = currentPoints; }, [currentPoints]);
  useEffect(() => { drawingActiveRef.current = drawingActive; }, [drawingActive]);
  useEffect(() => { shapeTypeRef.current = shapeType; }, [shapeType]);

  const locationX = [48.8584, 2.2945]; // Eiffel Tower

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => console.error('Geolocation error:', error)
    );
  }, []);

  // Process any drawn layer (area, perimeter, line length, distance from X, land type)
  const processLayer = async (layer, type) => {
    let geoJson = null;
    let perimeterM = 0;

    try {
      if (type === 'polygon' && layer instanceof L.Polygon) {
        geoJson = layer.toGeoJSON();
        const areaSqM = turf.area(geoJson);
        setSpace(areaSqM.toFixed(2) + ' m²');
        setLineLength(null);
        perimeterM = turf.length(geoJson, { units: 'meters' });
        setPerimeter(perimeterM.toFixed(2) + ' m');
      } else if (type === 'line' && layer instanceof L.Polyline) {
        geoJson = layer.toGeoJSON();
        const lengthKm = turf.length(geoJson, { units: 'kilometers' });
        setSpace(null);
        setLineLength(lengthKm.toFixed(2) + ' km');
        setPerimeter(null);
      } else {
        setSpace('Unsupported shape');
        setLineLength(null);
        setPerimeter(null);
        setDistanceFromX(null);
        setLandType('');
        return;
      }

      if (geoJson) {
        const centroid = turf.centroid(geoJson);
        if (centroid?.geometry?.coordinates) {
          const from = turf.point([locationX[1], locationX[0]]);
          const to = turf.point(centroid.geometry.coordinates);
          const distanceKm = turf.distance(from, to, { units: 'kilometers' });
          setDistanceFromX(distanceKm.toFixed(2) + ' km');
        } else {
          setDistanceFromX('Error');
        }
      } else {
        setDistanceFromX(null);
      }

      if (type === 'polygon' && geoJson) {
        const land = await fetchLandType(geoJson);
        setLandType(land);
      } else {
        setLandType('N/A (lines)');
      }
    } catch (error) {
      console.error('Error processing layer:', error);
      setDistanceFromX('Error');
      setLandType('Error');
    }
  };

  // Finish drawing – creates the final layer
  const finishShape = () => {
    if (currentPoints.length < (shapeType === 'polygon' ? 3 : 2)) {
      alert(shapeType === 'polygon' ? 'Need at least 3 points for polygon' : 'Need at least 2 points for line');
      return;
    }

    let layer;
    if (shapeType === 'polygon') {
      layer = L.polygon(currentPoints, {
        color: '#3388ff',
        weight: 3,
        fillColor: '#3388ff',
        fillOpacity: 0.3,
      });
    } else {
      layer = L.polyline(currentPoints, {
        color: '#3388ff',
        weight: 3,
      });
    }

    // Remove temporary line
    if (tempLineRef.current) {
      tempLineRef.current.remove();
      tempLineRef.current = null;
    }
    // Add to feature group (replaces previous)
    featureGroupRef.current.clearLayers();
    featureGroupRef.current.addLayer(layer);
    processLayer(layer, shapeType);

    // Reset drawing state
    setCurrentPoints([]);
    setDrawingActive(false);
  };

  // Cancel current drawing
  const handleCancelDrawing = () => {
    if (tempLineRef.current) {
      tempLineRef.current.remove();
      tempLineRef.current = null;
    }
    setCurrentPoints([]);
    setDrawingActive(false);
  };

  // Delete everything
  const handleDelete = () => {
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
    if (tempLineRef.current) {
      tempLineRef.current.remove();
      tempLineRef.current = null;
    }
    setCurrentPoints([]);
    setDrawingActive(false);
    setSpace(null);
    setLineLength(null);
    setPerimeter(null);
    setDistanceFromX(null);
    setLandType('');
  };

  // Overpass land‑type lookup (unchanged)
  const fetchLandType = async (polygonGeoJson) => {
    const bbox = turf.bbox(polygonGeoJson);
    const query = `
      [out:json];
      (
        way["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
        way["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
        relation["landuse"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
        relation["natural"](${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});
      );
      out body;
    `;

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      });
      const data = await response.json();

      const typeCount = {};
      data.elements.forEach((el) => {
        if (el.tags) {
          const type = el.tags.landuse || el.tags.natural;
          if (type) typeCount[type] = (typeCount[type] || 0) + 1;
        }
      });

      let dominant = 'unknown';
      let max = 0;
      for (const [type, count] of Object.entries(typeCount)) {
        if (count > max) {
          max = count;
          dominant = type;
        }
      }
      return dominant;
    } catch (error) {
      console.error('Overpass error:', error);
      return 'error fetching data';
    }
  };

  // Component that handles map clicks only when drawMode = true
  const DrawingHandler = () => {
    const map = useMap();
    const thresholdMeters = 10; // auto‑close for polygon

    useEffect(() => {
      const handleMapClick = (e) => {
        // Ignore clicks if drawMode is off
        if (!drawMode) return;

        const latlng = e.latlng;

        // If not currently drawing, start a new shape
        if (!drawingActiveRef.current) {
          setCurrentPoints([latlng]);
          setDrawingActive(true);
          if (tempLineRef.current) tempLineRef.current.remove();
          // Temporary line (different style for polygon vs line)
          const dash = shapeTypeRef.current === 'polygon' ? '5, 5' : null; // solid for line
          tempLineRef.current = L.polyline([latlng], {
            color: '#ffaa00',
            weight: 4,
            dashArray: dash,
            opacity: 0.9
          }).addTo(map);
          return;
        }

        // Drawing active – add point
        const newPoints = [...currentPointsRef.current, latlng];
        setCurrentPoints(newPoints);
        if (tempLineRef.current) {
          tempLineRef.current.setLatLngs(newPoints);
        }

        // Auto‑close only for polygons when near first point
        if (shapeTypeRef.current === 'polygon') {
          const firstPoint = newPoints[0];
          const distance = map.distance(latlng, firstPoint);
          if (distance < thresholdMeters) {
            finishShape();
          }
        }
        // For lines, no auto‑close
      };

      // Prevent double‑click from adding two points: we ignore double clicks entirely
      const handleMapDblClick = (e) => {
        // Do nothing – not adding a point, and let the map zoom (if doubleClickZoom enabled)
        // But we must prevent the click events that would follow? Actually doubleClick fires two clicks before dblclick.
        // To avoid those two clicks, we can set a flag and ignore subsequent clicks? Too complex.
        // Simpler: disable doubleClickZoom while drawing? Not ideal.
        // Alternative: use a timer to ignore clicks that are part of a double-click.
        // For simplicity, we'll just disable doubleClickZoom when drawMode is true,
        // and re-enable when false. That way double-click does nothing (doesn't zoom, doesn't add points).
        // We'll handle that outside this effect.
      };

      map.on('click', handleMapClick);
      map.on('dblclick', handleMapDblClick);
      return () => {
        map.off('click', handleMapClick);
        map.off('dblclick', handleMapDblClick);
      };
    }, [map, drawMode]); // re-run when drawMode changes

    return null;
  };

  // Control double-click zoom based on drawMode
  const DoubleClickControl = () => {
    const map = useMap();
    useEffect(() => {
      if (drawMode) {
        map.doubleClickZoom.disable();
      } else {
        map.doubleClickZoom.enable();
      }
    }, [map, drawMode]);
    return null;
  };

  // Marker for user location – center only once
  const GeolocationMarker = () => {
    const map = useMap();
    useEffect(() => {
      if (!userLocation) return;
      if (markerRef.current) markerRef.current.remove();

      const marker = L.marker(userLocation).addTo(map);
      marker.bindPopup('You are here');
      markerRef.current = marker;

      // Only set the view the first time we get the location
      if (!hasCenteredRef.current) {
        map.setView(userLocation, 13);
        hasCenteredRef.current = true;
      }

      return () => {
        if (markerRef.current) markerRef.current.remove();
      };
    }, [userLocation, map]); // runs when userLocation or map changes, but the guard prevents re-centering

    return null;
  };

  return (
    <div>
      {/* <h1>bonjour</h1>
      <div>
      <label>nom</label>
      <input/>
      </div> */}

      {/* <div>
      <label>tel</label>
      <input/>
      </div> */}

    <div style={{ position: 'relative' }}>
      {/* Map container with dynamic cursor */}
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={13}
        style={{
          height: '600px',
          width: '100%',
          cursor: drawMode ? 'crosshair' : 'grab'
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <FeatureGroup ref={featureGroupRef} />
        <DrawingHandler />
        <DoubleClickControl />
        <GeolocationMarker />
      </MapContainer>

      {/* Control Panel */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          maxWidth: '320px',
          zIndex: 1000,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* <h3 style={{ marginBottom: '10px' }}>Measurement Results</h3> */}

        {/* <p>
          <strong>Your location:</strong><br />
          {userLocation
            ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
            : 'Detecting...'}
        </p> */}

        {/* <p>
          <strong>Area:</strong><br />
          {space || '—'}
        </p> */}

        {/* {lineLength && (
          <p>
            <strong>Length:</strong><br />
            {lineLength}
          </p>
        )} */}

        {/* <p>
          <strong>Perimeter:</strong><br />
          {perimeter || '—'}
        </p> */}

        {/* <p>
          <strong>Distance from X:</strong><br />
          {distanceFromX || '—'}
        </p> */}

        {/* <p> */}
          {/* <strong>Land type:</strong><br /> */}
          {/* {landType || '—'} */}
        {/* </p> */}

        {/* Draw mode toggle */}
        {/* <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Draw mode:</label>
          <button
            onClick={() => setDrawMode(!drawMode)}
            style={{
              padding: '5px 12px',
              background: drawMode ? '#4caf50' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {drawMode ? 'ON' : 'OFF'}
          </button>
        </div> */}

        {/* Shape type selector (only when draw mode is on) */}
        {/* {drawMode && ( */}
        {false && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShapeType('polygon')}
              style={{
                flex: 1,
                padding: '5px',
                background: shapeType === 'polygon' ? '#3388ff' : '#e0e0e0',
                color: shapeType === 'polygon' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Polygon
            </button>
            <button
              onClick={() => setShapeType('line')}
              style={{
                flex: 1,
                padding: '5px',
                background: shapeType === 'line' ? '#3388ff' : '#e0e0e0',
                color: shapeType === 'line' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Line
            </button>
          </div>
        )}

        {/* Drawing controls (visible only when actively drawing) */}
        {drawingActive && (
          <>
            <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
              Points: {currentPoints.length}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
              <button
                onClick={finishShape}
                disabled={currentPoints.length < (shapeType === 'polygon' ? 3 : 2)}
                style={{
                  flex: 1,
                  padding: '5px 10px',
                  background: currentPoints.length >= (shapeType === 'polygon' ? 3 : 2) ? '#4caf50' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPoints.length >= (shapeType === 'polygon' ? 3 : 2) ? 'pointer' : 'not-allowed',
                }}
              >
                Finish
              </button>
              <button
                onClick={handleCancelDrawing}
                style={{
                  flex: 1,
                  padding: '5px 10px',
                  background: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          
          <button
          onClick={handleDelete}
          style={{
            marginTop: '10px',
            padding: '5px 10px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Delete Shape
        </button>
        </>
        )}

        

        {/* <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
          <strong>How to use:</strong><br />
          • Toggle <strong>Draw mode ON</strong> to start drawing.<br />
          • Choose <strong>Polygon</strong> (area) or <strong>Line</strong> (length).<br />
          • Click on map to place points. For polygons, click near first point to auto‑close.<br />
          • Use <strong>Finish</strong> to complete, <strong>Cancel</strong> to abort.<br />
          • Turn <strong>Draw mode OFF</strong> to pan/zoom normally (double‑click zoom works).<br />
          ⚠️ The map will not jump back to your location after you move it.
        </p> */}
      </div>
    </div>
    </div>
  );
};

export default LocationFinder;