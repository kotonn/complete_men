import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { CircleF, GoogleMap, InfoWindowF, LoadScript, MarkerF, StandaloneSearchBox } from '@react-google-maps/api';
import { Box, radioClasses } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const MapContainer = () => {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [currentPositionName, setCurrentPositionName] = useState('');
  const [destinationPositionName, setDestinationPositionName] = useState('');

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
        // show the name of the current position 
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat: position.coords.latitude, lng: position.coords.longitude } }, (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              setCurrentPositionName(results[0].formatted_address);
            } else {
              window.alert("");
            }
          } else {
            window.alert("Geocoder failed due to: " + status);
          }
        }
        );
      },
      () => null,
    );
  }, [currentPositionName]);

  const [recocenter, setRecocenter] = useState({ lat: 0, lng: 0, name: "" });
  const [reconame, setReconame] = useState("")

  const mapStyles = {
    height: '80vh',
    width: '60%',
  };

  const serachBoxRef = useRef();
  const [namerating, setNamerating] = useState([{ storename: '', rating: "", lat: 0, lng: 0 }]);
  const onPlacesChanged = () => {
    const places = serachBoxRef.current.getPlaces();
    if (places == undefined) {
      ;
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
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }));

      setNamerating(newNamerating);
      newNamerating.sort((a, b) => {
        if (a.rating < b.rating) {
          return 1
        } else if (a.rating == b.rating) {
          return 0
        } else {
          return -1
        }
      });

      console.log(newNamerating)
      // get the center of the place
      const lat = places[0].geometry.location.lat();
      const lng = places[0].geometry.location.lng();
      setPosition({ lat, lng });

    };
  }
  console.log(markers)
  const moveToThere = (e) => {
    // get the name of the position where an user clicked
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat: e.latLng.lat(), lng: e.latLng.lng() } }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setDestinationPositionName(results[0].formatted_address);
        } else {
          window.alert("");
        }
      } else {
        window.alert("Geocoder failed due to: " + status);
      }
    }
    );
    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentPositionName}&destination=${destinationPositionName}`;
    window.open(url, '_blank');
  }


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
        >
          <Paper
            component='text'
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: 400,
              marginLeft: "50px"
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

            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <img src="/mapcat.png" style={{ width: '30px', paddingBottom: '10px' }} />

          </Paper>
        </StandaloneSearchBox>
        <Box sx={{ display: 'flex', marginLeft: "30px", marginTop: 5 }}>
          <GoogleMap directionService mapContainerStyle={mapStyles} zoom={13} center={position}>
            {/* set the first marker on the position where an user is. */}
            <MarkerF position={position} />
            {/* set the markers on the places where an user searched. */}
            {markers.map((marker) => (
              <MarkerF key={marker.lat} position={marker} onClick={moveToThere}
              />
            ))}

            <InfoWindowF position={recocenter}>
              <div>
                <p>{reconame}</p>
              </div>
            </InfoWindowF>


          </GoogleMap>
          <Box>
            {namerating.map((rating) => (
              <div sx={{ flexDirection: "column", }} onMouseEnter={() => {
                let ratingcenter = { lat: rating.lat, lng: rating.lng }
                console.log(ratingcenter);
                setRecocenter({ lat: ratingcenter.lat, lng: ratingcenter.lng })
                setReconame(rating.storename)
              }} >
                {rating.storename} {rating.rating}</div>))}

          </Box></Box>
      </Box>
    </LoadScript>

  );
};
export default MapContainer;


