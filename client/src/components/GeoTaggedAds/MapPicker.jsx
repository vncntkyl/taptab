import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { Button, Label, TextInput } from "flowbite-react";
import { lightButton } from "../../context/CustomThemes";
import useGeocode from "../../context/useGeocode";
function MapPicker({ center, setCenter, onChange, item }) {
  const zoom = 17;
  const [search, setSearch] = useState("");
  const [midpoint, setMidpoint] = useState(center);
  const handleCenterChange = (position) => {
    const coords = {
      lat: position.map.center.lat(),
      lng: position.map.center.lng(),
    };
    setMidpoint(coords);
  };

  const handleSearch = () => {
    const searchTerm = search;
    if (!searchTerm) return;

    // Create a new instance of Geocoder
    const geocoder = new window.google.maps.Geocoder();

    // Make Geocode request
    geocoder.geocode({ address: searchTerm }, (results, status) => {
      if (
        status === window.google.maps.GeocoderStatus.OK &&
        results.length > 0
      ) {
        const { lat, lng } = results[0].geometry.location;
        setCenter({ lat: lat(), lng: lng() });
        setMidpoint({ lat: lat(), lng: lng() });
      } else {
        console.log(status);
      }
    });
  };
  return (
    <div className="w-full h-full xl:w-1/2 flex flex-col gap-4">
      <div>
        <Label htmlFor="location" value="Location Information" />
        <LocationInfo {...midpoint} item={item} onChange={onChange} />
      </div>
      <div>
        <Label
          htmlFor="search"
          value="Search Location"
          className="font-semibold"
        />
        <div className="flex items-center gap-2">
          <TextInput
            id="search"
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            sizing="md"
            className="w-full"
            placeholder="search location"
            required
          />
          <Button
            theme={lightButton}
            onClick={handleSearch}
            color="transparent"
          >
            Search
          </Button>
        </div>
      </div>
      <div>
        <span className="font-semibold">
          or drag the map to your desired location
        </span>
        <APIProvider apiKey="AIzaSyDpY0KunEUDCKU4HEiArB3GAnixSdkZCZk">
          <div className="h-[400px] w-full">
            {/* {center.lat + ", " + center.lng} */}
            <Map
              onDragend={handleCenterChange}
              onDrag={() => setSearch("")}
              center={center}
              zoom={zoom}
              mapId={"d552bb0d161a38d8"}
              onCenterChanged={(event) => setCenter(event.detail.center)}
              fullscreenControl={false}
              streetViewControl={false}
            >
              <AdvancedMarker position={center} />
            </Map>
          </div>
        </APIProvider>
      </div>
    </div>
  );
}

function LocationInfo({ lat, lng, onChange, item }) {
  const { address, loading, error } = useGeocode(lat, lng);

  useEffect(() => {
    if (address) {
      onChange((current) => {
        return {
          ...current,
          location: address,
        };
      });
    }
  }, [address, lat, lng]);
  return (
    <TextInput
      id="location"
      type="text"
      sizing="md"
      onChange={(e) =>
        onChange((current) => {
          return {
            ...current,
            location: e.target.value,
          };
        })
      }
      // defaultValue={address}
      value={item.location ? item.location : address}
      placeholder={
        loading
          ? "Loading..."
          : error
          ? "Error occured. Please try again"
          : "Enter location name"
      }
      required
    />
  );
}

MapPicker.propTypes = {
  center: PropTypes.object,
  setCenter: PropTypes.func,
  onChange: PropTypes.func,
  item: PropTypes.object,
};
LocationInfo.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  onChange: PropTypes.func,
  item: PropTypes.object,
};
export default MapPicker;
