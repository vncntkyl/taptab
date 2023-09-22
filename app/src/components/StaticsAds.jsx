import { useStaticAds } from "../functions/staticAdFunctions";
import useData from "../hooks/useData";

function StaticsAds() {
  const { getStaticAds } = useStaticAds();
  const [data] = useData(getStaticAds);

  return <></>;
}

export default StaticsAds;
