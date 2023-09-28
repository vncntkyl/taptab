import { useState } from "react";
import Draggable from "./Draggable";
import Droppable from "./Droppable";
import { DndContext } from "@dnd-kit/core";

function Context() {
  const containers = ["A", "B", "C"];
  const [parent, setParent] = useState(null);

  const draggableMarkups = [
    <Draggable key="draggable-1" id="draggable-1">
      Drag me 1
    </Draggable>,
    <Draggable key="draggable-2" id="draggable-2">
      Drag me 2
    </Draggable>,
    // Add more draggable elements as needed
  ];

  const droppableMarkups = containers.map((id) => (
    <Droppable key={id} id={id} allowedDraggables={[`draggable-${id}`]}>
      {parent === id ? draggableMarkups : `Drop here for ${id}`}
    </Droppable>
  ));

  function handleDragEnd(event) {
    const { over } = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {parent === null ? draggableMarkups.find() : null}

      {droppableMarkups}
    </DndContext>
  );
}

export default Context;
