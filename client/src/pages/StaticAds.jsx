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

function StaticAds() {
  const { setIsLoading, setAlert } = useAuth();
  const { getStaticAds, createStaticAds, updateStaticAd, deleteStaticAd } =
    useStaticAds();
  const { capitalize } = useFunction();

  const [staticAds, setStaticAds] = useState(null);
  const [adItem, setAdItem] = useState({
    name: "",
    image: "",
    imageFile: "",
    category: "",
    description: "",
    link: "",
  });
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
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
      description: "",
      link: "",
    });
  };

  const handleAdUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const adData = { ...adItem };
    const file = adItem.imageFile;
    delete adData.imageFile;
    delete adData.image;
    adData.status = "active";
    adData.views = 0;

    resetDefaults();
    const response = await createStaticAds(file, adData);
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
  const onInputChange = (e, key) => {
    setAdItem((current) => {
      return {
        ...current,
        [key]: e.target.value,
      };
    });
  };
  const onFileChange = (evt) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Access image contents from reader result
      const mediaContent = e.target.result;
      const filename = evt.target.files[0].name
        .split(".")
        .slice(0, -1)
        .join(".");
      if (modal.toggle && modal.title.includes("edit")) {
        setAdItem((ad) => {
          return {
            ...ad,
            image: mediaContent,
            imageFile: evt.target.files[0],
          };
        });
      } else {
        setAdItem((ad) => {
          return {
            ...ad,
            image: mediaContent,
            name: filename,
            imageFile: evt.target.files[0],
          };
        });
      }
    };
    reader.readAsDataURL(evt.target.files[0]);
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
    const realtimeData = setInterval(setup, 3000);
    return () => {
      clearInterval(realtimeData);
    };
  }, []);
  return (
    <>
      <div className="transition-all w-full flex flex-col gap-4">
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
          <div className="w-full overflow-x-auto rounded-md shadow-md">
            <StaticAdsTable
              ads={staticAds}
              setModal={setModal}
              setItem={setAdItem}
            />
          </div>
        )}
      </div>
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
          {modal.toggle && modal.title.includes("delete") ? (
            <div>
              <p className="text-center w-full">
                Confirm deletion for <strong>{adItem.name}</strong>{" "}
                advertisement?
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
                modal.toggle && modal.title.includes("edit")
                  ? handleAdEdit
                  : handleAdUpload
              }
            >
              <div>
                {adItem.image && (
                  <>
                    <img
                      src={adItem.image}
                      alt=""
                      className="w-full max-w-[300px]"
                    />
                    <br />
                  </>
                )}
                <Label htmlFor="file" value="Upload Image" />
                <FileInput
                  id="file"
                  type="text"
                  sizing="sm"
                  accept="image/*"
                  onChange={(e) => onFileChange(e)}
                  theme={textTheme}
                />
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
                      value={adItem[item]}
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
                  value={adItem.description}
                  theme={textareaTheme}
                />
              </div>
              <Button
                className="mt-4 w-full disabled:bg-black"
                type="submit"
                color="transparent"
                theme={mainButton}
              >
                {modal.toggle && modal.title.includes("edit")
                  ? "Save Changes"
                  : "Upload"}
              </Button>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default StaticAds;
