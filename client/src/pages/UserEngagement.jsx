import PageHeader from "../fragments/PageHeader";
import { Button, Tabs } from "flowbite-react";
import { lightButton, tabTheme } from "../context/CustomThemes";
import { RiAddFill, RiSurveyFill } from "react-icons/ri";
import { MdFeedback } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, Route, Routes } from "react-router-dom";
import Survey from "../components/UserEngagement/Survey";

function UserEngagement() {
  const [modal, setModal] = useState({
    toggle: false,
    title: null,
  });
  const [activeTab, setTab] = useState(0);
  const tabs = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("activeTab")) {
      const tab = parseInt(localStorage.getItem("activeTab"));
      setTab(tab);
      tabs.current?.setActiveTab(tab);
    }
  }, [window.location.pathname]);
  return (
    <>
      <div className="transition-all w-full flex flex-col gap-2">
        <Routes>
          <Route
            exact
            path="/"
            element={
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
                    <ButtonLink name="New Survey" link="./new_survey" />
                    Surveys Table
                  </Tabs.Item>
                  <Tabs.Item title="Forms" icon={MdFeedback}>
                    <ButtonLink name="New Form" link="./new_form" />
                    Forms Table
                  </Tabs.Item>
                </Tabs.Group>
              </>
            }
          />
          <Route path="/:id" element={<>New Survey</>} />
          <Route path="/new_survey" element={<Survey />} />
          <Route path="/new_form" element={<>New Forms</>} />
        </Routes>
      </div>
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
