import { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { GoDotFill } from "react-icons/go";

function Maps() {
  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lng: null,
  });

  const Marker = () => (
    <GoDotFill className="text-2xl text-main border-4 rounded-full border-main-light bg-main-light" />
  );

  useEffect(() => {
    let isMounted = true; // Add a flag to handle component unmounting

    if ("geolocation" in navigator) {
      const positionOptions = {
        enableHighAccuracy: true, // Request high accuracy
        timeout: 10000, // Maximum time to wait for a position
        maximumAge: 0, // Maximum age of cached position
      };
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (isMounted) {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentLocation(newLocation);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
        positionOptions
      );

      return () => {
        isMounted = false;
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    currentLocation.lat !== null && (
      <div className="w-full h-full shadow-md rounded-md overflow-hidden">
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyDbeapt7qyPCPwnOl2FwkyPARyS3dYfYck",
          }}
          center={currentLocation}
          zoom={18}
          draggable={false}
          options={() => {
            return {
              zoomControl: false,
              fullscreenControl: false,
            };
          }}
        >
          <Marker lat={currentLocation.lat} lng={currentLocation.lng} />
        </GoogleMapReact>
      </div>
    )
  );
}

export default Maps;
