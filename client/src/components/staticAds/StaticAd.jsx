import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../fragments/PageHeader";
import { useFunction } from "../../context/Functions";
import { format } from "date-fns";
import { useStaticAds } from "../../context/StaticAdsContext";
import StaticAdAnalytics from "./StaticAdAnalytics";

function StaticAd() {
  const id = useParams();
  const { removeUnderscore } = useFunction();
  const { getStaticAdInformation } = useStaticAds();
  const [staticAd, setStaticAd] = useState(null);

  const getTime = (seconds) => {
    const milliseconds = Math.floor(seconds * 1000);

    // Format the milliseconds as HH:mm:ss.SSS
    return new Date(milliseconds).toISOString().substring(11, 19);
  };
  const convertSize = (size) => {
    if (size < 1048576) {
      return (size / 1000).toFixed(2) + "KB";
    } else {
      return (size / 1048576).toFixed(2) + "MB";
    }
  };
  useEffect(() => {
    const static_id = localStorage.getItem("static_id");

    if (!static_id) return;

    const setup = async (id) => {
      const response = await getStaticAdInformation(id);
      setStaticAd(response);
    };

    setup(static_id);
  }, []);
  return (
    staticAd && (
      <div>
        <PageHeader>{removeUnderscore(id.id)} Information</PageHeader>
        {staticAd !== null && (
          <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-4">
            <section
              className="bg-white p-2 px-4 pb-4 shadow border flex flex-col gap-4 min-h-[500px]"
              id={staticAd._id}
            >
              <p className="font-bold text-lg border-b">Advertisement Information</p>
              <div className="flex flex-col gap-4">
                <img
                  src={staticAd.signedUrl}
                  className="w-full transition-all max-w-lg"
                ></img>
                <div>
                  <p>
                    <span className="font-semibold">Name: </span>
                    <span>{removeUnderscore(staticAd.name)}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Date Uploaded: </span>
                    <span>
                      {format(
                        new Date(staticAd.timeCreated),
                        "MMMM dd, yyyy hh:mm a"
                      )}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Category: </span>
                    <span>{staticAd.category}</span>
                  </p>
                  <p className="text-justify">
                    <span className="font-semibold">Description: </span>
                    {staticAd.description.length > 0 ? (
                      <span>{staticAd.description}</span>
                    ) : (
                      <>---</>
                    )}
                  </p>
                </div>
              </div>
            </section>
            <section className="flex flex-col gap-2 mr-4 min-h-[500px]">
              {staticAd.views.length === 0 ? (
                <>
                  <div className="relative w-full h-full bg-white shadow border p-2 px-4">
                    <p className="font-bold text-lg border-b">Ad Analytics</p>
                    <p className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-bold text-default-dark-2">
                      No analytics found
                    </p>
                  </div>
                </>
              ) : (
                <StaticAdAnalytics logs={staticAd.views} />
              )}
            </section>
          </div>
        )}
      </div>
    )
  );
}

export default StaticAd;
