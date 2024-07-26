/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useStaticAds } from "../context/StaticAdsContext";
import { useFunction } from "../context/Functions";
import PageHeader from "../fragments/PageHeader";
import StaticAdsTable from "../tables/StaticAdsTable";
import {
  Button,
  FileInput,
  Label,
  Modal,
  Pagination,
  TextInput,
  Textarea,
} from "flowbite-react";
import {
  lightButton,
  mainButton,
  modalTheme,
  redMainButton,
  textTheme,
  textareaTheme,
} from "../context/CustomThemes";
import { RiAddFill } from "react-icons/ri";
import FilterDropdown from "../fragments/FilterDropdown";
import { Route, Routes } from "react-router-dom";
import StaticAd from "../components/staticAds/StaticAd";
import { useMemo } from "react";

function StaticAds() {
  const { setIsLoading, setAlert, isLoading } = useAuth();

  const { getStaticAds, createStaticAds, updateStaticAd, deleteStaticAd } =
    useStaticAds();

  const [staticAds, setStaticAds] = useState(null);
  const [adItem, setAdItem] = useState({
    name: "",
    image: "",
    imageFile: "",
    imageThumbnail: "",
    thumbnailFile: "",
    category: "",
    description: "",
    link: "",
  });
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("normal");
  const [filter, setFilter] = useState("all");
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const resetDefaults = () => {
    setModal({
      toggle: false,
      title: null,
    });
    setAdItem({
      name: "",
      image: "",
      imageFile: "",
      imageThumbnail: "",
      thumbnailFile: "",
      category: "",
      description: "",
      link: "",
    });
  };
  const handleAdUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const adData = { ...adItem };
    const files = [adItem.imageFile, adItem.thumbnailFile];
    delete adData.imageFile;
    delete adData.image;
    delete adData.imageThumbnail;
    delete adData.thumbnailFile;
    adData.status = "active";

    const response = await createStaticAds(files, adData);
    resetDefaults();
    console.log(response);
    setIsLoading(false);
    const alert = {
      isOn: true,
      type: "success",
      message: "You have successfully uploaded " + adData.name + ".",
    };
    if (response.acknowledged) {
      setAlert(alert);
    } else {
      alert.type = "failure";
      alert.message = response;
      setAlert(alert);
    }
  };
  const handleAdEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const adData = { ...adItem };
    if (adItem.imageFile) {
      delete adData.image;
    }
    if (adItem.thumbnailFile) {
      delete adData.imageThumbnail;
    }
    resetDefaults();
    const response = await updateStaticAd(adData);
    console.log(response);
    setIsLoading(false);
    const alert = {
      isOn: true,
      type: "success",
      message: "You have successfully updated " + adData.name + ".",
    };
    if (response.acknowledged) {
      setAlert(alert);
    } else {
      alert.type = "failure";
      alert.message = response;
      setAlert(alert);
    }
  };
  const handleAdDelete = async () => {
    const adData = { ...adItem };
    resetDefaults();
    const response = await deleteStaticAd(adData._id);
    console.log(response);
    const alert = {
      isOn: true,
      type: "success",
      message: "You have successfully deleted " + adData.name + ".",
    };
    if (response.acknowledged) {
      setAlert(alert);
    } else {
      alert.type = "failure";
      alert.message = response;
      setAlert(alert);
    }
  };
  useEffect(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  useEffect(() => {
    const setup = async () => {
      const response = await getStaticAds();
      setStaticAds(response);
      setIsLoading(false);
    };
    setup();
  }, [isLoading]);

  const filteredAds = useMemo(() => {
    if (!staticAds) return null;

    const searched =
      search.length > 2
        ? staticAds.filter((media) =>
            media.name.toLowerCase().includes(search.toLowerCase())
          )
        : staticAds;

    return searched;
  }, [staticAds, search]);
  return (
    <>
      <div className="transition-all w-full flex flex-col gap-4">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <PageHeader>Manage Static Ads</PageHeader>
                  <Button
                    className="focus:ring-0 w-fit bg-white"
                    onClick={() =>
                      setModal({
                        toggle: true,
                        title: "create new ad",
                      })
                    }
                    color="transparent"
                    theme={lightButton}
                  >
                    <RiAddFill />
                    <p>New Ad</p>
                  </Button>
                </div>
                {staticAds && (
                  <>
                    <FilterDropdown
                      sortOptions={[
                        "A-Z_asc",
                        "Z-A_desc",
                        "date_asc",
                        "date_desc",
                        "usage_asc",
                        "usage_desc",
                      ]}
                      filterOptions={categories}
                      sort={sort}
                      filter={filter}
                      query={search}
                      searchItem={setSearch}
                      sortItems={setSort}
                      filterItems={setFilter}
                    />
                    <div className="w-full overflow-x-auto rounded-md shadow-md flex flex-col gap-2 max-h-[70vh]">
                      <StaticAdsTable
                        ads={filteredAds}
                        setModal={setModal}
                        setItem={setAdItem}
                      />
                    </div>
                    <Pagination
                      totalPages={pages}
                      currentPage={currentPage}
                      onPageChange={onPageChange}
                    />
                  </>
                )}
              </>
            }
          />
          <Route path="/:id" element={<StaticAd />} />
        </Routes>
      </div>
      <AdModal
        modal={modal}
        resetDefaults={resetDefaults}
        ad={adItem}
        setAdItem={setAdItem}
        handleAdUpload={handleAdUpload}
        handleAdEdit={handleAdEdit}
        handleAdDelete={handleAdDelete}
      />
    </>
  );
}

