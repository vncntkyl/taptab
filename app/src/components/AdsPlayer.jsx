import { Button } from "flowbite-react";
import { MdFullscreen } from "react-icons/md";
import { iconButton } from "../functions/CustomThemes";
function AdsPlayer() {
  return (
    <section className="transition-all relative bg-matte-black rounded text-white w-full min-h-[65%] max-h-full flex items-center justify-center">
      <div className="bg-black max-w-[80%] h-full aspect-video"></div>
      <Button color="transparent" theme={iconButton} className="absolute bottom-0 right-0 focus:ring-0">
        <MdFullscreen className="text-xl" />
      </Button>
    </section>
  );
}

export default AdsPlayer;
