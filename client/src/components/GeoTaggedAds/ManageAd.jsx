import { useParams } from "react-router-dom";
import PageHeader from "../../fragments/PageHeader";
import { useEffect, useState } from "react";
import {
  Button,
  Datepicker,
  FileInput,
  Label,
  TextInput,
} from "flowbite-react";
import { useFunction } from "../../context/Functions";
import { mainButton, textTheme } from "../../context/CustomThemes";
import MapPicker from "./MapPicker";
import { useStaticAds } from "../../context/StaticAdsContext";
import { useAuth } from "../../context/AuthContext";

function ManageAd() {
  const currentDate = new Date();
  const { id } = useParams();
  const { capitalize } = useFunction();
  const { createGeoTaggedAds, getGeoAd } = useStaticAds();
  const { setAlert } = useAuth();
  const [ad, setAd] = useState({
    image: "",
    file: "",
    name: "",
    link: "",
  });
  const [location, setLocation] = useState({
    lat: 14.556289599266941,
    lng: 121.00485772896641,
  });
  const [dates, setDates] = useState();

  const handleAdEdit = async () => {};

  const handleAdUpload = async () => {
    const geoAd = { ...ad, coords: location, runtime_date: dates };
    delete geoAd.image;

    const response = await createGeoTaggedAds(geoAd);
    console.log(response);

    if (response?.acknowledged) {
      setAlert({
        isOn: true,
        type: "success",
        message: "New advertisement created!",
      });
    } else {
      setAlert({
        isOn: true,
        type: "warning",
        message: "An error has occured",
      });
    }
  };

  const onInputChange = (e, key) => {
    setAd((current) => {
      return {
        ...current,
        [key]: e.target.value,
      };
    });
  };
  const onFileChange = (evt) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Access image contents from reader result
      const mediaContent = e.target.result;
      const filename = evt.target.files[0].name
        .split(".")
        .slice(0, -1)
        .join(".");
      if (id) {
        setAd((ad) => {
          return {
            ...ad,
            image: mediaContent,
            file: evt.target.files[0],
          };
        });
      } else {
        setAd((ad) => {
          return {
            ...ad,
            image: mediaContent,
            name: filename,
            file: evt.target.files[0],
          };
        });
      }
    };
    reader.readAsDataURL(evt.target.files[0]);
  };

  useEffect(() => {
    const setup = async () => {
      if (id) {
        const response = await getGeoAd(localStorage.getItem("geo_ad_id"));
        if (response) {
          setLocation(response.coords);
          setDates(response.runtime_date);
          delete response.coords;
          delete response.runtime_date;
          setAd(response);
        }
      } else {
        setDates({ from: currentDate, to: new Date() });
      }
    };
    setup();
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <PageHeader>{id ? `Edit ${id}` : `Create New Ad`}</PageHeader>
        <Button
          className=""
          type="submit"
          color="transparent"
          onClick={id ? handleAdEdit : handleAdUpload}
          theme={mainButton}
        >
          {id ? "Save Changes" : "Save"}
        </Button>
      </div>
      <div className="bg-white p-6 shadow rounded">
        <form className="flex flex-col gap-6" encType="multipart/form-data">
          <div className="flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2 flex flex-col gap-4">
              <div>
                <Label htmlFor="file" value="Upload Ad" />
                <FileInput
                  id="file"
                  sizing="lg"
                  accept="image/*;video/*"
                  onChange={(e) => onFileChange(e)}
                  theme={textTheme}
                />
              </div>
              {["name", "link"].map((item, index) => {
                return (
                  <div key={index}>
                    <Label htmlFor={item} value={capitalize(item)} />
                    <TextInput
                      id={item}
                      onChange={(e) => onInputChange(e, item)}
                      type="text"
                      sizing="md"
                      color="gray"
                      placeholder={
                        item === "link" ? "https://www.adlink.com" : ""
                      }
                      value={ad[item]}
                      required
                    />
                  </div>
                );
              })}
              {dates && (
                <div className="flex flex-col gap-2">
                  <Label value="Runtime Date" className="font-semibold" />
                  <div className="flex items-center gap-4">
                    <Datepicker
                      className="w-1/2"
                      onSelectedDateChanged={(date) =>
                        setDates((prev) => ({ ...prev, from: date }))
                      }
                      defaultDate={new Date(dates.from)}
                      minDate={new Date()}
                    />
                    <span>-</span>
                    <Datepicker
                      className="w-1/2"
                      onSelectedDateChanged={(date) =>
                        setDates((prev) => ({ ...prev, to: date }))
                      }
                      // value={format(new Date(dates.to), "MMMM dd, yyyy")}
                      defaultDate={new Date(dates.to)}
                    />
                  </div>
                </div>
              )}
              {ad?.image && (
                <div>
                  <span className="font-semibold">Media Preview:</span>
                  {ad.image.split(":")[1].substring(0, 5) === "image" ? (
                    <img
                      src={ad.image}
                      alt=""
                      className="w-auto max-h-[300px]"
                    />
                  ) : (
                    <video autoPlay loop className="max-h-[400px]">
                      <source src={ad.image} type="video/mp4" />
                    </video>
                  )}
                </div>
              )}
            </div>
            <MapPicker
              center={location}
              setCenter={setLocation}
              onChange={setAd}
              item={ad}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManageAd;
