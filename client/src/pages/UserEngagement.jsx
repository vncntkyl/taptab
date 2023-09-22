import PageHeader from "../fragments/PageHeader";
import { Button, Modal, Tabs } from "flowbite-react";
import {
  lightButton,
  modalTheme,
  redMainButton,
  tabTheme,
} from "../context/CustomThemes";
import { RiAddFill, RiSurveyFill } from "react-icons/ri";
import { MdFeedback } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, Route, Routes } from "react-router-dom";
import Survey from "../components/UserEngagement/Survey";
import SurveyTable from "../tables/SurveysTable";
import { useEngagements } from "../context/EngagementContext";
import { useAuth } from "../context/AuthContext";
import { values as useFunction } from "../context/Functions";

function UserEngagement() {
  const { retrieveEngagements, deleteSurvey } = useEngagements();
  const { capitalize } = useFunction();
  const { setIsLoading, setAlert } = useAuth();
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
  });
  const [activeTab, setTab] = useState(0);
  const tabs = useRef(null);

  const [engagements, setEngagements] = useState();
  const [survey, setSurvey] = useState(null);

  const resetDefaults = () => {
    setModal({
      toggle: false,
      title: null,
    });
    setSurvey(null);
  };

  const handleDelete = async () => {
    const item = { ...survey };
    resetDefaults();
    const response = await deleteSurvey(item._id);
    console.log(response);
    const alert = {
      isOn: true,
      type: "success",
      message: "You have successfully deleted " + item.title + ".",
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
    if (localStorage.getItem("activeTab")) {
      const tab = parseInt(localStorage.getItem("activeTab"));
      setTab(tab);
      tabs.current?.setActiveTab(tab);
    }
  }, [window.location.pathname]);

  useEffect(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  useEffect(() => {
    const setup = async () => {
      const response = await retrieveEngagements();
      setEngagements(response);
      setIsLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 3000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [retrieveEngagements, setIsLoading]);
  return (
    <>
      <div className="transition-all w-full flex flex-col gap-2">
        <Routes>
          <Route
            exact
            path="/"
            element={
              engagements ? (
                <>
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <PageHeader>Manage Surveys and Forms</PageHeader>
                  </div>
                  <Tabs.Group
                    ref={tabs}
                    style="default"
                    className="w-full bg-white p-2 border-b-2 border-default"
                    theme={tabTheme}
                    onActiveTabChange={(e) => {
                      setTab(e);
                      localStorage.setItem("activeTab", e);
                    }}
                  >
                    <Tabs.Item title="Surveys" icon={RiSurveyFill}>
                      <div className="flex flex-col gap-2">
                        <ButtonLink name="New Survey" link="./new_survey" />
                        <SurveyTable
                          data={engagements.filter(
                            (eng) => eng.type === "survey"
                          )}
                          setItem={setSurvey}
                          setModal={setModal}
                        />
                      </div>
                    </Tabs.Item>
                    <Tabs.Item title="Forms" icon={MdFeedback}>
                      <ButtonLink name="New Form" link="./new_form" />
                      Forms Table
                    </Tabs.Item>
                  </Tabs.Group>
                </>
              ) : (
                <></>
              )
            }
          />
          <Route
            path="/:_id"
            element={survey ? <Survey data={survey} /> : <>Forms</>}
          />
          <Route path="/new_survey" element={<Survey />} />
          <Route path="/new_form" element={<>New Forms</>} />
        </Routes>
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
          {modal.toggle && (
            <div>
              <p className="text-center w-full">
                Confirm deletion for <strong>{survey.title}</strong> survey?
              </p>
              <Button
                className="mt-4 w-fit float-right"
                color="transparent"
                onClick={() => handleDelete()}
                theme={redMainButton}
              >
                Delete
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

const ButtonLink = ({ name, link }) => {
  return (
    <Button
      as={Link}
      to={link}
      className="focus:ring-0 w-fit bg-white"
      color="transparent"
      theme={lightButton}
      onClick={() => {
        localStorage.removeItem("settings_progress");
        localStorage.removeItem("survey_progress");
      }}
    >
      <RiAddFill />
      <p>{name}</p>
    </Button>
  );
};

ButtonLink.propTypes = {
  name: PropTypes.string,
  link: PropTypes.string,
};
export default UserEngagement;