function AdModal({
  modal,
  resetDefaults,
  ad,
  setAdItem,
  handleAdUpload,
  handleAdEdit,
  handleAdDelete,
}) {
  const { capitalize } = useFunction();

  const onInputChange = (e, key) => {
    setAdItem((current) => {
      return {
        ...current,
        [key]: e.target.value,
      };
    });
  };
  const onAdChange = (evt) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Access image contents from reader result
      const mediaContent = e.target.result;
      const filename = evt.target.files[0].name
        .split(".")
        .slice(0, -1)
        .join(".");

      setAdItem((ad) => {
        return {
          ...ad,
          image: mediaContent,
          name: ad.name.length !== 0 ? ad.name : filename,
          imageFile: evt.target.files[0],
        };
      });
    };
    reader.readAsDataURL(evt.target.files[0]);
  };

  const onThumbnailChange = (evt) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Access image contents from reader result
      const mediaContent = e.target.result;

      setAdItem((ad) => {
        return {
          ...ad,
          imageThumbnail: mediaContent,
          thumbnailFile: evt.target.files[0],
        };
      });
    };
    reader.readAsDataURL(evt.target.files[0]);
  };

  return (
    <Modal
      position="center"
      show={modal.toggle}
      dismissible
      onClose={() => {
        resetDefaults();
      }}
      size="2xl"
      theme={modalTheme}
    >
      {modal.toggle && (
        <>
          <Modal.Header className="border-b-default-dark p-3 px-4">
            {capitalize(modal.title)}
          </Modal.Header>
          <Modal.Body>
            {modal.title.includes("delete") ? (
              <div>
                <p className="text-center w-full">
                  Confirm deletion for <strong>{ad.name}</strong> advertisement?
                </p>
                <Button
                  className="mt-4 w-fit float-right"
                  color="transparent"
                  onClick={() => handleAdDelete()}
                  theme={redMainButton}
                >
                  Delete
                </Button>
              </div>
            ) : (
              <form
                className="flex flex-col gap-2"
                encType="multipart/form-data"
                onSubmit={
                  modal.title.includes("edit") ? handleAdEdit : handleAdUpload
                }
              >
                <div className="flex gap-4">
                  <section className="w-full">
                    <p>Ad Preview</p>
                    {ad.image && (
                      <img
                        src={ad.image}
                        alt=""
                        className="w-full max-w-[175px] rounded-md"
                      />
                    )}
                  </section>
                  <section className="w-full">
                    <p>Thumbnail Preview</p>
                    {ad.imageThumbnail && (
                      <img
                        src={ad.imageThumbnail}
                        alt=""
                        className="w-full max-w-[250px] rounded-md"
                      />
                    )}
                  </section>
                </div>
                <div className="flex gap-4">
                  <div className="w-full">
                    <Label htmlFor="file" value="Ad" />
                    <FileInput
                      id="file"
                      type="text"
                      sizing="sm"
                      accept="image/*"
                      onChange={(e) => onAdChange(e)}
                      theme={textTheme}
                    />
                  </div>
                  <div className="w-full">
                    <Label htmlFor="file_tb" value="Thumbnail" />
                    <FileInput
                      id="file_tb"
                      type="text"
                      sizing="sm"
                      accept="image/*"
                      onChange={(e) => onThumbnailChange(e)}
                      theme={textTheme}
                    />
                  </div>
                </div>
                {["name", "link", "category"].map((item, index) => {
                  return (
                    <div key={index}>
                      <Label htmlFor={item} value={capitalize(item)} />
                      <TextInput
                        id={item}
                        onChange={(e) => onInputChange(e, item)}
                        type="text"
                        sizing="sm"
                        placeholder={
                          item === "link" ? "https://www.staticadlink.com" : ""
                        }
                        value={ad[item]}
                        required
                        theme={textTheme}
                      />
                    </div>
                  );
                })}
                <div>
                  <Label htmlFor="description" value="Description (optional)" />
                  <Textarea
                    id="description"
                    onChange={(e) => onInputChange(e, "description")}
                    type="text"
                    sizing="sm"
                    value={ad.description}
                    theme={textareaTheme}
                  />
                </div>
                <Button
                  className="mt-4 w-full disabled:bg-black"
                  type="submit"
                  color="transparent"
                  theme={mainButton}
                >
                  {modal.title.includes("edit") ? "Save Changes" : "Upload"}
                </Button>
              </form>
            )}
          </Modal.Body>
        </>
      )}
    </Modal>
  );
}
export default StaticAds;
