import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useFunction } from "../../context/Functions";
import { useStaticAds } from "../../context/StaticAdsContext";
import PageHeader from "../../fragments/PageHeader";
import { format } from "date-fns";
import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import Analytics from "./Analytics";

function AdInfo() {
  const { id } = useParams();
  const { removeUnderscore } = useFunction();
  const { getGeoAd } = useStaticAds();
  const [ad, setAd] = useState();
  const [location, setLocation] = useState();
  useEffect(() => {
    const setup = async () => {
      const response = await getGeoAd(localStorage.getItem("geo_ad_id"));
      if (response) {
        setLocation(response.coords);
        delete response.coords;
        setAd(response);
      }
    };
    setup();
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <PageHeader>{removeUnderscore(id)}</PageHeader>
      <div id={ad?._id} className="flex flex-col xl:flex-row gap-6 items-start">
        {ad && (
          <>
            <section className="bg-white p-6 shaodw rounded w-full space-y-4 xl:w-1/3">
              <h2 className="font-bold text-lg border-b">
                Advertisement Information
              </h2>
              <div className="flex flex-col gap-6 items-start md:flex-row xl:flex-col">
                <img
                  src={ad.image}
                  className="w-full md:w-1/2 lg:w-2/5 xl:w-full mx-auto rounded"
                  alt=""
                  loading="lazy"
                />
                <div className="w-full md:w-1/2 lg:w-3/5 xl:w-full flex flex-col gap-3">
                  <p>
                    <span className="font-semibold">Name: </span>
                    <span>{removeUnderscore(id)}</span>
                  </p>
                  <p className="flex gap-1">
                    <span className="font-semibold">Runtime Date: </span>
                    <span>
                      {format(new Date(ad.runtime_date?.from), "MMMM dd, yyyy")}
                    </span>
                    <span>-</span>
                    <span>
                      {format(new Date(ad.runtime_date?.to), "MMMM dd, yyyy")}
                    </span>
                  </p>
                  {ad?.link && (
                    <p>
                      <span className="font-semibold">
                        Advertisement Link:{" "}
                      </span>
                      <a
                        href={ad.link}
                        rel="noreferrer"
                        target="_blank"
                        className="text-secondary underline"
                      >
                        {ad.link}
                      </a>
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Creation Date: </span>
                    <span>
                      {format(new Date(ad.timeCreated), "MMMM dd, yyyy")}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Location: </span>
                    <span>{ad.location}</span>
                  </p>
                  <div>
                    <APIProvider apiKey="AIzaSyDbeapt7qyPCPwnOl2FwkyPARyS3dYfYck">
                      <div className="h-[300px] md:h-[250px] w-full">
                        <Map
                          center={location}
                          zoom={16}
                          mapId={"b3f282d4d5ce8522"}
                          fullscreenControl={false}
                          streetViewControl={false}
                        >
                          <AdvancedMarker position={location} />
                        </Map>
                      </div>
                    </APIProvider>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-white p-6 shadow rounded w-full space-y-4 xl:w-2/3">
              <h2 className="font-bold text-lg border-b">Analytics</h2>
              <Analytics />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

AdInfo.propTypes = {};

export default AdInfo;
