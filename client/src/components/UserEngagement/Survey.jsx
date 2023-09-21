import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Settings from "./Surveys/Settings";
import PageHeader from "../../fragments/PageHeader";
import { Badge, Button, Modal, TextInput } from "flowbite-react";
import {
  bottomOnlyBorderText,
  iconButton,
  modalTheme,
  redMainButton,
} from "../../context/CustomThemes";
import SurveyTypeDropdown from "../../fragments/SurveyTypeDropdown";
import Fields from "./Surveys/Fields";
import Options from "./Surveys/Options";
import { MdSave } from "react-icons/md";

function Survey(props) {
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
    id: null,
  });
  const [settings, setSettings] = useState({
    title: "",
    description: "",
    date_validity: "",
  });
  const [contents, setContents] = useState([
    {
      type: "short text",
      question: "",
      answer: "",
      required: true,
    },
  ]);
  const [status, setStatus] = useState("Changes are not yet saved");
  const triggerModal = (optionName, index) => {
    const updatedContent = [...contents];
    updatedContent[index].type = optionName;

    if (optionName === "multiple choice" || optionName === "checkboxes") {
      updatedContent[index].answer = [
        { value: "option 1", selected: false },
        { value: "option 2", selected: false },
      ];
    } else {
      updatedContent[index].answer = "";
    }
    setContents(updatedContent);
  };
  const updateQuestion = (e) => {
    const index = e.target.id;
    const updatedContent = [...contents];
    updatedContent[index].question = e.target.value;

    setContents(updatedContent);
  };
  const toggleRequired = (index) => {
    const updatedContent = [...contents];
    updatedContent[index].required = !updatedContent[index].required;

    setContents(updatedContent);
  };
  const addDeleteField = () => {
    const index = modal.id;
    if (modal.toggle) {
      //DELETE FIELD
      setModal({
        toggle: false,
        title: null,
        id: null,
      });

      //delete the field with the index of a usestate
      const updatedContents = [...contents];
      updatedContents.splice(index, 1);
      setContents(updatedContents);
    } else {
      //ADD FIELD
      const updatedContents = [...contents];
      updatedContents.splice(index + 1, 0, {
        type: "short text",
        question: "",
        answer: "",
        required: true,
      });
      setContents(updatedContents);
    }
  };
  function areObjectsEqual(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }

    for (const key in obj1) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
        const value1 = obj1[key];
        const value2 = obj2[key];

        if (typeof value1 === "object" && typeof value2 === "object") {
          if (!areObjectsEqual(value1, value2)) {
            return false;
          }
        } else if (value1 !== value2) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  }
  const saveProgress = () => {
    const progress = JSON.stringify(contents);
    localStorage.setItem("survey_progress", progress);
    const settings = JSON.stringify(contents);
    localStorage.setItem("settings_progress", settings);
  };

  useEffect(() => {
    if (localStorage.getItem("survey_progress")) {
      setContents(JSON.parse(localStorage.getItem("survey_progress")));
    }
    if (localStorage.getItem("settings_progress")) {
      setSettings(JSON.parse(localStorage.getItem("settings_progress")));
    }
  }, []);

  useEffect(() => {
    const checkProgress = () => {
      if (
        localStorage.getItem("survey_progress") ||
        localStorage.getItem("settings_progress")
      ) {
        if (contents.length > 0) {
          if (
            !areObjectsEqual(
              JSON.parse(localStorage.getItem("survey_progress")),
              contents
            ) ||
            !areObjectsEqual(
              JSON.parse(localStorage.getItem("settings_progress")),
              settings
            )
          ) {
            setStatus("Changes are not yet saved");
          } else {
            setStatus("Progress saved");
          }
        }
      }
    };
    checkProgress();
    const realtimeData = setInterval(checkProgress, 1000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [contents, settings]);

  useEffect(() => {
    // Execute the save function after 5 seconds when changes are not yet saved
    if (contents.length > 0) {
      if (
        status === "Changes are not yet saved" ||
        status === "Saving changes..."
      ) {
        const saveTimer = setTimeout(() => {
          setStatus("Saving changes...");
          // Call your save function here
          localStorage.setItem("survey_progress", JSON.stringify(contents));
          localStorage.setItem("settings_progress", JSON.stringify(settings));
        }, 1000);

        return () => clearTimeout(saveTimer);
      }
    }
  }, [status, contents, settings]);
  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center pb-2">
          <PageHeader className="mr-auto">Create New Survey</PageHeader>
          <Badge
            color={status === "Progress saved" ? "success" : "warning"}
            className="w-fit  font-semibold"
            size="xs"
          >
            {status}
          </Badge>
          {status === "Changes are not yet saved" && (
            <Button
              className="focus:ring-0 w-fit bg-white"
              color="transparent"
              size="sm"
              theme={iconButton}
              onClick={saveProgress}
            >
              <MdSave className="text-lg text-gray-600" />
              Save Progress
            </Button>
          )}
        </div>
        <form className="flex flex-col gap-2">
          <Settings settings={settings} setSettings={setSettings} />
          <h4 className="text-secondary-dark font-bold text-sm uppercase mr-auto">
            Questions
          </h4>
          <section className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              {contents.map((content, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white flex flex-col gap-2 p-2 rounded shadow animate-fade"
                  >
                    <div className="flex items-center gap-1">
                      <p>{index + 1}.</p>
                      <TextInput
                        theme={bottomOnlyBorderText}
                        id={index}
                        className="ring-none outline-none focus:outline-none w-full"
                        placeholder="Enter your question here"
                        onChange={updateQuestion}
                        value={content.question}
                      />
                      <SurveyTypeDropdown
                        index={index}
                        triggerModal={triggerModal}
                        type={content.type}
                      />
                    </div>
                    <Fields content={content} />
                    <Options
                      content={content}
                      index={index}
                      setModal={setModal}
                      addField={addDeleteField}
                      toggleRequired={toggleRequired}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </form>
      </div>
      <Modal
        position="center"
        show={modal.toggle}
        dismissible
        onClose={() => {
          setModal({
            toggle: false,
            title: null,
            id: null,
          });
        }}
        size="md"
        theme={modalTheme}
      >
        <Modal.Header className="border-b-default-dark p-3 px-4 capitalize">
          {modal.toggle && modal.title}
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className="text-center w-full">
              Are you sure you want to delete this field?
            </p>
            <Button
              className="mt-4 w-fit float-right"
              color="transparent"
              onClick={() => addDeleteField(modal.id)}
              theme={redMainButton}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

Survey.propTypes = {};

export default Survey;
