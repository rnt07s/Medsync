import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { FaMapPin, FaHospital } from 'react-icons/fa'; // Import the icons
import ReactDOMServer from 'react-dom/server'; // Import ReactDOMServer to render icons to HTML
import { useRecoilState } from 'recoil';
import { mode } from '../store/atom';
import 'leaflet-routing-machine'; // Import Leaflet Routing Machine
import Skeleton from '@mui/material/Skeleton';
import Navbar from '../components/Navbar';
import '../styles/Nearbyhospitals.css';

const HospitalsAround = () => {
  const [location, setLocation] = useState({ lat: null, lng: null }); // User's actual GPS location
  const [searchLocation, setSearchLocation] = useState({ lat: null, lng: null }); // Search center for hospitals
  const [map, setMap] = useState(null);
  const [dark, setDark] = useRecoilState(mode);
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [routeControl, setRouteControl] = useState(null); // State to store the current route
  const [distances, setDistances] = useState({}); // Store distances for each hospital (by index)
  const [address, setAddress] = useState('Fetching address...'); // State for the human-readable address
  const [searchAddress, setSearchAddress] = useState(''); // Address for searched location
  const [manualMode, setManualMode] = useState(false);
  const [pickOnMap, setPickOnMap] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [addressInput, setAddressInput] = useState(''); // user-entered address/city
  const [currMarker, setCurrMarker] = useState(null); // reference to 'You are here' marker
  const [searchMarker, setSearchMarker] = useState(null); // reference to search location marker
  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const successCallback = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setLocation({ lat: latitude, lng: longitude });
      setSearchLocation({ lat: latitude, lng: longitude }); // Initially search from user's location
      findHospitalsNearby(latitude, longitude);
      fetchAddress(latitude, longitude); // Fetch human-readable address
    };

    const errorCallback = (error) => {
      console.error('Error getting location: ', error);
      setLocationError(true);
    };

    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      options,
    );
  }, []);

  // Map click handler for pick-on-map mode
  useEffect(() => {
    if (!map) return;

    const onMapClick = (e) => {
      if (pickOnMap) {
        const { lat, lng } = e.latlng;
        setSearchLocation({ lat, lng });
        fetchSearchAddress(lat, lng);
        // Search hospitals in clicked location
        findHospitalsNearby(lat, lng);
      }
    };

    map.on('click', onMapClick);
    return () => map.off('click', onMapClick);
  }, [map, pickOnMap]);

  // Keep the 'You are here' marker in sync - only updates when actual GPS location changes
  useEffect(() => {
    if (!map || !location.lat || !location.lng) return;

    const currLocIconHtml = ReactDOMServer.renderToString(
      <FaMapPin style={{ color: 'blue', fontSize: '24px' }} />,
    );
    const currLocIcon = L.divIcon({
      html: currLocIconHtml,
      className: '',
      iconSize: [24, 24],
    });

    if (currMarker && currMarker.setLatLng) {
      // Don't move the marker - it should stay at user's actual location
      // Only update if this is the initial set
    } else {
      // create marker if it doesn't exist
      try {
        const marker = L.marker([location.lat, location.lng], { icon: currLocIcon })
          .addTo(map)
          .bindPopup('You are here (Your actual location)');
        setCurrMarker(marker);
      } catch (e) {
        console.error('Error creating current location marker:', e);
      }
    }
  }, [location.lat, location.lng, map]);

  // Manage search location marker (green pin for searched area)
  useEffect(() => {
    if (!map || !searchLocation.lat || !searchLocation.lng) return;
    
    // Don't show search marker if it's the same as user location
    if (searchLocation.lat === location.lat && searchLocation.lng === location.lng) {
      if (searchMarker) {
        map.removeLayer(searchMarker);
        setSearchMarker(null);
      }
      return;
    }

    const searchIconHtml = ReactDOMServer.renderToString(
      <FaMapPin style={{ color: 'green', fontSize: '24px' }} />,
    );
    const searchIcon = L.divIcon({
      html: searchIconHtml,
      className: '',
      iconSize: [24, 24],
    });

    if (searchMarker) {
      try {
        searchMarker.setLatLng([searchLocation.lat, searchLocation.lng]);
        map.setView([searchLocation.lat, searchLocation.lng], map.getZoom() || 13);
      } catch (e) {
        console.error('Error updating search marker:', e);
      }
    } else {
      try {
        const marker = L.marker([searchLocation.lat, searchLocation.lng], { icon: searchIcon })
          .addTo(map)
          .bindPopup('Search area center');
        setSearchMarker(marker);
        map.setView([searchLocation.lat, searchLocation.lng], 13);
      } catch (e) {
        console.error('Error creating search marker:', e);
      }
    }
  }, [searchLocation, map, location.lat, location.lng]);

  // Fetch human-readable address using reverse geocoding (Nominatim API)
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name); // Set the human-readable address
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Unable to fetch address');
    }
  };

  // Fetch address for searched location
  const fetchSearchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      if (data && data.display_name) {
        setSearchAddress(data.display_name);
      } else {
        setSearchAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching search address:', error);
      setSearchAddress('Unable to fetch address');
    }
  };

  async function findHospitalsNearby(lat, lng) {
    setLoadingHospitals(true);
    const radius = 2000;

    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        relation["amenity"="hospital"](around:${radius},${lat},${lng});
      );
      out center;`;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.elements.length > 0) {
        const hospitalData = data.elements.map((hospital) => {
          let hospitalLat, hospitalLng;
            if (hospital.type === 'node') {
              hospitalLat = hospital.lat;
              hospitalLng = hospital.lon;
            } else if (hospital.type === 'way' || hospital.type === 'relation') {
              hospitalLat = hospital.center.lat;
              hospitalLng = hospital.center.lon;
            }

            // Build a human-readable address from tags when available
            const tags = hospital.tags || {};
            const addrParts = [];
            if (tags['addr:housenumber']) addrParts.push(tags['addr:housenumber']);
            if (tags['addr:street']) addrParts.push(tags['addr:street']);
            if (tags['addr:place']) addrParts.push(tags['addr:place']);
            if (tags['addr:city']) addrParts.push(tags['addr:city']);
            if (tags['addr:state']) addrParts.push(tags['addr:state']);
            const addressStr = addrParts.length > 0 ? addrParts.join(', ') : tags['addr:full'] || tags['operator'] || '';

            return {
              name: tags.name || 'Unnamed Hospital',
              lat: hospitalLat,
              lng: hospitalLng,
              address: addressStr,
            };
        });

        // Calculate distances to each hospital
        const calculatedDistances = hospitalData.reduce((acc, hospital) => {
          const distance =
            L.latLng(lat, lng).distanceTo(
              L.latLng(hospital.lat, hospital.lng),
            ) / 1000; // distance in km
          acc[hospital.name] = distance.toFixed(2); // Keep 2 decimal places
          return acc;
        }, {});

        setHospitals(hospitalData);
        setDistances(calculatedDistances); // Store distances
      } else {
        setHospitals([]);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoadingHospitals(false);
    }
  }

  // Initialize map and markers
  useEffect(() => {
    if (location.lat && location.lng && !map) {
      const leafletMap = L.map('map').setView([location.lat, location.lng], 13);
      setMap(leafletMap);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap);

      const currLocIconHtml = ReactDOMServer.renderToString(
        <FaMapPin style={{ color: 'blue', fontSize: '24px' }} />,
      );
      const currLocIcon = L.divIcon({
        html: currLocIconHtml,
        className: '',
        iconSize: [24, 24],
      });

      const marker = L.marker([location.lat, location.lng], { icon: currLocIcon })
        .addTo(leafletMap)
        .bindPopup('You are here!')
        .openPopup();

      setCurrMarker(marker);
    }

    // Add hospital markers
    if (map && hospitals.length > 0) {
      hospitals.forEach((hospital, idx) => {
        const hospitalIconHtml = ReactDOMServer.renderToString(
          <FaHospital style={{ color: 'red', fontSize: '24px' }} />,
        );
        const hospitalIcon = L.divIcon({
          html: hospitalIconHtml,
          className: '',
          iconSize: [24, 24],
        });

        const marker = L.marker([hospital.lat, hospital.lng], { icon: hospitalIcon }).addTo(map);

        // Calculate distance (km) using Leaflet's distanceTo
        // determine origin: prefer current marker position if available
        const originLatLng = currMarker && currMarker.getLatLng ? currMarker.getLatLng() : L.latLng(location.lat, location.lng);
        const distKm = (L.latLng(originLatLng.lat, originLatLng.lng).distanceTo(L.latLng(hospital.lat, hospital.lng)) / 1000).toFixed(2);
        setDistances((prev) => ({ ...prev, [idx]: distKm }));

        // Directions URL (opens Google Maps directions in new tab)
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${hospital.lat},${hospital.lng}`;

        // Popup content with address, distance and a Directions link
        const popupContent = `<div><strong>${hospital.name}</strong><br/>${hospital.address ? `<small>${hospital.address}</small><br/>` : ''}Distance: ${distKm} km<br/><a href="${directionsUrl}" target="_blank" rel="noreferrer">Directions</a><br/><small>Click marker to route</small></div>`;
        marker.bindPopup(popupContent);

        // On marker click, show the route and open popup
        marker.on('click', () => {
          showRouteToHospital(hospital);
          marker.openPopup();
        });
      });
    }
  }, [location, map, hospitals]);

  // Show route from current location to selected hospital
  const showRouteToHospital = (hospital) => {
    // Only proceed if the map is initialized
    if (!map) return;

    // Remove the previous route if it exists
    if (routeControl) {
      try {
        map.removeControl(routeControl);
      } catch (error) {
        console.error('Error removing route control:', error);
      }
    }

    // Create a new route control
    // Determine origin for routing: prefer current marker position if present
    const originLatLng = currMarker && currMarker.getLatLng ? currMarker.getLatLng() : L.latLng(location.lat, location.lng);

    const newRouteControl = L.Routing.control({
      waypoints: [
        L.latLng(originLatLng.lat, originLatLng.lng), // Current location
        L.latLng(hospital.lat, hospital.lng), // Hospital location
      ],
      routeWhileDragging: true,
      addWaypoints: false, // Disable adding new waypoints
      show: false, // Disable the default instructions control (this hides the panel)
      createMarker: () => {}, // Removes default markers (if you want custom markers)
      lineOptions: {
        styles: [{ color: 'blue', weight: 5 }], // Set route color to blue
      },
    }).addTo(map);

    setRouteControl(newRouteControl);
  };

  return (
    <>
      <Navbar />
      <div className="content-container">
        {' '}
        {/* Add this wrapper for margin */}
        {location.lat && location.lng ? (
          <div className="flex flex-col-reverse  py-16  md:flex-row ">
            <div
              className={`h-1/2 md:w-[30%] md:h-screen  md:overflow-y-scroll ${
                dark === 'dark'
                  ? 'bg-gray-900 text-gray-200'
                  : 'bg-white text-gray-800'
              }`}
            >
              <div
                className={`${
                  dark === 'dark'
                    ? 'bg-gradient-to-r from-gray-700 via-gray-900 to-black text-gray-100 shadow-2xl'
                    : 'bg-[linear-gradient(90deg,_#a1c4fd_0%,_#c2e9fb_100%)] text-black'
                } px-2 py-2.5 `}
              >
                <p className="font-bold text-sm">
                  <span className="text-blue-400">📍 Your Location:</span> {address}
                </p>
                {searchAddress && searchLocation.lat !== location.lat && (
                  <p className="font-bold text-sm mt-1">
                    <span className="text-green-400">🔍 Search Area:</span> {searchAddress}
                  </p>
                )}
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-indigo-500 text-white px-3 py-1 rounded text-sm"
                    onClick={() => setManualMode(!manualMode)}
                  >
                    {manualMode ? 'Cancel Manual' : 'Manual Location'}
                  </button>
                  <button
                    className={`bg-green-500 text-white px-3 py-1 rounded text-sm ${pickOnMap ? 'opacity-80' : ''}`}
                    onClick={() => setPickOnMap(prev => !prev)}
                  >
                    {pickOnMap ? 'Disable Pick-on-Map' : 'Pick on Map'}
                  </button>
                  {(searchLocation.lat !== location.lat || searchLocation.lng !== location.lng) && (
                    <button
                      className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
                      onClick={() => {
                        setSearchLocation({ lat: location.lat, lng: location.lng });
                        setSearchAddress('');
                        findHospitalsNearby(location.lat, location.lng);
                        if (map) map.setView([location.lat, location.lng], 13);
                      }}
                    >
                      Back to My Location
                    </button>
                  )}
                </div>
              </div>
              {manualMode && (
                <div className="p-2">
                  <label className="block text-sm">City or Address:</label>
                  <input
                    type="text"
                    placeholder="Type a city or address (eg. Bangalore, MG Road)"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="border p-1 rounded w-full mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={async () => {
                        if (!addressInput || addressInput.trim() === '') return;
                        try {
                          const resp = await fetch(
                            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                              addressInput,
                            )}&limit=1`,
                          );
                          const results = await resp.json();
                          if (results && results.length > 0) {
                            const { lat, lon } = results[0];
                            // Only update search location, NOT the user's actual location
                            setSearchLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
                            fetchSearchAddress(parseFloat(lat), parseFloat(lon));
                            findHospitalsNearby(parseFloat(lat), parseFloat(lon));
                            if (map) map.setView([parseFloat(lat), parseFloat(lon)], 13);
                          } else {
                            alert('Location not found. Try a different query.');
                          }
                        } catch (err) {
                          console.error('Error geocoding address:', err);
                          alert('Geocoding failed. Check network and try again.');
                        }
                      }}
                    >
                      Search & Apply
                    </button>
                    <button
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setAddressInput('');
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
              <div>
                {loadingHospitals ? (
                  <p>Loading hospitals...</p>
                ) : hospitals.length > 0 ? (
                  <div className="container mx-auto ">
                    <br />
                    <h3
                      className={`text-lg tracking-widest text-center font-semibold ${
                        dark === 'dark' ? 'text-[#f6e05e]' : 'text-[#c229b8]'
                      }`}
                    >
                      Hospitals within 2km:
                    </h3>
                    <br />
                    <div className="flex flex-col w-full">
                      {hospitals.map((hospital, index) => {
                        return (
                          <div
                            key={index}
                            className={`mx-auto w-full  rounded-xl shadow-2xl  p-4 mb-3
                               ${
                                 dark === 'dark'
                                   ? 'bg-[#2d3748] text-[#e2e8f0]'
                                   : 'bg-[#fff] text-[#333]'
                               }`}
                          >
                            <div className="uppercase tracking-wide text-[10px] text-custom-blue font-semibold ">
                              Hospital
                            </div>
                            <h1
                              className={`block mt-1 text-lg leading-tight font-semibold  ${
                                dark === 'dark'
                                  ? 'text-[#f6e05e]'
                                  : 'text-[#c229b8]'
                              }`}
                            >
                              {hospital.name}
                            </h1>
                            {/* <div className="mt-2 text-sm">
                          <span className="text-gray-700 font-semibold">Address:</span>
                          <p className='text-xs'>{hospital.address}</p>
                        </div> */}
                            <div className="mt-2 text-sm">
                              <span className="font-semibold">
                                Coordinates:
                              </span>
                              <p className="text-xs">
                                Lat: {hospital.lat}, Lon: {hospital.lng}
                              </p>
                            </div>
                            <div className="mt-2 text-sm">
                              <span className=" font-semibold">Distance:</span>
                              <p className="text-xs">
                                {distances[index]} km
                              </p>
                            </div>
                            <button
                              onClick={() => showRouteToHospital(hospital)}
                              className="mt-4 bg-blue-500 text-white px-3 py-1 rounded mr-2"
                            >
                              Show Route
                            </button>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${hospital.lat},${hospital.lng}`}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 inline-block bg-green-600 text-white px-3 py-1 rounded"
                            >
                              Directions
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p>No hospitals found nearby.</p>
                )}
              </div>
            </div>
            <div
              id="map"
              className="h-[50vh] w-full  md:w-[70%] md:h-screen "
            ></div>
          </div>
        ) : locationError ? (
          <p>
            Having trouble fetching location. Please enable location access in
            your browser and reload the page to retry.
          </p>
        ) : (
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              gap: '3rem',
            }}
          >
            <Skeleton variant="rectangular" width={400} height={400} />
            <Skeleton variant="rectangular" width={900} height={760} />
          </div>
        )}
      </div>
    </>
  );
};

export default HospitalsAround;
