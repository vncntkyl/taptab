import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../contexts/AppContext";
import classNames from "classnames";
import { MdClose } from "react-icons/md";
import QRCode from "qrcode";
import { useVideos } from "../../functions/VideoFunctions";

function SideAdContainer() {
  const { getType } = useVideos();
  const { activeAd, setActiveAd, coordinates, sendAnalytics } = useApp();
  const [removeTransition, toggleRemoveTransition] = useState(false);
  const [qrURL, setQrURL] = useState(null);
  const closeRef = useRef(null);

  const isHidden = useMemo(() => {
    return removeTransition;
  }, [removeTransition]);

  const sendLog = async (doClosed = false) => {
    const driver = JSON.parse(localStorage.getItem("driver"));
    const log = {
      date: new Date().toISOString(),
      driver: driver._id,
      coordinates: coordinates,
      isClosed: doClosed, //true = clicked, false = timer
      isScanned: false,
    };

    const response = await sendAnalytics(activeAd._id, log);

    console.log(response);
  };

  const updateShownAds = () => {
    let shownAds = localStorage.getItem("shownAds");
    shownAds = shownAds ? JSON.parse(shownAds) : [];
    const adIndex = shownAds.findIndex((ad) => ad._id === activeAd._id);
    if (adIndex > -1) {
      shownAds[adIndex].last_shown = new Date().toISOString();
    } else {
      shownAds.push({
        _id: activeAd._id,
        last_shown: new Date().toISOString(),
      });
    }
    localStorage.setItem("shownAds", JSON.stringify(shownAds));
  };

  useEffect(() => {
    const generateQRCode = async () => {
      if (activeAd) {
        const outURL = "http://192.168.10.125:5500/out/index.html?id=";
        const url = await QRCode.toDataURL(
          outURL + activeAd._id + `&type=${activeAd.ad_type}`
        );
        setQrURL(url);
      }
    };

    generateQRCode();

    const timeout = setTimeout(() => {
      if (closeRef.current) {
        if (activeAd.ad_type === "weather") {
          updateShownAds();
        } else if (activeAd.ad_type === "geo") {
          activeAd.last_shown = new Date().toISOString();
          sendLog();
          localStorage.setItem(`geo-${activeAd._id}`, JSON.stringify(activeAd));
        }
        toggleRemoveTransition(true);
      }
    }, 30000);

    return () => clearTimeout(timeout);
  }, [activeAd]);

  return (
    activeAd && (
      <section
        className={classNames(
          "absolute w-full h-full top-0 left-0 bg-white p-2",
          removeTransition ? "animate-fadeOut" : "animate-pop-up",
          isHidden && "opacity-0"
        )}
        onAnimationEnd={(e) => {
          if (e.animationName === "fadeOut") {
            setActiveAd(null);
            toggleRemoveTransition(false);
          }
        }}
      >
        <button
          className="absolute right-0 pt-2 pr-4 z-10"
          ref={closeRef}
          onClick={() => {
            toggleRemoveTransition(true);
            if (activeAd.ad_type === "geo") {
              sendLog(true);
            }
            if (activeAd.ad_type === "weather") {
              updateShownAds();
            }
          }}
        >
          <MdClose className="text-4xl border p-1 text-white bg-[#0000008f] rounded-md" />
        </button>
        {getType(
          activeAd.ad_type === "static"
            ? activeAd.images.find((img) => img.type === "main").signedUrl
            : activeAd.signedUrl
        ) === "image" ? (
          <img
            src={
              activeAd.ad_type === "static"
                ? activeAd.images.find((img) => img.type === "main").signedUrl
                : activeAd.signedUrl
            }
            className="h-full w-full rounded"
            alt=""
          />
        ) : (
          <video autoPlay loop className="h-full w-full rounded">
            <source src={activeAd.signedUrl} />
          </video>
        )}
        {qrURL && (
          <img
            src={qrURL}
            className="absolute bottom-0 right-0 max-w-[150px] rounded-tl-md"
          />
        )}
      </section>
    )
  );
}

SideAdContainer.propTypes = {};

export default SideAdContainer;
