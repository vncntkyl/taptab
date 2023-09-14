import PropTypes from "prop-types";
import { Badge, Button, Table } from "flowbite-react";
import { RiDeleteBinFill, RiEditBoxFill } from "react-icons/ri";
import { values as useFunction } from "../context/Functions";
import { iconButton } from "../context/CustomThemes";

function MediaLibraryTable({ media, setItem, setModal }) {
  const { capitalize, convertText } = useFunction();
  const headers = ["", "Preview", "name", "details", "date_modified", "actions"];
  return (
    <Table className="border bg-white rounded-md">
      <Table.Head className="shadow-md">
        {headers.map((header, index) => {
          return (
            <Table.HeadCell key={index} className="text-main text-center">
              {convertText(header)}
            </Table.HeadCell>
          );
        })}
      </Table.Head>
      <Table.Body className="divide-y">
        {media.length > 0 ? (
          media.map((item, index) => {
            return (
              <Table.Row key={index} className="text-center">
                <Table.Cell align="center" className="max-w-fit">[x]</Table.Cell>
                <Table.Cell align="center">a</Table.Cell>
                <Table.Cell align="center">1234</Table.Cell>
                <Table.Cell align="center">a</Table.Cell>
                <Table.Cell align="center">b</Table.Cell>
                <Table.Cell align="center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      className="focus:ring-0 w-fit bg-white"
                      color="transparent"
                      size="sm"
                      theme={iconButton}
                      onClick={() => {
                        setModal({
                          toggle: true,
                          title: "edit",
                        });
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
            <Table.Cell colSpan={headers.length}>No media found</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}

MediaLibraryTable.propTypes = {
  media: PropTypes.array,
  setItem: PropTypes.func,
  setModal: PropTypes.func,
};

export default MediaLibraryTable;
