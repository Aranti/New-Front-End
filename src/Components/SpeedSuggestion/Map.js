// Import necessary packages and styles
import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ data,port1,port2 }) => {
  // Use the first point as the center
  const center = data.length > 0 ? [data[0].lat, data[0].long] : [0, 0];
  // const myList = ['PIRAEUS', 'DORDRECHT', 'ABIDJAN', 'SAN LORENZO'];

  // Function to create a custom icon for markers
  const customIcon = (index) => {
    if (index === 0) {
      // Add code for the "if" condition
      return new L.divIcon({
        className: 'custom-icon',
        html: `<div class="stretch-label">${port1} Port</div>`,
      });
    }else if (index === data.length - 1) {
      // Add code for the "if" condition
      return new L.divIcon({
        className: 'custom-icon',
        html: `<div class="stretch-label">${port2} Port</div>`,
      });
    }
    // else if (index === data.length - 2 && myList.includes(port1) && myList.includes(port2)) {
    //   // Add code for the "if" condition
    //   return new L.divIcon({
    //     className: 'custom-icon',
    //     html: `<div class="stretch-label"></div>`,
    //   });
    // }
    // else if (index ===  1) {
    //   // Add code for the "if" condition
    //   return new L.divIcon({
    //     className: 'custom-icon',
    //     html: `<div class="stretch-label">ETD First Mark Point</div>`,
    //   });
    // }
    // else if (index === data.length - 2) {
    //   // Add code for the "if" condition
    //   return new L.divIcon({
    //     className: 'custom-icon',
    //     html: `<div class="stretch-label">ETD Last Mark Point</div>`,
    //   });
    // }
    else {
      // Add code for the "else" condition (empty for now)
      return new L.divIcon({
        className: 'custom-icon',
        html: `<div class="stretch-label">Stretch ${index}</div>`,
      });
    }
  };

  // Convert data to LatLng array for Polyline
  const polylineCoordinates = data.map((point) => [point.lat, point.long]);

  return (
    <div className="map-container">
      <MapContainer
        center={center} // Center the map at the first point
        zoom={6}
        style={{ height: '400px', width: '80%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline positions={polylineCoordinates} color="red" />
        {data.map((point, index) => {
          if (index !== 0 && index !== data.length - 1) {
            // Display popup only for points from 2nd to second last
            return (
              <Marker key={index} position={[point.lat, point.long]} icon={customIcon(index)}>
                <Popup>
                  <div>
                    <p>Stretch {index}</p>
                    <p>Latitude: {point.lat}</p>
                    <p>Longitude: {point.long}</p>
                  </div>
                </Popup>
              </Marker>
            );
          } else {
            // For first and last points, render Marker without Popup
            return (
              <Marker key={index} position={[point.lat, point.long]} icon={customIcon(index)} />
            );
          }
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
