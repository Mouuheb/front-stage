// import React, { useState, useCallback, useRef } from 'react';
// import { GoogleMap, LoadScript, DrawingManager } from '@react-google-maps/api';

// // Map container style
// const containerStyle = {
//   width: '100%',
//   height: '500px'
// };

// // Default center (e.g., San Francisco)
// const center = {
//   lat: 37.7749,
//   lng: -122.4194
// };

// // Libraries to load (Drawing and Geometry)
// const libraries = ['drawing', 'geometry'];

// const MapWithPolygonDraw = () => {
//   const [polygon, setPolygon] = useState(null);               // Current polygon instance
//   const [area, setArea] = useState(0);                         // Computed area (sq meters)
//   const [perimeter, setPerimeter] = useState(0);               // Computed perimeter (meters)
//   const mapRef = useRef(null);                                  // Reference to map instance
//   const drawingManagerRef = useRef(null);                       // Reference to drawing manager

//   // Helper to calculate area and perimeter from a polygon path
//   const calculateMetrics = (path) => {
//     if (!window.google || path.getLength() < 3) {
//       setArea(0);
//       setPerimeter(0);
//       return;
//     }

//     const google = window.google;
//     const geometry = google.maps.geometry.spherical;

//     // Compute area (handles closed polygon automatically)
//     const areaSqMeters = geometry.computeArea(path);
//     setArea(areaSqMeters);

//     // Compute perimeter: sum of edges between consecutive points + closing edge
//     const pathArray = path.getArray(); // copy of LatLng objects
//     let perimeterMeters = 0;
//     for (let i = 0; i < pathArray.length - 1; i++) {
//       perimeterMeters += geometry.computeDistanceBetween(pathArray[i], pathArray[i + 1]);
//     }
//     // Add closing edge (last point to first)
//     if (pathArray.length > 1) {
//       perimeterMeters += geometry.computeDistanceBetween(
//         pathArray[pathArray.length - 1],
//         pathArray[0]
//       );
//     }
//     setPerimeter(perimeterMeters);
//   };

//   // Attach event listeners to polygon's path to track edits
//   const attachPathListeners = (polygon) => {
//     const path = polygon.getPath();
//     const listeners = [];
//     listeners.push(path.addListener('set_at', () => calculateMetrics(path)));
//     listeners.push(path.addListener('insert_at', () => calculateMetrics(path)));
//     listeners.push(path.addListener('remove_at', () => calculateMetrics(path)));

//     // Store listeners so they can be removed later (optional, but good practice)
//     polygon.listeners = listeners;
//   };

//   // Remove previous polygon and set up new one
//   const handlePolygonComplete = (polygon) => {
//     // Clear previous polygon if exists
//     if (polygon) {
//       polygon.setMap(null);
//     }

//     // Store new polygon
//     setPolygon(polygon);

//     // Calculate initial metrics
//     const path = polygon.getPath();
//     calculateMetrics(path);

//     // Attach edit listeners
//     attachPathListeners(polygon);

//     // Optional: disable drawing mode after polygon is drawn
//     if (drawingManagerRef.current) {
//       drawingManagerRef.current.setDrawingMode(null);
//     }
//   };

//   // Clear polygon from map and reset state
//   const clearPolygon = () => {
//     if (polygon) {
//       polygon.setMap(null);
//       // Remove event listeners if needed (polygon will be garbage collected)
//       setPolygon(null);
//       setArea(0);
//       setPerimeter(0);
//     }

//     // Re-enable drawing mode
//     if (drawingManagerRef.current) {
//       drawingManagerRef.current.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
//     }
//   };

//   // Map load callback
//   const onMapLoad = useCallback((map) => {
//     mapRef.current = map;
//   }, []);

//   // Drawing manager load callback
//   const onDrawingManagerLoad = useCallback((drawingManager) => {
//     drawingManagerRef.current = drawingManager;
//   }, []);

