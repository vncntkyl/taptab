import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useEngagements } from "../../context/EngagementContext";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../fragments/PageHeader";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

function SurveyResponses(props) {
  const { retrieveResponses } = useEngagements();
  const survey = JSON.parse(localStorage.getItem("survey"));
  const [responses, setResponses] = useState();
  const { setIsLoading } = useAuth();
  const navigate = useNavigate();
  const colors = [
    "#119dd8",
    "#1d5973",
    "#dc8129",
    "#29dc5e",
    "#47b8e9",
    "#dc2929",
    "#efd615",
  ];
  useEffect(() => {
    const setup = async () => {
      const survey_data = JSON.parse(localStorage.getItem("survey"));
      const response = await retrieveResponses(survey_data._id);
      if (response.length === 0) navigate("../");
      setResponses(response);
      setIsLoading(false);
    };
    setup();
    const realtimeData = setInterval(setup, 3000);

    return () => {
      clearInterval(realtimeData);
    };
  }, [retrieveResponses, setIsLoading]);
  return (
    <>
      <div className="transition-all w-full max-w-5xl mx-auto flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <PageHeader>{survey.title} Responses</PageHeader>
        </div>
        {responses && (
          <div className="bg-white rounded shadow pt-2">
            {survey.questions.map((question, index) => {
              const response = responses.map((res) => res.response[index]);
              const results = response.flat();

              const data = question.answer.map((choice, idx) => {
                return {
                  name: choice.value,
                  value: results.filter((res) => res === choice.value).length,
                  color: colors[idx],
                };
              });
              return (
                <div key={index} className="p-2 px-4">
                  <h2 className="font-bold text-xl">{`${index + 1}. ${
                    question.question
                  }`}</h2>
                  <div>
                    <ResponsiveContainer
                      width={"100%"}
                      height={350}
                      className="w-full lg:w-1/2"
                    >
                      <PieChart>
                        <Pie
                          data={data}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend verticalAlign="top" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

SurveyResponses.propTypes = {};

export default SurveyResponses;
