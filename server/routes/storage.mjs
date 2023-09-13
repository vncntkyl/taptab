import express from "express";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_KEYFILE_PATH,
});
const router = express.Router();
const bucket = storage.bucket(process.env.GCLOUD_BUCKET_NAME);
//GET FILES

function getFileURL(objectName) {
  return `https://storage.googleapis.com/tamc_advertisements/${objectName}`;
}

router.get("/", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const items = [];

    files.forEach((file) => {
      items.push({
        _id: file.metadata.generation,
        _urlID: file.id,
        name: file.name,
        contentType: file.metadata.contentType,
        size: file.metadata.size,
        bucket: file.metadata.bucket,
        timeCreated: file.metadata.timeCreated,
        timeUpdated: file.metadata.updated,
      });
    });
    res.send(items).status(200);
  } catch (error) {
    console.error("Error listing bucket contents:", error);
    res.status(500).send(error);
  }
});

export default router;
