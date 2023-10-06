import { useStaticAds } from "../functions/staticAdFunctions";
import useData from "../hooks/useData";
import PageHeader from "./PageHeader";
import AdContainer from "./StaticAds/AdContainer";

function StaticsAds() {
  const { getStaticAds } = useStaticAds();
  const [data] = useData(getStaticAds, true);

  return (
    <>
      <PageHeader className="px-2 pb-2">Discover More</PageHeader>
      <div className="flex flex-col gap-4 overflow-y-scroll max-h-screen px-2 scroll-smooth">
        {data &&
          data.map((item) => {
            return (
              <div key={item._id} className="min-h-[300px]">
                <AdContainer ad={item} />
              </div>
            );
          })}
      </div>
    </>
  );
}

export default StaticsAds;
