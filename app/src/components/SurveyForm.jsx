import PropTypes from "prop-types";
import { useSurvey } from "../functions/EngagementFunctions";
import { useState } from "react";
import classNames from "classnames";
import { Button, TextInput, Textarea, Label } from "flowbite-react";
import { textTheme, textareaTheme } from "../functions/CustomThemes";
import PageHeader from "./PageHeader";

function SurveyForm({ survey, setSurvey, closeSurvey, toggleSkip }) {
  const { submitSurvey } = useSurvey();
  const [step, setStep] = useState(0);

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    const id = survey[0]._id;
    const answers = survey.slice(1).map((question) => {
      return typeof question.answer === "string"
        ? question.answer
        : question.answer.filter((ans) => ans.selected).map((ans) => ans.value);
    });

    const response = await submitSurvey(id, answers);
    console.log(response);
    if (response.acknowledged) {
      closeSurvey();
    }
  };

  const removeTextSpaces = (text) => {
    return text.split(" ").join("_");
  };

  const validateAnswer = (index) => {
    if (index === 0) return;
    const answers = survey[index].answer;

    if (typeof answers === "string") {
      return answers === "";
    }
    return answers.every((ans) => ans.selected === false);
  };

  return (
    survey && (
      <form
        onSubmit={handleSurveySubmit}
        className="w-full animate-fade duration-500"
      >
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
                  <PageHeader className="text-white">{item.title}</PageHeader>
                  <p className="text-lg px-4">{item.description}</p>
                </div>
              ) : (
                <div className="text-xl flex flex-col gap-2">
                  <p className="font-semibold">{`${index}. ${item.question}`}</p>
                  <div>
                    {item.type === "short text" ? (
                      <TextInput
                        theme={textTheme}
                        onChange={(e) => {
                          const updatedSurvey = survey.map((question, idx) => {
                            if (idx === index) {
                              question.answer = e.target.value;
                            }
                            return question;
                          });
                          setSurvey(updatedSurvey);
                        }}
                      />
                    ) : item.type === "paragraph" ? (
                      <Textarea
                        theme={textareaTheme}
                        onChange={(e) => {
                          const updatedSurvey = survey.map((question, idx) => {
                            if (idx === index) {
                              question.answer = e.target.value;
                            }
                            return question;
                          });
                          setSurvey(updatedSurvey);
                        }}
                      />
                    ) : item.type === "multiple choice" ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          {item.answer.map((opt, idx) => {
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-center gap-2"
                              >
                                <input
                                  type="radio"
                                  name={`question${index}_choice${idx}`}
                                  id={removeTextSpaces(opt.value).toLowerCase()}
                                  value={opt.value}
                                  checked={opt.selected}
                                  onChange={(e) => {
                                    const updatedSurvey = survey.map(
                                      (question, idx) => {
                                        if (idx === index) {
                                          const updatedAnswers =
                                            question.answer.map((ans) => {
                                              return {
                                                ...ans,
                                                selected:
                                                  ans.value === e.target.value,
                                              };
                                            });
                                          return {
                                            ...question,
                                            answer: updatedAnswers,
                                          };
                                        }
                                        return question;
                                      }
                                    );
                                    setSurvey(updatedSurvey);
                                  }}
                                  className="peer hidden"
                                />
                                <Label
                                  htmlFor={removeTextSpaces(
                                    opt.value
                                  ).toLowerCase()}
                                  value={opt.value}
                                  className="text-2xl font-bold text-white capitalize p-2 px-4 transition-all border-2 border-gray-500 rounded-md w-full text-center peer-checked:bg-gray-500"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          {item.answer.map((opt, idx) => {
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  name={`question${index}_choice${idx}`}
                                  id={removeTextSpaces(opt.value).toLowerCase()}
                                  value={opt.value}
                                  checked={opt.selected}
                                  className="peer hidden"
                                  onChange={(e) => {
                                    const updatedSurvey = survey.map(
                                      (question, idx) => {
                                        if (idx === index) {
                                          const updatedAnswers =
                                            question.answer.map((ans) => {
                                              if (
                                                ans.value === e.target.value
                                              ) {
                                                return {
                                                  ...ans,
                                                  selected: e.target.checked,
                                                };
                                              }
                                              return ans;
                                            });
                                          return {
                                            ...question,
                                            answer: updatedAnswers,
                                          };
                                        }
                                        return question;
                                      }
                                    );
                                    setSurvey(updatedSurvey);
                                  }}
                                />
                                <Label
                                  htmlFor={removeTextSpaces(
                                    opt.value
                                  ).toLowerCase()}
                                  value={opt.value}
                                  className="text-2xl font-bold text-white capitalize p-2 px-4 transition-all border-2 border-gray-500 rounded-md w-full text-center peer-checked:bg-gray-500"
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
              <div className="flex justify-end gap-2">
                {index > 1 && (
                  <Button
                    className="disabled:bg-black float-right bg-secondary-dark px-4"
                    type="button"
                    color="transparent"
                    onClick={() => {
                      if (index < survey.length) {
                        setStep((current) => {
                          return current - 1;
                        });
                      }
                    }}
                  >
                    <p className="text-xl">Back</p>
                  </Button>
                )}
                <Button
                  className="disabled:bg-black float-right bg-secondary-dark px-4"
                  type={index === survey.length - 1 ? "submit" : "button"}
                  color="transparent"
                  onClick={() => {
                    toggleSkip(false);
                    if (index < survey.length - 1) {
                      if (validateAnswer(index)) {
                        alert(
                          "Please answer the question to move forward. Thank you."
                        );
                      } else {
                        setStep((current) => {
                          return current + 1;
                        });
                      }
                    }
                  }}
                >
                  <p className="text-xl">
                    {index === survey.length - 1 ? "Submit" : "Next"}
                  </p>
                </Button>
              </div>
            </div>
          );
        })}
      </form>
    )
  );
}

SurveyForm.propTypes = {
  survey: PropTypes.array,
  setSurvey: PropTypes.func,
  closeSurvey: PropTypes.func,
  toggleSkip: PropTypes.func,
};

export default SurveyForm;
