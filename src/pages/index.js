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
import { CollectionsBookmarkRounded } from '@mui/icons-material';

const MapContainer = () => {
  const [position, setPosition] = useState({ lat: 12, lng: 12 });

  // how to define the type of markers
  const [markers, setMarkers] = useState([
    {
      lat: 0,
      lng: 0,
    },
  ]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => null,
    );
  });

  const mapStyles = {
    height: '80vh',
    width: '60%',
  };

  const serachBoxRef = useRef();
  const [namerating, setNamerating] = useState([{ storename: 'ななし', rating: 0 }]);
  const onPlacesChanged = () => {
    const places = serachBoxRef.current.getPlaces();
    if (places == undefined) {;

    } else {
      const newMarkers = places.map((place) => ({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }));
console.log(places)
      setMarkers(newMarkers);
      const newNamerating = places.map((place) => ({
        storename: place.name,
        rating: place.rating,
      }));
    
    setNamerating(newNamerating);
  newNamerating.sort((a,b)=>{
    if (a.rating < b.rating){
      return 1
    }else if (a.rating == b.rating){
      return 0
    }else
    {return -1
  }}); 
  
console.log(newNamerating)
    // get the center of the place
    const lat = places[0].geometry.location.lat();
    const lng = places[0].geometry.location.lng();
    setPosition({ lat, lng });
  };
  }
  // do not reload the page when an user click the enter key
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  // }

  return (
    <LoadScript googleMapsApiKey='AIzaSyARf2O8_kiPOjmWzrP_ZcqAdjbaT-K4uSw' libraries={['places']}>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(to bottom right, pink, lightblue)',
          paddingTop: '4vh',
        }}
      >
        <StandaloneSearchBox
          onLoad={(ref) => (serachBoxRef.current = ref)}
          onPlacesChanged={onPlacesChanged}
          options={{ visible: false }}
          // onsubmit={handleSubmit}
        >
          <Paper
            component='text'
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: 400,
              marginLeft:"50px"
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder='Search Google Maps'
              inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton type='button' sx={{ p: '10px' }} aria-label='search'>
              <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
            <IconButton color='primary' sx={{ p: '10px' }} aria-label='directions'>
              <DirectionsIcon />
            </IconButton>
          </Paper>
        </StandaloneSearchBox>
        <Box sx={{ display: 'flex', marginLeft:"30px", marginTop: 5 }}>
          <GoogleMap directionService mapContainerStyle={mapStyles} zoom={13} center={position}>
            {/* set the first marker on the position where an user is. */}
            <MarkerF position={position} />
            {/* set the markers on the places where an user searched. */}
            {markers.map((marker) => (
              <MarkerF key={marker.lat} position={marker} />
            ))}
          </GoogleMap>
          <Box>
         {namerating.map((rating)=>(
        <li sx={{flexDirection:"column"}}>
          {rating.storename} {rating.rating}</li>))}
        </Box></Box>
      </Box>
    </LoadScript>
  );
};
export default MapContainer;
