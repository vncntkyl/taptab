import { useDroppable } from "@dnd-kit/core";

function Droppable({ id, allowedDraggables, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { allowedDraggables },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        border: isOver ? "2px solid green" : "1px solid black",
        padding: "10px",
        margin: "10px",
      }}
    >
      {children}
    </div>
  );
}

export default Droppable;
