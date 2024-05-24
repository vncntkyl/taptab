import { Modal } from "flowbite-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useStaticAds } from "../../functions/staticAdFunctions";
import { isYesterday } from "date-fns";
function GeoTaggedAds({ coords }) {
  const [advertisement, setAdvertisement] = useState(null);
  const [isDismissible, toggleDismissible] = useState(false);
  const { getGeoTaggedAd } = useStaticAds();

  useEffect(() => {
    const setup = async () => {
      const response = await getGeoTaggedAd({ lat: coords[0], lng: coords[1] });
      if (typeof response !== "string") {
        const hasShown = localStorage.getItem(response._id);
        if (hasShown) {
          if (isYesterday(new Date(hasShown))) {
            setAdvertisement(response);
            toggleDismissible(false);
          }
        } else {
          setAdvertisement(response);
          toggleDismissible(false);
        }
      }
    };
    setup();
  }, [coords]);

  useEffect(() => {
    let doDismiss;
    let timeout;
    if (advertisement) {
      doDismiss = setTimeout(() => {
        toggleDismissible(true);
      }, 10000);
      timeout = setTimeout(() => {
        localStorage.setItem(advertisement._id, new Date());
        setAdvertisement(null);
      }, 15000);
    }

    return () => {
      clearTimeout(doDismiss);
      clearTimeout(timeout);
    };
  }, [advertisement]);
  return (
    <Modal
      show={advertisement !== null}
      className="animate-fade"
      dismissible={isDismissible}
      theme={{
        content: {
          base: "relative h-full w-full p-2 outline-none md:h-auto",
          inner:
            "relative rounded-lg bg-transparent shadow dark:bg-gray-700 flex flex-col max-h-[90dvh]",
        },
      }}
    >
      <Modal.Body theme={{ base: "p-2 outline-none max-w-2xl mx-auto" }}>
        <div className="bg-white p-3 rounded-md">
          <img className="rounded-md" src={advertisement?.image} alt="" />
        </div>
      </Modal.Body>
    </Modal>
  );
}

GeoTaggedAds.propTypes = {
  coords: PropTypes.array,
};
export default GeoTaggedAds;
