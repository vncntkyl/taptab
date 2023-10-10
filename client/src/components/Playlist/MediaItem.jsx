import { useSortable } from "@dnd-kit/sortable";
import { useFunction } from "../../context/Functions";
import PropTypes from "prop-types";
import { BsImageAlt } from "react-icons/bs";
import { CSS } from "@dnd-kit/utilities";

function MediaItem({ item }) {
  const { capitalize, removeUnderscore } = useFunction();
  const {
    setNodeRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: item._id,
    data: {
      type: "media",
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="flex items-center gap-2 rounded bg-default-dark-2 border-2 border-secondary-dark min-h-[105px]"
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex items-center gap-2 rounded bg-default p-2"
    >
      <Preview item={item} />
      <div className="flex flex-col items-start gap-1 h-full">
        <p className="text-lg font-bold">
          {capitalize(
            removeUnderscore(item.name ? item.name : stripName(item.fileName))
          )}
        </p>
        <p className="text-sm">
          <span>Category: </span>
          {item.category || "N/A"}
        </p>
        <p className="text-sm">
          <span>Type: </span>
          {capitalize(item.type || "video")}
        </p>
      </div>
    </div>
  );
}

const stripName = (name) => {
  if (!name.includes("thumbnail")) return;

  const parts = name.split("/");
  const fileName = parts[parts.length - 1];

  return fileName.replace(/^thumbnail\//, "").replace(/_tmb\.\w+$/, "");
};
function Preview({ item }) {
  const getFileURL = (objectName) => {
    return `https://storage.googleapis.com/tamc_advertisements/${objectName}`;
  };
  if (item._urlID) {
    return (
      <img
        src={getFileURL(item._urlID)}
        key={item._id}
        alt=""
        className="aspect-square overflow-hidden object-cover max-w-[100px] rounded"
      />
    );
  } else {
    return (
      <div
        key={item._id}
        className="w-[100px] h-[100px] flex items-center justify-center rounded bg-default-dark-2"
      >
        <BsImageAlt className="text-7xl" />
      </div>
    );
  }
}
Preview.propTypes = {
  item: PropTypes.object,
};
MediaItem.propTypes = {
  item: PropTypes.object,
};

export default MediaItem;
