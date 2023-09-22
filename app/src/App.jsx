import AdsPlayer from "./components/AdsPlayer";
import RelatedAds from "./components/RelatedAds";
import StaticsAds from "./components/StaticsAds";

function App() {
  return (
    <div className="bg-gradient-to-br from-main to-white w-screen h-screen flex flex-row gap-2 p-2">
      <section className="w-[75%] flex flex-col gap-2">
        <AdsPlayer />
        <RelatedAds />
      </section>
      <section className="bg-default w-[25%] rounded">
        <StaticsAds />
      </section>
    </div>
  );
}

export default App;
