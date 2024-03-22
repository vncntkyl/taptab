import { Link, Route, Routes } from "react-router-dom";
import PageHeader from "../fragments/PageHeader";
import { Button, Modal, Pagination } from "flowbite-react";
import { RiAddFill } from "react-icons/ri";
import {
  lightButton,
  modalTheme,
  redMainButton,
} from "../context/CustomThemes";
import { useEffect, useState } from "react";
import { useFunction } from "../context/Functions";
import ManageAd from "../components/GeoTaggedAds/ManageAd";
import AdInfo from "../components/GeoTaggedAds/AdInfo";
import { useStaticAds } from "../context/StaticAdsContext";
import GeoTaggedAdsTable from "../tables/GeoTaggedAdsTable";

function GeoTaggedAds() {
  return (
    <>
      <div className="transition-all w-full flex flex-col gap-4">
        <Routes>
          <Route path="/*" element={<Main />} />
          <Route path="/add" element={<ManageAd />} />
          <Route path="/:id" element={<AdInfo />} />
          <Route path="/:id/edit" element={<ManageAd />} />
        </Routes>
      </div>
    </>
  );
}

function Main() {
  const { capitalize } = useFunction();
  const { getGeoAds } = useStaticAds();
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
  });
  const [ads, setAds] = useState(null);
  const [adItem, setAdItem] = useState({
    name: "",
    file: "",
    category: "",
    description: "",
    link: "",
  });

  const resetDefaults = () => {
    setModal({
      toggle: false,
      title: null,
    });
    setAdItem({
      name: "",
      image: "",
      imageFile: "",
      category: "",
      link: "",
    });
  };
  const handleAdDelete = async () => {
    
  };

  useEffect(() => {
    const setup = async () => {
      const response = await getGeoAds();
      setAds(response);
    };
    setup();
  }, []);
  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeader>Manage Geo-Tagged Ads</PageHeader>
        <Button
          as={Link}
          to={`./add`}
          className="focus:ring-0 w-fit bg-white"
          color="transparent"
          theme={lightButton}
        >
          <RiAddFill />
          <p>New Ad</p>
        </Button>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-md shadow-md flex flex-col gap-2 max-h-[70vh]">
        <GeoTaggedAdsTable ads={ads} setModal={setModal} setItem={setAdItem} />
      </div>
      {/* <Pagination
        totalPages={pages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      /> */}
      {/* Modals */}
      <Modal
        position="center"
        show={modal.toggle}
        dismissible
        onClose={() => {
          resetDefaults();
        }}
        size="xl"
        theme={modalTheme}
      >
        <Modal.Header className="border-b-default-dark p-3 px-4">
          {modal.toggle && capitalize(modal.title)}
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className="text-center w-full">
              Confirm deletion for <strong>{adItem.name}</strong> advertisement?
            </p>
            <Button
              className="mt-4 w-fit float-right"
              color="transparent"
              onClick={() => handleAdDelete()}
              theme={redMainButton}
            >
              Delete
            </Button>
          </div>{" "}
        </Modal.Body>
      </Modal>
    </>
  );
}
export default GeoTaggedAds;
