import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, MarkerF, StandaloneSearchBox } from '@react-google-maps/api';
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';



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
    height: "80vh",
    width: "90%"
  };

  const serachBoxRef = useRef()

  const onPlacesChanged = () => {
    const lat = serachBoxRef.current.getPlaces()[0].geometry.location.lat();
    const lng = serachBoxRef.current.getPlaces()[0].geometry.location.lng();
    setPosition({ lat, lng })
  };

  return (
    <Box sx={{ height: "100vh", width: "100vw", justifyContent: "center", alignItems: "center", background: 'linear-gradient(to bottom right, pink, lightblue)', paddingTop: '4vh' }}>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, marginRight: 'auto', marginLeft: 'auto' }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Google Maps"
          inputProps={{ 'aria-label': 'search google maps' }}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
          <DirectionsIcon />
        </IconButton>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <LoadScript
          googleMapsApiKey='AIzaSyARf2O8_kiPOjmWzrP_ZcqAdjbaT-K4uSw' libraries={["places"]}>
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={13}
            center={position}
          >
            <StandaloneSearchBox
              onLoad={ref => serachBoxRef.current = ref}
              onPlacesChanged={onPlacesChanged}
            >
              <input
                type="text"
                placeholder="Customized your placeholder"
                style={{
                  boxSizing: `border-box`,
                  border: `1px solid transparent`,
                  width: `240px`,
                  height: `32px`,
                  padding: `0 12px`,
                  borderRadius: `3px`,
                  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                  fontSize: `14px`,
                  outline: `none`,
                  textOverflow: `ellipses`,
                  position: "absolute",
                  left: "50%",
                  marginLeft: "-120px"
                }}
              />
            </StandaloneSearchBox>
            <MarkerF position={position} />
          </GoogleMap>
        </LoadScript>
      </Box>
    </Box>
  )
}
export default MapContainer;