//   return (
//     <div>
//       <LoadScript
//         googleMapsApiKey="YOUR_API_KEY"  // Replace with your actual API key
//         libraries={libraries}
//       >
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={center}
//           zoom={12}
//           onLoad={onMapLoad}
//         >
//           <DrawingManager
//             onLoad={onDrawingManagerLoad}
//             options={{
//               drawingControl: true,
//               drawingControlOptions: {
//                 position: google.maps.ControlPosition.TOP_CENTER,
//                 drawingModes: [google.maps.drawing.OverlayType.POLYGON]
//               },
//               polygonOptions: {
//                 editable: true,
//                 draggable: true,
//                 fillColor: '#FF0000',
//                 fillOpacity: 0.3,
//                 strokeWeight: 2,
//                 strokeColor: '#FF0000'
//               }
//             }}
//             onPolygonComplete={handlePolygonComplete}
//           />
//         </GoogleMap>
//       </LoadScript>

//       <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5' }}>
//         <h3>Polygon Metrics</h3>
//         <p><strong>Area:</strong> {area.toFixed(2)} m² ({(area / 10000).toFixed(2)} hectares)</p>
//         <p><strong>Perimeter:</strong> {perimeter.toFixed(2)} m</p>
//         <button onClick={clearPolygon} style={{ padding: '8px 16px', marginTop: '10px' }}>
//           Clear Polygon
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MapWithPolygonDraw;




import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, DrawingManager } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 37.7749,
  lng: -122.4194
};

const libraries = ['drawing', 'geometry'];

const MapWithPolygonDraw = () => {
  const [polygon, setPolygon] = useState(null);
  const [area, setArea] = useState(0);
  const [perimeter, setPerimeter] = useState(0);
  const [drawingOptions, setDrawingOptions] = useState(null); // New state for options
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);

  // Build drawing options only after google is available
  useEffect(() => {
    if (window.google) {
      setDrawingOptions({
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [window.google.maps.drawing.OverlayType.POLYGON]
        },
        polygonOptions: {
          editable: true,
          draggable: true,
          fillColor: '#FF0000',
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: '#FF0000'
        }
      });
    }
  }, []);

  const calculateMetrics = (path) => {
    if (!window.google || path.getLength() < 3) {
      setArea(0);
      setPerimeter(0);
      return;
    }

    const google = window.google;
    const geometry = google.maps.geometry.spherical;

    const areaSqMeters = geometry.computeArea(path);
    setArea(areaSqMeters);

    const pathArray = path.getArray();
    let perimeterMeters = 0;
    for (let i = 0; i < pathArray.length - 1; i++) {
      perimeterMeters += geometry.computeDistanceBetween(pathArray[i], pathArray[i + 1]);
    }
    if (pathArray.length > 1) {
      perimeterMeters += geometry.computeDistanceBetween(
        pathArray[pathArray.length - 1],
        pathArray[0]
      );
    }
    setPerimeter(perimeterMeters);
  };

  const attachPathListeners = (polygon) => {
    const path = polygon.getPath();
    const listeners = [];
    listeners.push(path.addListener('set_at', () => calculateMetrics(path)));
    listeners.push(path.addListener('insert_at', () => calculateMetrics(path)));
    listeners.push(path.addListener('remove_at', () => calculateMetrics(path)));
    polygon.listeners = listeners;
  };

  const handlePolygonComplete = (polygon) => {
    if (polygon) {
      polygon.setMap(null);
    }

    setPolygon(polygon);
    const path = polygon.getPath();
    calculateMetrics(path);
    attachPathListeners(polygon);

    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
  };

  const clearPolygon = () => {
    if (polygon) {
      polygon.setMap(null);
      setPolygon(null);
      setArea(0);
      setPerimeter(0);
    }

    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
    }
  };

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onDrawingManagerLoad = useCallback((drawingManager) => {
    drawingManagerRef.current = drawingManager;
  }, []);

  return (
    <div>
      <LoadScript
        googleMapsApiKey="YOUR_API_KEY"
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={onMapLoad}
        >
          {/* Render DrawingManager only after options are ready */}
          {drawingOptions && (
            <DrawingManager
              onLoad={onDrawingManagerLoad}
              options={drawingOptions}
              onPolygonComplete={handlePolygonComplete}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5' }}>
        <h3>Polygon Metrics</h3>
        <p><strong>Area:</strong> {area.toFixed(2)} m² ({(area / 10000).toFixed(2)} hectares)</p>
        <p><strong>Perimeter:</strong> {perimeter.toFixed(2)} m</p>
        <button onClick={clearPolygon} style={{ padding: '8px 16px', marginTop: '10px' }}>
          Clear Polygon
        </button>
      </div>
    </div>
  );
};

export default MapWithPolygonDraw;