import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import PropTypes from "prop-types";
import { useState } from "react";
import Container from "./Container";
import { createPortal } from "react-dom";
import MediaItem from "./MediaItem";
import { arrayMove } from "@dnd-kit/sortable";

function MediaSelection({ mediaLibrary, updateMedia }) {
  const [columns, setColumns] = useState(["media", "playlist"]);
  const [activeItem, setActiveItem] = useState({
    id: null,
    type: null,
  });

  const onDragStart = (e) => {
    setActiveItem({
      id: e.active.id,
      type: e.active.data.current.type,
    });
  };
  const onDragEnd = (e) => {
    const { active, over } = e;
    if (!over) return;
    const activeColumnID = active.id;
    const overColumnID = over.id;

    console.log(activeColumnID, overColumnID);

    // setColumns((columns) => {
    //   const activeColumnIndex = columns.findIndex(
    //     (col) => col === activeColumnID
    //   );
    //   const overColumnIndex = columns.findIndex((col) => col === overColumnID);
    //   return arrayMove(columns, activeColumnIndex, overColumnIndex);
    // });
  };

  const onDragOver = (e) => {
    const { active, over } = e;
    if (!over) return;
    const activeColumnID = active.id;
    const overColumnID = over.id;
    const isMedia = active.data.current.type === "media";
    const isOverContainer = over.data.current.type === "container";
    const isOverMedia = over.data.current.type === "media";

    if (isMedia && isOverMedia) {
      updateMedia((items) => {
        const activeIndex = items.findIndex(
          (item) => item._id == activeColumnID
        );
        const overIndex = items.findIndex((item) => item._id === overColumnID);
        mediaLibrary[activeIndex].container = mediaLibrary[overIndex].container;

        return arrayMove(mediaLibrary, activeIndex, overIndex);
      });
    }
    if (isMedia && isOverContainer) {
      updateMedia((items) => {
        const activeIndex = items.findIndex(
          (item) => item._id == activeColumnID
        );
        mediaLibrary[activeIndex].container = overColumnID;

        return arrayMove(mediaLibrary, activeIndex, activeIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
    >
      <div className="flex flex-col lg:flex-row gap-2 touch-none">
        {columns.map((column) => {
          return <Container key={column} title={column} items={mediaLibrary} />;
        })}
      </div>
      {createPortal(
        <DragOverlay>
          {Object.values(activeItem) !== null ? (
            <MediaItem
              item={mediaLibrary.find((item) => item._id == activeItem.id)}
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

MediaSelection.propTypes = {
  mediaLibrary: PropTypes.array,
  updateMedia: PropTypes.func,
};

export default MediaSelection;
