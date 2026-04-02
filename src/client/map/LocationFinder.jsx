import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import './style.css'

const LocationFinder = ({setinfo}) => {
  const [space, setSpace] = useState(null);
  const [locDetais, setLocDetais] = useState(null);
  
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
  
  // const [area,setArea] = useState(prop.prarea)
  // const [dis,setDis] = useState(prop.prdis)

  // Sync refs
  useEffect(() => { currentPointsRef.current = currentPoints; }, [currentPoints]);
  useEffect(() => { drawingActiveRef.current = drawingActive; }, [drawingActive]);
  useEffect(() => { shapeTypeRef.current = shapeType; }, [shapeType]);



  const locationX = [36.763351, 10.245811]; // 36.763351, 10.245811
  const[org,setOrg]=useState(null);

const getLocationDetails = async (acrd) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${acrd[1]}&lon=${acrd[0]}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();

    return {
      state: data.address.state || data.address.region || "",
      address: data.display_name || ""
    };
  } catch (error) {
    console.error("Error getting location details:", error);
    return {
      state: "",
      address: ""
    };
  }
};

  useEffect(() => {
    if(org){
    console.log(org)

    const fetchLocation = async () => {
      const result = await getLocationDetails(org); // Example: Tunis
      setLocDetais(result);
      console.log(result)
    };

    fetchLocation();
  }
  }, [org]);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude,position.coords.longitude]);
      },
      // (error) => console.error('Geolocation error:', error)
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
        setSpace(areaSqM.toFixed(2));
        setLineLength(null);
        perimeterM = turf.length(geoJson, { units: 'meters' });
        setPerimeter(perimeterM.toFixed(2) + ' m');
        //
        // console.log("----------------------------------------------------------------") 
              const firstPoint =
        type === 'polygon'
          ? geoJson.geometry.coordinates[0][0]
          : geoJson.geometry.coordinates[0];

      const [lng, lat] = firstPoint;
      
      setUserLocation([firstPoint[0],firstPoint[1]])
      

      // Create Google Maps link
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        // 
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
          setOrg(to.geometry.coordinates)
          const distanceKm = turf.distance(from, to, { units: 'kilometers' });
          setDistanceFromX(distanceKm.toFixed(2));
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
      // console.error('Error processing layer:', error);
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
      // console.error('Overpass error:', error);
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
// console.log('child:'+distanceFromX+' '+space+' '+org)
// setinfo(space,distanceFromX,org,locDetais);
  useEffect(() => {
  if (setinfo && typeof setinfo === 'function') {
    if (locDetais && locDetais.address) {
    setinfo(space, distanceFromX, org, locDetais);
  }
    // setinfo(space, distanceFromX, org, locDetais);
  }
}, [space, distanceFromX, org, locDetais, setinfo]);
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