import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { GoogleMap, InfoWindowF, LoadScript, MarkerF, StandaloneSearchBox } from '@react-google-maps/api';
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const MapContainer = () => {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [currentPositionName, setCurrentPositionName] = useState('');
  const [destinationPositionName, setDestinationPositionName] = useState('');
  const [recocenter, setRecocenter] = useState({ lat: 0, lng: 0, name: "" });
  const [reconame, setReconame] = useState("")
  const [namerating, setNamerating] = useState([{ storename: '', rating: "", lat: 0, lng: 0 }]);
  const [GPT3Response, setGPT3Response] = useState('');
  const chatGptApiKey = "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";

  const fetchGPT3 = async (text) => {

    const response = await fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${chatGptApiKey}`,
      },
      body: JSON.stringify({
        prompt: text,
        n: 1,
        max_tokens: 4000,
      }),
    });
    const data = await response.json();
    alert(data.choices[0].text);
  };

  // how to define the type of markers
  const [markers, setMarkers] = useState([
    {
      lat: 0,
      lng: 0,
    },
  ]);

  const mapStyles = {
    height: '80vh',
    width: '90%',
  };

  // get the current position of an user
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
            window.alert("");
          }
        }
        );
      },
      () => null,
    );
  }, [currentPositionName]);

  const researchBoxRef = useRef();

  const onPlacesChanged = () => {
    // get the places where an user searched
    const places = researchBoxRef.current.getPlaces();
    if (places == undefined) {
      ;
    } else {
      const newMarkers = places.map((place) => ({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }));
      setMarkers(newMarkers);

      // get the name and the rating of the places where an user searched
      const newNamerating = places.map((place) => ({
        storename: place.name,
        rating: place.rating,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }));
      setNamerating(newNamerating);

      // sort the places by the rating
      newNamerating.sort((a, b) => {
        if (a.rating < b.rating) {
          return 1
        } else if (a.rating == b.rating) {
          return 0
        } else {
          return -1
        }
      });

      // get the center of the place
      const lat = places[0].geometry.location.lat();
      const lng = places[0].geometry.location.lng();
      setPosition({ lat, lng });
    };
  }

  // show the direction from the current position to the position where an user clicked
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
          background: 'linear-gradient(to bottom right, pink, lightblue)',
          paddingTop: '4vh',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <StandaloneSearchBox
            onLoad={(ref) => (researchBoxRef.current = ref)}
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
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder='検索'
                inputProps={{ 'aria-label': 'search google maps' }}
              />
              <IconButton type='button' sx={{ p: '10px' }} aria-label='search'>
                <SearchIcon />
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <img id="imgPosition" src="/mapcat.png" style={{ width: '30px', paddingBottom: '10px', cursor: "pointer" }} onClick={() => { fetchGPT3("カフェの後に行きたくなる場所を5個javascriptの配列で教えて") }} />
            </Paper>
          </StandaloneSearchBox>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
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
              <div key={rating} sx={{ flexDirection: "column" }} onMouseEnter={() => {
                let ratingcenter = { lat: rating.lat, lng: rating.lng }
                setRecocenter({ lat: ratingcenter.lat, lng: ratingcenter.lng })
                setReconame(rating.storename)
              }}>
                {rating.storename} {rating.rating}
              </div>
            ))}
          </Box>
        </Box>
      </Box>
    </LoadScript >
  );
};
export default MapContainer;


