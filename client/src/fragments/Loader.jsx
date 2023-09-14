import { Spinner } from "flowbite-react";

function Loader() {
  return (
    <div className="absolute z-40 w-full h-full flex items-center justify-center pointer-events-auto bg-[#0000002c]">
      <Spinner size="xl" />
    </div>
  );
}

export default Loader;
