import React from 'react';
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapContainer = () => {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => null
    );
  }, []);

  const mapStyles = {
    height: "100vh",
    width: "100%"
  };

  return (
    <LoadScript
      googleMapsApiKey='AIzaSyARf2O8_kiPOjmWzrP_ZcqAdjbaT-K4uSw'>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={position}
      >
        <Marker position={position} />
      </GoogleMap>
    </LoadScript>
  )
}
export default MapContainer;