/* eslint-disable react/prop-types */
import PageHeader from "../fragments/PageHeader";
import {
  Button,
  Datepicker,
  FileInput,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import {
  lightButton,
  mainButton,
  modalTheme,
  redMainButton,
  selectTheme,
  textTheme,
} from "../context/CustomThemes";
import { useEffect, useState } from "react";
import { useFunction } from "../context/Functions";
import { useWeather } from "../context/WeatherAdsContext";
import { RiAddFill } from "react-icons/ri";
import WeatherAdsTable from "../tables/WeatherAdsTable";
import { format } from "date-fns";
function WeatherAds() {
  const { capitalize } = useFunction();
  const {
    getWeatherAds,
    defaultInformation,
    addWeatherAd,
    updateWeatherAd,
    deleteWeatherAd,
  } = useWeather();
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
  });
  const [ads, setAds] = useState(null);
  const [item, setItem] = useState(defaultInformation);
  const resetDefaults = () => {
    setModal({
      toggle: false,
      title: null,
    });
    setItem(defaultInformation);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const data = { ...item };
    const file = data.file;
    delete data.file;
    delete data.image;

    try {
      const response = await addWeatherAd(data, file);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = { ...item };
    const updatedData = {
      name: data.name,
      weather: data.weather,
      trigger_temperature: data.trigger_temperature,
      trigger_unit: data.trigger_unit,
      runtime_date: data.runtime_date,
      filename: data.fileName,
    };
    const response = await updateWeatherAd(
      data._id,
      updatedData,
      data.file || null
    );
    console.log(response);
  };
  const handleDelete = async (id) => {
    const response = await deleteWeatherAd(id);
    console.log(response);
  };
  useEffect(() => {
    const setup = async () => {
      const response = await getWeatherAds();
      console.log(response);
      setAds(response);
    };
    setup();
  }, []);

  return (
    <>
      <div className="transition-all w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <PageHeader>Manage Weather Targeted Ads</PageHeader>
          <Button
            className="focus:ring-0 w-fit bg-white"
            color="transparent"
            theme={lightButton}
            onClick={() =>
              setModal({
                title: "New Ad",
                toggle: true,
              })
            }
          >
            <RiAddFill />
            <p>New Ad</p>
          </Button>
        </div>
        <div className="w-full overflow-x-auto rounded-md shadow-md flex flex-col gap-2 max-h-[70vh]">
          <WeatherAdsTable ads={ads} setModal={setModal} setItem={setItem} />
        </div>
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
          <ModalContent
            title={modal.title}
            item={item}
            setItem={setItem}
            functions={[handleAdd, handleUpdate, handleDelete]}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
const ModalContent = ({ title, item, setItem, functions }) => {
  const [handleAdd, handleUpdate, handleDelete] = functions;
  title = title.toLowerCase();
  if (title.includes("new")) {
    return <ManageModal item={item} setItem={setItem} onSubmit={handleAdd} />;
  } else if (title.includes("edit")) {
    return (
      <ManageModal
        item={item}
        setItem={setItem}
        id={item._id}
        onSubmit={handleUpdate}
      />
    );
  } else {
    return <DeleteModal item={item} onClick={handleDelete} />;
  }
};

function DeleteModal({ item, onClick }) {
  return (
    item?._id && (
      <div>
        <p className="text-center w-full">
          Confirm deletion of <strong>{item.name}</strong>?
        </p>
        <Button
          className="mt-4 w-fit float-right"
          color="transparent"
          onClick={() => onClick(item._id)}
          theme={redMainButton}
        >
          Delete
        </Button>
      </div>
    )
  );
}

function ManageModal({ item, setItem, id, onSubmit }) {
  const onChange = (e) => {
    setItem((prev) => {
      return {
        ...prev,
        [e.target.id]: e.target.value,
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
      if (id) {
        setItem((ad) => {
          return {
            ...ad,
            image: mediaContent,
            file: evt.target.files[0],
          };
        });
      } else {
        setItem((ad) => {
          return {
            ...ad,
            image: mediaContent,
            name: filename,
            file: evt.target.files[0],
          };
        });
      }
    };
    reader.readAsDataURL(evt.target.files[0]);
  };
  const onDateChange = (e) => {
    const key = e.target.id.split("-")[1];
    setItem((prev) => {
      return {
        ...prev,
        runtime_date: {
          ...prev.runtime_date,
          [key]: new Date(e.target.value),
        },
      };
    });
  };
  return (
    <form
      encType="multipart/form-data"
      className="flex flex-col gap-6 pb-2"
      onSubmit={onSubmit}
    >
      <div>
        {item.image && <img src={item.image} />}
        <Label htmlFor="file" value="Image" className="capitalize" />
        <FileInput
          required={!id}
          id="file"
          type="text"
          sizing="lg"
          accept="image/*"
          onChange={onFileChange}
          theme={textTheme}
        />
      </div>
      <div>
        <Label htmlFor="name" value="Name" className="capitalize" />
        <TextInput
          id="name"
          theme={textTheme}
          value={item.name}
          onChange={onChange}
        />
      </div>
      <section className="flex flex-col lg:flex-row gap-4">
        <div className="w-1/2">
          <Label htmlFor="weather" value="Weather" className="capitalize" />
          <Select id="weather" onChange={onChange} theme={selectTheme}>
            <option value="sunny">Sunny</option>
            <option value="rainy">Rainy</option>
            <option value="cloudy">Cloudy</option>
          </Select>
        </div>
        <section className="flex gap-4 w-1/2">
          <div className="w-[50%]">
            <Label
              htmlFor="trigger_temperature"
              value="Temperature"
              className="capitalize"
            />
            <TextInput
              type="number"
              id="trigger_temperature"
              theme={textTheme}
              value={item.trigger_temperature}
              onChange={onChange}
            />
          </div>
          <div className="w-[50%]">
            <Label htmlFor="trigger_unit" value="Unit" className="capitalize" />
            <Select id="trigger_unit" onChange={onChange} theme={selectTheme}>
              <option value="C">Celsius (C)</option>
              <option value="F">Farenheit (F)</option>
            </Select>
          </div>
        </section>
      </section>

      <section className="flex gap-4">
        <div className="w-1/2 flex flex-col gap-1">
          <Label
            htmlFor="runtime_date-from"
            value="From"
            className="capitalize"
          />
          <input
            type="date"
            id="runtime_date-from"
            onChange={onDateChange}
            className="border-gray-300 bg-gray-50 focus:border-cyan-400"
            value={format(new Date(item.runtime_date.from), "yyyy-MM-dd")}
            min={format(new Date(), "yyyy-MM-dd")}
          />
        </div>
        <div className="w-1/2 flex flex-col gap-1">
          <Label htmlFor="runtime_date-to" value="To" className="capitalize" />
          <input
            type="date"
            id="runtime_date-to"
            onChange={onDateChange}
            className="border-gray-300 bg-gray-50 focus:border-cyan-400"
            value={format(new Date(item.runtime_date.to), "yyyy-MM-dd")}
            min={format(new Date(item.runtime_date.from), "yyyy-MM-dd")}
          />
        </div>
      </section>
      <Button
        className="w-full disabled:bg-black"
        type="submit"
        color="transparent"
        theme={mainButton}
      >
        {id ? "Save Changes" : "Upload"}
      </Button>
    </form>
  );
}

export default WeatherAds;
