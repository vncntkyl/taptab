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
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(newLocation);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    currentLocation.lat !== null && (
      <div className="w-full h-[300px] shadow-md rounded-md overflow-hidden">
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyBgdBRaOqyGeoc4E4cWlP8N_wlILEFdgtQ",
          }}
          center={currentLocation}
          zoom={17}
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
