import PropTypes from "prop-types";
import { Badge, Button, Table } from "flowbite-react";
import { RiDeleteBinFill, RiEditBoxFill } from "react-icons/ri";
import { useFunction } from "../context/Functions";
import { iconButton } from "../context/CustomThemes";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SurveyTable({ data, setItem, setModal }) {
  const { capitalize, convertText } = useFunction();
  const { setAlert } = useAuth();

  const headers = ["title", "description", "responses", "status", "actions"];
  return (
    <Table className="border bg-white rounded-md">
      <Table.Head className="shadow-md">
        {headers.map((header, index) => {
          return (
            <Table.HeadCell key={index} className="text-main text-center">
              {header}
            </Table.HeadCell>
          );
        })}
      </Table.Head>
      <Table.Body>
        {data.length > 0 ? (
          data.map((item, index) => {
            return (
              <Table.Row key={index} className="text-left">
                <Table.Cell>
                  <p>
                    <span className="font-semibold">
                      {capitalize(item.title)}
                    </span>
                  </p>
                </Table.Cell>
                <Table.Cell className="max-w-[250px] text-left">
                  <p>{item.description || "---"}</p>
                </Table.Cell>
                <Table.Cell className="max-w-[250px] text-center">
                  <Link
                    to={`./responses/${convertText(item.title)}`}
                    className="text-main underline"
                    onClick={(e) => {
                      if (item.responseCount === 0) {
                        e.preventDefault();
                        const alert = {
                          isOn: true,
                          type: "warning",
                          message:
                            "There are no responses available for this survey.",
                        };
                        setAlert(alert);
                      } else {
                        localStorage.setItem("survey", JSON.stringify(item));
                      }
                    }}
                  >
                    {item.responseCount}
                  </Link>
                </Table.Cell>
                <Table.Cell align="center">
                  <Badge
                    color={item.status === "active" ? "success" : "failure"}
                    className="w-fit uppercase font-semibold"
                    size="xs"
                  >
                    {item.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      as={Link}
                      to={`./${convertText(item.title)}`}
                      className="focus:ring-0 w-fit bg-white"
                      color="transparent"
                      size="sm"
                      theme={iconButton}
                      onClick={() => {
                        const settings = {
                          _id: item._id,
                          title: item.title,
                          description: item.description,
                        };
                        const questions = [...item.questions];
                        setItem(item);
                        localStorage.setItem("survey", item);
                        localStorage.setItem(
                          "settings_progress",
                          JSON.stringify(settings)
                        );
                        localStorage.setItem(
                          "survey_progress",
                          JSON.stringify(questions)
                        );
                      }}
                    >
                      <RiEditBoxFill className="text-lg" />
                    </Button>
                    <Button
                      className="focus:ring-0 w-fit bg-white"
                      color="transparent"
                      size="sm"
                      theme={iconButton}
                      onClick={() => {
                        setModal({
                          toggle: true,
                          title: "delete survey",
                        });
                        setItem(item);
                      }}
                    >
                      <RiDeleteBinFill className="text-lg text-c-red" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <Table.Row>
            <Table.Cell colSpan={headers.length}>No surveys found</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}

SurveyTable.propTypes = {
  data: PropTypes.array,
  setItem: PropTypes.func,
  setModal: PropTypes.func,
};

export default SurveyTable;
