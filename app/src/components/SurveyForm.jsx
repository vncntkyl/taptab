import React from "react";
import PropTypes from "prop-types";
import { useSurvey } from "../functions/EngagementFunctions";
import useData from "../hooks/useData";
import { useState } from "react";
import { useEffect } from "react";
import classNames from "classnames";
import {
  Button,
  TextInput,
  Textarea,
  Radio,
  Label,
  Checkbox,
} from "flowbite-react";
import {
  mainButton,
  textTheme,
  textareaTheme,
} from "../functions/CustomThemes";
import PageHeader from "./PageHeader";

function SurveyForm(props) {
  const { getSurveys } = useSurvey();
  const [surveys] = useData(getSurveys);
  const [survey, setSurvey] = useState();
  const [step, setStep] = useState(0);

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (surveys.length > 0) {
      const sample = { ...surveys[0] };
      setSurvey([
        {
          title: sample.title,
          description: sample.description,
        },
        ...sample.questions,
      ]);
    }
  }, [surveys]);
  return (
    survey && (
      <form onSubmit={handleSurveySubmit}>
        {survey.map((item, index) => {
          return (
            <div
              key={index}
              className={classNames(
                "flex-col gap-2 text-xl",
                index === step ? "flex" : "hidden"
              )}
            >
              {index === 0 ? (
                <div>
                  <PageHeader>{item.title}</PageHeader>
                  <p className="text-lg px-4">{item.description}</p>
                </div>
              ) : (
                <div className="text-xl flex flex-col gap-2">
                  <p>{`${index}. ${item.question}`}</p>
                  <div>
                    {item.type === "short text" ? (
                      <TextInput theme={textTheme} />
                    ) : item.type === "paragraph" ? (
                      <Textarea theme={textareaTheme} />
                    ) : item.type === "multiple choice" ? (
                      <>
                        <div className="flex flex-col gap-2">
                          {item.answer.map((opt, idx) => {
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-2 pl-8"
                              >
                                <Radio
                                  id={opt.value.toLowerCase()}
                                  name="sample"
                                  value={opt.value.toLowerCase()}
                                  // checked={admin[label] === "male"}
                                  required
                                  // onChange={(e) => handleInputChange(e, label)}
                                />
                                <Label
                                  htmlFor={opt.value.toLowerCase()}
                                  value={opt.value}
                                  className="text-xl"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col gap-2">
                          {item.answer.map((opt, idx) => {
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-2 pl-8"
                              >
                                <Checkbox
                                  id={opt.value.toLowerCase()}
                                  name="sample"
                                  value={opt.value.toLowerCase()}
                                  // checked={admin[label] === "male"}
                                  required
                                  // onChange={(e) => handleInputChange(e, label)}
                                />
                                <Label
                                  htmlFor={opt.value.toLowerCase()}
                                  value={opt.value}
                                  className="text-xl"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              <div>
                <Button
                  className="disabled:bg-black float-right"
                  type="button"
                  color="transparent"
                  theme={mainButton}
                  onClick={() => {
                    if (index < survey.length - 1) {
                      setStep((current) => {
                        return current + 1;
                      });
                    } else {
                      alert("Finished!!!");
                    }
                  }}
                >
                  {index === survey.length - 1 ? "Submit" : "Next"}
                </Button>
              </div>
            </div>
          );
        })}
      </form>
    )
  );
}

SurveyForm.propTypes = {};

export default SurveyForm;
