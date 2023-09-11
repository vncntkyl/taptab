import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import { useUsers } from "../context/UserContext";
import PageHeader from "../fragments/PageHeader";
import { values as useFunction } from "../context/Functions";
import { RiDeleteBinFill, RiEditBoxFill } from "react-icons/ri";

function UserAccounts() {
  const { getUsers } = useUsers();
  const { capitalize } = useFunction();
  const [users, setUsers] = useState(null);
  const headers = ["name", "position", "role", "actions"];

  useEffect(() => {
    const setup = async () => {
      const response = await getUsers();
      setUsers(response);
      console.log(response);
    };
    setup();
  }, [getUsers]);
  return (
    users && (
      <>
        <div className="transition-all w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <PageHeader>Manage User Accounts</PageHeader>
            <Button
              className="focus:ring-0 w-fit bg-white"
              color="transparent"
              theme={{
                base: "group flex h-min items-center justify-center p-0 text-center font-medium relative focus:z-10 focus:outline-none shadow-md text-main border border-main hover:bg-main hover:text-white",
                inner: {
                  base: "flex items-center gap-2",
                },
              }}
            >
              <BsPersonFillAdd />
              <p>Create User</p>
            </Button>
          </div>
          <div className="w-full overflow-x-auto rounded-md shadow-md">
            <Table className="border bg-white">
              <Table.Head className="shadow-md">
                {headers.map((header, index) => {
                  return (
                    <Table.HeadCell
                      key={index}
                      className="text-main text-center"
                    >
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
                                base: "group flex h-min items-center justify-center p-0 text-center font-medium relative focus:z-10 focus:outline-none text-yellow",
                              }}
                            >
                              <RiEditBoxFill className="text-lg" />
                            </Button>
                            <Button
                              className="focus:ring-0 w-fit bg-white"
                              color="transparent"
                              size="sm"
                              theme={{
                                base: "group flex h-min items-center justify-center p-0 text-center font-medium relative focus:z-10 focus:outline-none text-red",
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
                    <Table.Cell colSpan={headers.length}>
                      No users found
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </div>
      </>
    )
  );
}

export default UserAccounts;
