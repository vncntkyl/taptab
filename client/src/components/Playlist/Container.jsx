import PropTypes from "prop-types";
import { useFunction } from "../../context/Functions";
import { useMemo } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import MediaItem from "./MediaItem";

function Container({ title, items }) {
  const { capitalize, convertText } = useFunction();

  const IDs = useMemo(() => {
    return items.map((item) => item._id);
  }, [items]);
  const { setNodeRef } = useSortable({
    id: title,
    data: {
      type: "container",
    },
  });

  return (
    <section
      className="w-full bg-white rounded shadow-md flex flex-col gap-2 h-[500px] max-h-[500px]"
      ref={setNodeRef}
    >
      <header className="bg-secondary-dark p-2 text-white font-bold rounded-t">
        {capitalize(convertText(title))}
      </header>
      <main className="p-2 overflow-y-auto flex flex-col gap-2 cursor-auto">
        <SortableContext items={IDs}>
          {items.length > 0 ? (
            items
              .filter((item) => item.container === title)
              .map((item) => {
                return <MediaItem item={item} key={item._id} />;
              })
          ) : (
            <>No media found</>
          )}
        </SortableContext>
      </main>
    </section>
  );
}

Container.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array,
};

export default Container;
