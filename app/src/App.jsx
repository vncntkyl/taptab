import { useState } from "react";
import AdsPlayer from "./components/AdsPlayer";
import RelatedAds from "./components/RelatedAds";
import StaticsAds from "./components/StaticsAds";

function App() {
  const [isFullScreen, toggleFullScreen] = useState(false);
  return (
    <div className="bg-gradient-to-br from-main to-white w-screen h-screen flex flex-row gap-2 p-2">
      <section className="w-[1550px] flex flex-col gap-2">
        <AdsPlayer
          isFullScreen={isFullScreen}
          toggleFullScreen={toggleFullScreen}
        />
        <RelatedAds isFullScreen={isFullScreen} />
      </section>
      <section className="bg-default w-[450px] rounded">
        <StaticsAds />
      </section>
    </div>
  );
}

export default App;
