import PropTypes from "prop-types";
import { Badge, Button, Table } from "flowbite-react";
import { RiDeleteBinFill, RiEditBoxFill } from "react-icons/ri";
import { values as useFunction } from "../context/Functions";
import { iconButton } from "../context/CustomThemes";
import { FaUserCheck, FaUserSlash } from "react-icons/fa6";

function UsersTable({ users, setItem, setModal }) {
  const { capitalize } = useFunction();
  const headers = ["name", "position", "role", "status", "actions"];
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
      <Table.Body className="divide-y">
        {users.length > 0 ? (
          users.map((user, index) => {
            return (
              <Table.Row key={index} className="text-center">
                <Table.Cell align="center">{`${user.first_name} ${capitalize(
                  user.last_name.substring(0, 1)
                )}.`}</Table.Cell>
                <Table.Cell align="center">{user.position}</Table.Cell>
                <Table.Cell align="center">{capitalize(user.role)}</Table.Cell>
                <Table.Cell align="center">
                  <Badge
                    color={user.status === "active" ? "success" : "failure"}
                    className="w-fit uppercase font-semibold"
                    size="xs"
                  >
                    {user.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell align="center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      className="focus:ring-0 w-fit bg-white"
                      color="transparent"
                      size="sm"
                      theme={iconButton}
                      onClick={() => {
                        setItem({
                          _id: user._id,
                          first_name: user.first_name,
                          middle_name: user.middle_name,
                          last_name: user.last_name,
                          position: user.position,
                          role: user.role,
                          email_address: user.email_address,
                          username: user.username,
                        });
                        setModal({
                          toggle: true,
                          title: "edit",
                        });
                      }}
                    >
                      <RiEditBoxFill className="text-lg" />
                    </Button>
                    {user.status === "active" ? (
                      <Button
                        className="focus:ring-0 w-fit bg-white"
                        color="transparent"
                        size="sm"
                        theme={iconButton}
                        onClick={() => {
                          setItem(user);
                          setModal({
                            toggle: true,
                            title: "deactivate",
                          });
                        }}
                      >
                        <FaUserSlash className="text-lg text-c-orange" />
                      </Button>
                    ) : (
                      <Button
                        className="focus:ring-0 w-fit bg-white"
                        color="transparent"
                        size="sm"
                        theme={iconButton}
                        onClick={() => {
                          setItem(user);
                          setModal({
                            toggle: true,
                            title: "reactivate",
                          });
                        }}
                      >
                        <FaUserCheck className="text-lg text-c-green" />
                      </Button>
                    )}
                    <Button
                      className="focus:ring-0 w-fit bg-white"
                      color="transparent"
                      size="sm"
                      theme={iconButton}
                      onClick={() => {
                        setItem(user);
                        setModal({
                          toggle: true,
                          title: "delete",
                        });
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
            <Table.Cell colSpan={headers.length}>No users found</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}

UsersTable.propTypes = {
  users: PropTypes.array,
  setItem: PropTypes.func,
  setModal: PropTypes.func,
};

export default UsersTable;
