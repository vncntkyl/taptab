import PropTypes from "prop-types";
import { Button, Table } from "flowbite-react";
import { RiDeleteBinFill, RiEditBoxFill } from "react-icons/ri";
import { values as useFunction } from "../context/Functions";

function UsersTable({ users }) {
  const { capitalize } = useFunction();
  const headers = ["name", "position", "role", "actions"];
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
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      className="focus:ring-0 w-fit bg-white"
                      color="transparent"
                      size="sm"
                      theme={{
                        base: "group flex h-min items-center justify-center p-0 text-center font-medium relative focus:z-10 focus:outline-none text-c-yellow",
                      }}
                    >
                      <RiEditBoxFill className="text-lg" />
                    </Button>
                    <Button
                      className="focus:ring-0 w-fit bg-white"
                      color="transparent"
                      size="sm"
                      theme={{
                        base: "group flex h-min items-center justify-center p-0 text-center font-medium relative focus:z-10 focus:outline-none text-c-red",
                      }}
                    >
                      <RiDeleteBinFill className="text-lg" />
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
};

export default UsersTable;
