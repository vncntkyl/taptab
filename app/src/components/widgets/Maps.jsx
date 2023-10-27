import { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { GoDotFill } from "react-icons/go";

function Maps() {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 14.5562764,
    lng: 121.004703,
  });

  const [zoom, setZoom] = useState(17);

  const Marker = () => (
    <GoDotFill className="text-2xl text-main border-4 rounded-full border-main-light bg-main-light" />
  );

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(newLocation);
      });
    }
  };

  useEffect(() => {
    updateLocation();
    const locationInterval = setInterval(updateLocation, 1000);

    return () => {
      clearInterval(locationInterval);
    };
  }, []);

  const handleZoomChange = (newZoom) => {
    setZoom(newZoom);
  };

  return (
    <div className="w-full h-[250px] shadow-md rounded-md overflow-hidden">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyBgdBRaOqyGeoc4E4cWlP8N_wlILEFdgtQ",
        }}
        center={currentLocation}
        zoom={zoom}
        onChange={({ zoom }) => {
          handleZoomChange(zoom);
        }}
      >
        <Marker lat={currentLocation.lat} lng={currentLocation.lng} />
      </GoogleMapReact>
    </div>
  );
}

export default Maps;
