import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../fragments/PageHeader";
import { useFunction } from "../../context/Functions";
import { useStorage } from "../../context/StorageContext";

function MediaItem() {
  const id = useParams();
  const { removeUnderscore } = useFunction();
  const { getMedia } = useStorage();

  useEffect(() => {
    const media_id = localStorage.getItem("media_id");

    if (!media_id) return;

    console.log(media_id);
  }, []);
  return (
    <div>
      <PageHeader>{removeUnderscore(id.id)} Information</PageHeader>
    </div>
  );
}

export default MediaItem;
